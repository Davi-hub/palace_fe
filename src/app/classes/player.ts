export class Player {
  playerId!: string;
  playerName!: string;
  isReady!: boolean;
  isCurrentPlayer!: boolean;
  cardsOnTable!: any[];
  cardsOnCards!: any[];
  cardsInHand!: any[];
  cardDeck!: any[];
  discardPile!: any[];
  playerIndex?: number;

  constructor( ) {

  }
}

