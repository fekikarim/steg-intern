import { Injectable, inject, NgZone, OnDestroy } from '@angular/core';
import { Subject, Observable, timer } from 'rxjs';
import { RealtimeEvent } from '../models/realtime.model';
import { AuthService } from './auth.service';
import { APP_CONFIG } from '../config/app.config';

/**
 * Client-side service that maintains a persistent SSE (Server-Sent Events)
 * connection to the backend and re-emits domain events as RxJS Observables.
 *
 * <p>Each feature area subscribes to the {@link events$} stream and filters
 * by entity type. The connection auto-reconnects on drop with exponential
 * back-off (2s → 4s → 8s → … capped at 30s).</p>
 */
@Injectable({ providedIn: 'root' })
export class RealtimeService implements OnDestroy {
  private readonly config = inject(APP_CONFIG);
  private readonly authService = inject(AuthService);
  private readonly zone = inject(NgZone);

  private eventSource: EventSource | null = null;
  private readonly events$ = new Subject<RealtimeEvent>();
  private reconnectDelay = 2000;
  private destroyed = false;

  constructor() {
    this.connect();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.disconnect();
    this.events$.complete();
  }

  /** Observable stream of all real-time events from the backend. */
  get events(): Observable<RealtimeEvent> {
    return this.events$.asObservable();
  }

  /**
   * Returns an Observable that emits events for a specific entity type.
   * @example
   * service.of('USER').subscribe(e => console.log(e.action));
   */
  of(entity: string): Observable<RealtimeEvent> {
    return new Observable<RealtimeEvent>((subscriber) => {
      const sub = this.events$.subscribe({
        next: (event) => {
          if (event.entity === entity) {
            subscriber.next(event);
          }
        },
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete()
      });
      return () => sub.unsubscribe();
    });
  }

  /**
   * Returns an Observable that emits events matching both entity and action.
   * @example
   * service.ofAction('USER', 'CREATED').subscribe(e => refreshList());
   */
  ofAction(entity: string, action: string): Observable<RealtimeEvent> {
    return new Observable<RealtimeEvent>((subscriber) => {
      const sub = this.events$.subscribe({
        next: (event) => {
          if (event.entity === entity && event.action === action) {
            subscriber.next(event);
          }
        },
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete()
      });
      return () => sub.unsubscribe();
    });
  }

  /** Returns true if the SSE connection is currently open. */
  get connected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }

  /** Force a reconnection (e.g. after token refresh). */
  reconnect(): void {
    this.disconnect();
    this.reconnectDelay = 2000;
    this.connect();
  }

  private connect(): void {
    if (this.destroyed) {
      return;
    }

    const token = this.authService.currentAccessToken();
    const baseUrl = this.config.apiBaseUrl.replace('/api/v1', '');
    const url = `${baseUrl}/api/v1/realtime/events?token=${encodeURIComponent(token ?? '')}`;

    // Run EventSource outside Angular zone to avoid triggering change detection
    // on every SSE message. We re-enter the zone when emitting events.
    this.zone.runOutsideAngular(() => {
      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        this.reconnectDelay = 2000;
        console.log('[Realtime] Connected');
      };

      this.eventSource.onmessage = (msg) => {
        try {
          const event: RealtimeEvent = JSON.parse(msg.data);
          // Re-enter Angular zone for change detection
          this.zone.run(() => {
            this.events$.next(event);
          });
        } catch {
          console.warn('[Realtime] Failed to parse SSE message');
        }
      };

      // Named events (e.g., "USER:CREATED", "ROLE:UPDATED")
      this.eventSource.addEventListener('message', () => {
        // Already handled by onmessage above
      });

      this.eventSource.onerror = () => {
        console.warn('[Realtime] Connection lost. Reconnecting in', this.reconnectDelay / 1000, 's');
        this.disconnect();
        this.scheduleReconnect();
      };
    });
  }

  private scheduleReconnect(): void {
    if (this.destroyed) {
      return;
    }
    // Re-enter zone for timer
    this.zone.runOutsideAngular(() => {
      timer(this.reconnectDelay).subscribe(() => {
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
        this.connect();
      });
    });
  }

  private disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
