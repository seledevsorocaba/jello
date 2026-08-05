export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Card {
  id: string;
  title: string;
  labelIds?: string[];
  dueDate?: string;
  dueDateStatus?: 'done' | 'pending';
  hasDescription?: boolean;
  checklist?: string;
  attachments?: number;
  memberIds?: string[];
}

export interface TrelloList {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  workspace: string;
  visibility: string;
  members: string[];
  lists: TrelloList[];
}

export interface BoardResponse {
  users: User[];
  labels: Label[];
  board: Board;
}
