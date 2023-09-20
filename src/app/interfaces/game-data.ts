import { Player } from "../classes/player";
import { Card } from "../types";

export interface GameData {
  players: Player[],
  player: Player,
  deck: Card[],
  pile: Card[],
  playerIndex: number,
  gameStatus: number,
}
