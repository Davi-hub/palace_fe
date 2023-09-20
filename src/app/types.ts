export type CreateFormData = {
  firstPlayerName: string,
  playerNumber: number
}

export type JoinFormData = {
  playerName: string,
  gameId: number
}

export type Card = {
  suit: string,
  figure: string,
  src: string,
  value: number
}

export type Ids = {
  gameId: string,
  playerId: string,
  playerIndex: number
}
