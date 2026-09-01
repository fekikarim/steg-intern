import { Component, computed, input } from '@angular/core';

function darken(hex: string, amt: number): string {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full || 'c8102e', 16);
  const r = Math.max(0, (num >> 16) & 255) - amt;
  const g = Math.max(0, (num >> 8) & 255) - amt;
  const b = Math.max(0, num & 255) - amt;
  return `rgb(${r}, ${g}, ${b})`;
}

@Component({
  selector: 'steg-avatar',
  standalone: true,
  host: {
    '[class]': "`avatar avatar-${size()}`",
    '[style.background]': 'avatarBackground()',
    '[title]': 'name()'
  },
  template: `<span class="avatar-inner" aria-hidden="true">{{ initials() }}</span>`,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-weight: 600;
        color: #fff;
        flex-shrink: 0;
        user-select: none;
        position: relative;
        border: 2px solid rgba(255, 255, 255, 0.9);
        box-shadow:
          0 1px 2px rgba(16, 24, 40, 0.12),
          inset 0 1px 0 rgba(255, 255, 255, 0.25);
        letter-spacing: 0.01em;
      }
      .avatar-inner {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
      .avatar-sm {
        width: 2rem;
        height: 2rem;
        font-size: 0.6875rem;
      }
      .avatar-md {
        width: 2.5rem;
        height: 2.5rem;
        font-size: 0.8125rem;
      }
      .avatar-lg {
        width: 3.25rem;
        height: 3.25rem;
        font-size: 1rem;
      }
    `
  ]
})
export class AvatarComponent {
  readonly name = input('');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly background = input('#c8102e');

  readonly avatarBackground = computed(() => {
    const base = this.background() || '#c8102e';
    return `linear-gradient(145deg, ${base} 0%, ${darken(base, 28)} 100%)`;
  });

  readonly initials = computed(() => {
    const name = this.name().trim();
    if (!name) {
      return '?';
    }
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });
}
