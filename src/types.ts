
export enum Suit {
  HEARTS = 'hearts',
  DIAMONDS = 'diamonds',
  CLUBS = 'clubs',
  SPADES = 'spades',
}

export enum Rank {
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K',
  ACE = 'A',
}

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
}

export type PlayerType = 'player' | 'ai';

export interface GameState {
  deck: Card[];
  discardPile: Card[];
  playerHand: Card[];
  aiHand: Card[];
  currentPlayer: PlayerType;
  activeSuit: Suit | null;
  winner: PlayerType | null;
  isWildSelecting: boolean;
  lastAction: string;
}
