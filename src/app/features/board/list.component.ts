import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Label, TrelloList, User } from '../../core/models/trello.models';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CardComponent, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent {
  @Input() list!: TrelloList;
  @Input() labels: Label[] = [];
  @Input() users: User[] = [];

  @Output() createCard = new EventEmitter<{ listId: string; title: string; labelIds?: string[] }>();
  @Output() deleteCard = new EventEmitter<{ listId: string; cardId: string }>();
  @Output() moveCard = new EventEmitter<{ cardId: string; fromListId: string; toListId: string }>();
  @Output() toggleLabel = new EventEmitter<{ listId: string; cardId: string; labelId: string }>();
  @Output() setMember = new EventEmitter<{ listId: string; cardId: string; memberId: string | null }>();
  @Output() editCard = new EventEmitter<{ listId: string; cardId: string; title: string; labelIds: string[]; memberId: string | null }>();

  isCreating = false;
  newCardTitle = '';
  selectedLabelIds: string[] = [];

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (this.isCreating && keyboardEvent.key === 'Escape') {
      this.cancelCreate();
    }
  }

  startCreate(): void {
    this.isCreating = true;
    this.newCardTitle = '';
    this.selectedLabelIds = [];
  }

  cancelCreate(): void {
    this.isCreating = false;
    this.newCardTitle = '';
    this.selectedLabelIds = [];
  }

  toggleLabelSelection(labelId: string): void {
    if (this.selectedLabelIds.includes(labelId)) {
      this.selectedLabelIds = this.selectedLabelIds.filter((id) => id !== labelId);
      return;
    }

    this.selectedLabelIds = [...this.selectedLabelIds, labelId];
  }

  submitNewCard(): void {
    const title = this.newCardTitle.trim();
    if (!title) {
      return;
    }

    this.createCard.emit({ listId: this.list.id, title, labelIds: this.selectedLabelIds });
    this.newCardTitle = '';
    this.selectedLabelIds = [];
    this.isCreating = false;
  }

  onCardDragStart(event: { cardId: string; listId: string; event: DragEvent }): void {
    event.event.dataTransfer?.setData(
      'application/jello-card',
      JSON.stringify({ cardId: event.cardId, fromListId: event.listId })
    );
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const payload = event.dataTransfer?.getData('application/jello-card');
    if (!payload) {
      return;
    }

    const data = JSON.parse(payload) as { cardId: string; fromListId: string };
    if (data.fromListId !== this.list.id) {
      this.moveCard.emit({ cardId: data.cardId, fromListId: data.fromListId, toListId: this.list.id });
    }
  }
}
