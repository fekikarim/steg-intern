import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

interface ConfirmRequest {
  options: ConfirmOptions;
  resolve: (result: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private readonly state = signal<ConfirmRequest | null>(null);

  readonly current = this.state.asReadonly();

  confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.state.set({ options, resolve });
    });
  }

  accept(): void {
    const request = this.state();
    if (!request) {
      return;
    }
    request.resolve(true);
    this.state.set(null);
  }

  dismiss(): void {
    const request = this.state();
    if (!request) {
      return;
    }
    request.resolve(false);
    this.state.set(null);
  }
}
