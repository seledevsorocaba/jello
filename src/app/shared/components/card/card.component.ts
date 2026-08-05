import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card, Label, User } from '../../../core/models/trello.models';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [AvatarComponent, FormsModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() card!: Card;
  @Input() labels: Label[] = [];
  @Input() users: User[] = [];
  @Input() listId!: string;

  @Output() moveCard = new EventEmitter<{ cardId: string; fromListId: string; toListId: string }>();
  @Output() deleteCard = new EventEmitter<string>();
  @Output() toggleLabel = new EventEmitter<string>();
  @Output() setMember = new EventEmitter<string | null>();
  @Output() editCard = new EventEmitter<{ listId: string; cardId: string; title: string; labelIds: string[]; memberId: string | null }>();

  isEditing = false;
  draftTitle = '';
  draftLabelIds: string[] = [];
  draftMemberId: string | null = null;

  private ghostElement: HTMLElement | null = null;
  private dragging = false;
  private pointerMoveHandler = (event: PointerEvent): void => {
    if (!this.ghostElement) {
      return;
    }

    const dx = event.clientX - this._dragStartX;
    const dy = event.clientY - this._dragStartY;
    this.ghostElement.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  private pointerUpHandler = (event: PointerEvent): void => {
    const target = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
    const listElement = target?.closest('[data-list-id]') as HTMLElement | null;
    const toListId = listElement?.dataset?.['listId'];

    if (toListId && toListId !== this.listId) {
      this.moveCard.emit({ cardId: this.card.id, fromListId: this.listId, toListId });
    }

    this.cleanupDrag();
  };

  private _dragStartX = 0;
  private _dragStartY = 0;

  get selectedMemberId(): string | null {
    return this.card.memberIds?.[0] ?? null;
  }

  get selectedMember(): User | undefined {
    return this.memberById(this.selectedMemberId ?? '');
  }

  labelById(id: string): Label | undefined {
    return this.labels.find((label) => label.id === id);
  }

  memberById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  hasLabel(labelId: string): boolean {
    return !!this.card.labelIds?.includes(labelId);
  }

  openEditModal(): void {
    this.draftTitle = this.card.title;
    this.draftLabelIds = [...(this.card.labelIds ?? [])];
    this.draftMemberId = this.selectedMemberId;
    this.isEditing = true;
  }

  closeEditModal(): void {
    this.isEditing = false;
    this.draftTitle = '';
    this.draftLabelIds = [];
    this.draftMemberId = null;
  }

  toggleDraftLabel(labelId: string): void {
    if (this.draftLabelIds.includes(labelId)) {
      this.draftLabelIds = this.draftLabelIds.filter((id) => id !== labelId);
      return;
    }

    this.draftLabelIds = [...this.draftLabelIds, labelId];
  }

  saveCardChanges(): void {
    const title = this.draftTitle.trim();
    if (!title) {
      return;
    }

    this.editCard.emit({
      listId: this.listId,
      cardId: this.card.id,
      title,
      labelIds: this.draftLabelIds,
      memberId: this.draftMemberId ?? null,
    });

    this.closeEditModal();
  }

  onPointerDown(event: PointerEvent): void {
    const interactive = (event.target as HTMLElement)?.closest('button, select, option');
    if (interactive) {
      return;
    }

    const article = event.currentTarget as HTMLElement;
    const rect = article.getBoundingClientRect();
    this._dragStartX = event.clientX;
    this._dragStartY = event.clientY;
    this.dragging = true;
    article.classList.add('dragging');

    this.ghostElement = article.cloneNode(true) as HTMLElement;
    this.ghostElement.classList.add('ghost-card');
    this.ghostElement.style.width = `${rect.width}px`;
    this.ghostElement.style.left = `${rect.left}px`;
    this.ghostElement.style.top = `${rect.top}px`;
    this.ghostElement.style.opacity = '0.96';
    document.body.appendChild(this.ghostElement);

    window.addEventListener('pointermove', this.pointerMoveHandler);
    window.addEventListener('pointerup', this.pointerUpHandler, { once: true });
    event.preventDefault();
  }

  private cleanupDrag(): void {
    this.dragging = false;
    const article = document.querySelector(`app-card .card.dragging`) as HTMLElement | null;
    article?.classList.remove('dragging');

    if (this.ghostElement) {
      this.ghostElement.remove();
      this.ghostElement = null;
    }

    window.removeEventListener('pointermove', this.pointerMoveHandler);
    window.removeEventListener('pointerup', this.pointerUpHandler);
  }

  onMemberChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.setMember.emit(select.value || null);
  }
}
