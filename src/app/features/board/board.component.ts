import { Component, computed, inject, OnInit } from '@angular/core';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { BoardService } from '../../core/services/board.service';
import { ListComponent } from './list.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [ListComponent, AvatarComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent implements OnInit {
  private readonly boardService = inject(BoardService);

  readonly board = computed(() => this.boardService.board());
  readonly users = computed(() => this.boardService.users());
  readonly labels = computed(() => this.boardService.labels());
  readonly memberMap = computed(() => this.boardService.memberMap());

  ngOnInit(): void {
    this.boardService.loadBoard();
  }

  createCard(event: { listId: string; title: string; labelIds?: string[] }): void {
    this.boardService.createCard(event.listId, event.title, event.labelIds ?? []);
  }

  deleteCard(event: { listId: string; cardId: string }): void {
    this.boardService.deleteCard(event.listId, event.cardId);
  }

  moveCard(event: { cardId: string; fromListId: string; toListId: string }): void {
    this.boardService.moveCard(event.cardId, event.fromListId, event.toListId);
  }

  toggleLabel(event: { listId: string; cardId: string; labelId: string }): void {
    this.boardService.toggleLabel(event.listId, event.cardId, event.labelId);
  }

  setMember(event: { listId: string; cardId: string; memberId: string | null }): void {
    this.boardService.setCardMember(event.listId, event.cardId, event.memberId);
  }

  editCard(event: { listId: string; cardId: string; title: string; labelIds: string[]; memberId: string | null }): void {
    this.boardService.updateCardDetails(event.listId, event.cardId, {
      title: event.title,
      labelIds: event.labelIds,
      memberId: event.memberId,
    });
  }
}
