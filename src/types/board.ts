export interface CardComment {
  id: string;
  text: string;
  createdAt: number;
}

export interface Card {
  id: string;
  title: string;
  listId: string;
  comments: CardComment[];
  done?: boolean;
}

export interface List {
  id: string;
  title: string;
  cardIds: string[];
}

export interface Board {
  id: string;
  title: string;
  listIds: string[];
}

export interface Snapshot {
  board: Board;
  lists: Record<string, List>;
  cards: Record<string, Card>;
  version: number;
}
