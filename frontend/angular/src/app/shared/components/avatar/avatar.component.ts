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

const SIZES: Record<string, { w: string; h: string; fs: string }> = {
  sm: { w: '2.25rem', h: '2.25rem', fs: '0.75rem' },
  md: { w: '2.75rem', h: '2.75rem', fs: '0.875rem' },
  lg: { w: '3.75rem', h: '3.75rem', fs: '1.125rem' }
};

@Component({
  selector: 'steg-avatar',
  standalone: true,
  host: {
    '[class]': '`avatar avatar-${size()}`',
    '[style.width]': 'sizeMap().w',
    '[style.height]': 'sizeMap().h',
    '[style.font-size]': 'sizeMap().fs',
    '[style.background]': 'avatarBackground()',
    '[title]': 'name()',
    role: 'img'
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
        flex-grow: 0;
        user-select: none;
        position: relative;
        box-shadow: 0 2px 6px rgba(16, 24, 40, 0.18);
        letter-spacing: 0.04em;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        aspect-ratio: 1;
      }
      .avatar-inner {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        line-height: 1;
      }
    `
  ]
})
export class AvatarComponent {
  readonly name = input('');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly background = input('#c8102e');

  readonly sizeMap = computed(() => SIZES[this.size()] ?? SIZES['md']);

  readonly avatarBackground = computed(() => {
    const base = this.background() || '#c8102e';
    return `linear-gradient(145deg, ${base} 0%, ${darken(base, 32)} 100%)`;
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
