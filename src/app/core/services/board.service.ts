import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Board, BoardResponse, Card, Label, User } from '../models/trello.models';

@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly http = inject(HttpClient);
  private readonly boardSignal = signal<Board | null>(null);
  private readonly usersSignal = signal<User[]>([]);
  private readonly labelsSignal = signal<Label[]>([]);

  readonly board = this.boardSignal.asReadonly();
  readonly users = this.usersSignal.asReadonly();
  readonly labels = this.labelsSignal.asReadonly();

  readonly memberMap = computed(
    () => Object.fromEntries(this.usersSignal().map((user) => [user.id, user])) as Record<string, User>
  );

  readonly labelMap = computed(
    () => Object.fromEntries(this.labelsSignal().map((label) => [label.id, label])) as Record<string, Label>
  );

  loadBoard(): void {
    this.http.get<BoardResponse>('/assets/data/fakedb.json').subscribe((response) => {
      this.usersSignal.set(response.users);
      this.labelsSignal.set(response.labels);
      this.boardSignal.set(this.normalizeBoard(response.board));
    });
  }

  createCard(listId: string, title: string, labelIds: string[] = []): void {
    const board = this.boardSignal();
    if (!board) {
      return;
    }

    const sanitizedTitle = title.trim() || 'Novo cartão';
    const defaultMemberIds = this.usersSignal().length ? [this.usersSignal()[Math.floor(Math.random() * this.usersSignal().length)].id] : [];
    const nextBoard: Board = {
      ...board,
      lists: board.lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: [
                ...list.cards,
                {
                  id: this.nextId('card'),
                  title: sanitizedTitle,
                  labelIds: labelIds.filter(Boolean),
                  memberIds: defaultMemberIds,
                  hasDescription: false,
                },
              ],
            }
          : list
      ),
    };

    this.boardSignal.set(this.normalizeBoard(nextBoard));
  }

  deleteCard(listId: string, cardId: string): void {
    const board = this.boardSignal();
    if (!board) {
      return;
    }

    const nextBoard: Board = {
      ...board,
      lists: board.lists.map((list) =>
        list.id === listId
          ? { ...list, cards: list.cards.filter((card) => card.id !== cardId) }
          : list
      ),
    };

    this.boardSignal.set(this.normalizeBoard(nextBoard));
  }

  moveCard(cardId: string, fromListId: string, toListId: string): void {
    const board = this.boardSignal();
    if (!board || fromListId === toListId) {
      return;
    }

    const sourceList = board.lists.find((list) => list.id === fromListId);
    const targetList = board.lists.find((list) => list.id === toListId);
    if (!sourceList || !targetList) {
      return;
    }

    const card = sourceList.cards.find((item) => item.id === cardId);
    if (!card) {
      return;
    }

    const nextBoard: Board = {
      ...board,
      lists: board.lists.map((list) => {
        if (list.id === fromListId) {
          return { ...list, cards: list.cards.filter((item) => item.id !== cardId) };
        }

        if (list.id === toListId) {
          return { ...list, cards: [...list.cards, { ...card, memberIds: card.memberIds ?? [] }] };
        }

        return list;
      }),
    };

    this.boardSignal.set(this.normalizeBoard(nextBoard));
  }

  toggleLabel(listId: string, cardId: string, labelId: string): void {
    const board = this.boardSignal();
    if (!board) {
      return;
    }

    const nextBoard: Board = {
      ...board,
      lists: board.lists.map((list) => {
        if (list.id !== listId) {
          return list;
        }

        return {
          ...list,
          cards: list.cards.map((card) => {
            if (card.id !== cardId) {
              return card;
            }

            const nextLabelIds = card.labelIds?.includes(labelId)
              ? (card.labelIds ?? []).filter((id) => id !== labelId)
              : [...(card.labelIds ?? []), labelId];

            return { ...card, labelIds: nextLabelIds };
          }),
        };
      }),
    };

    this.boardSignal.set(this.normalizeBoard(nextBoard));
  }

  setCardMember(listId: string, cardId: string, memberId: string | null): void {
    const board = this.boardSignal();
    if (!board) {
      return;
    }

    const nextBoard: Board = {
      ...board,
      lists: board.lists.map((list) => {
        if (list.id !== listId) {
          return list;
        }

        return {
          ...list,
          cards: list.cards.map((card) => {
            if (card.id !== cardId) {
              return card;
            }

            return { ...card, memberIds: memberId ? [memberId] : [] };
          }),
        };
      }),
    };

    this.boardSignal.set(this.normalizeBoard(nextBoard));
  }

  updateCardDetails(
    listId: string,
    cardId: string,
    details: { title: string; labelIds: string[]; memberId: string | null }
  ): void {
    const board = this.boardSignal();
    if (!board) {
      return;
    }

    const nextBoard: Board = {
      ...board,
      lists: board.lists.map((list) => {
        if (list.id !== listId) {
          return list;
        }

        return {
          ...list,
          cards: list.cards.map((card) => {
            if (card.id !== cardId) {
              return card;
            }

            return {
              ...card,
              title: details.title.trim() || card.title,
              labelIds: details.labelIds.filter(Boolean),
              memberIds: details.memberId ? [details.memberId] : [],
            };
          }),
        };
      }),
    };

    this.boardSignal.set(this.normalizeBoard(nextBoard));
  }

  private normalizeBoard(board: Board): Board {
    return {
      ...board,
      lists: board.lists.map((list) => ({
        ...list,
        cards: list.cards.map((card) => ({
          ...card,
          labelIds: card.labelIds ?? [],
          memberIds: card.memberIds ?? [],
        })),
      })),
    };
  }

  private nextId(prefix: string): string {
    return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
  }
}
