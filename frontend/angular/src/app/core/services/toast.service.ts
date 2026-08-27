import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  title?: string;
}

const DEFAULT_DURATION_MS = 5000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toasts = signal<Toast[]>([]);
  private nextId = 1;

  readonly items = this.toasts.asReadonly();

  success(message: string, title?: string): void {
    this.show('success', message, title);
  }

  error(message: string, title?: string): void {
    this.show('error', message, title);
  }

  info(message: string, title?: string): void {
    this.show('info', message, title);
  }

  warning(message: string, title?: string): void {
    this.show('warning', message, title);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((toast) => toast.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }

  private show(type: ToastType, message: string, title?: string): void {
    const toast: Toast = { id: this.nextId++, type, message, title };
    this.toasts.update((list) => [...list, toast]);
    window.setTimeout(() => this.dismiss(toast.id), DEFAULT_DURATION_MS);
  }
}
