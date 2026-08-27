import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'steg-avatar',
  standalone: true,
  host: {
    '[class]': "`avatar avatar-${size()}`",
    '[style.background]': 'background()',
    '[title]': 'name()'
  },
  template: `<span aria-hidden="true">{{ initials() }}</span>`,
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
      }
      .avatar-sm {
        width: 2rem;
        height: 2rem;
        font-size: 0.75rem;
      }
      .avatar-md {
        width: 2.5rem;
        height: 2.5rem;
        font-size: 0.875rem;
      }
      .avatar-lg {
        width: 3.25rem;
        height: 3.25rem;
        font-size: 1.125rem;
      }
    `
  ]
})
export class AvatarComponent {
  readonly name = input('');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly background = input('#c8102e');

  readonly initials = computed(() => {
    const name = this.name().trim();
    if (!name) {
      return '?';
    }
    const parts = name.split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });
}
