import { Component, Input } from '@angular/core';
import { User } from '../../../core/models/trello.models';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    @if (user) {
      <span
        class="avatar"
        [class.has-image]="!!user.avatarUrl"
        [style.background]="user.avatarUrl ? 'url(' + user.avatarUrl + ') center/cover' : 'linear-gradient(135deg, #c2d7ff, #8aa7ff)'"
      >
        @if (!user.avatarUrl) {
          {{ initials }}
        }
      </span>
    }
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }

      .avatar {
        width: 28px;
        height: 28px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 10px;
        font-weight: 700;
        color: #172b4d;
        border: 2px solid #fff;
        box-shadow: 0 1px 2px rgba(9, 30, 66, 0.15);
      }

      .has-image {
        border: 1px solid rgba(255, 255, 255, 0.8);
      }
    `,
  ],
})
export class AvatarComponent {
  @Input() user: User | null = null;

  get initials(): string {
    if (!this.user?.name) {
      return '';
    }

    return this.user.name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
