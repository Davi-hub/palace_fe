import { Injectable } from "@angular/core";
import { Player } from "../classes/player";
import { Card } from "../types";
import { BehaviorSubject, Observable, Subject, Subscription, firstValueFrom } from "rxjs";
import { ApiService } from "./api.service";
import { GameData } from "../interfaces/game-data";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  gameId!: string;
  playerId!: string;
  players!: Player[];
  player!: Player;
  deck!: Card[];
  pile!: Card[];
  playerIndex!: number;
  gameStatus!: number;
  previousRes: any = "";

  getGameIntervalSubs!: Subscription;
  fetchDataSubject = new BehaviorSubject<GameData | null>(null);

  constructor(private apiService: ApiService) { }

  isMyTurn() {
    this.getGameIntervalSubs = this.apiService.getGameInterval().subscribe((res) => {
      if (res !== this.previousRes) {
        const response = JSON.parse(res);
        this.fetchData(response);
        if (this.player.isCurrentPlayer || (this.gameStatus === 0)) {
          this.stopInterval();
        }
        this.previousRes = res;
      }
    });
  }

  async playACard(playedCard: Card, apiObservable: Observable<any>) {
    let result;
    const cardOnPile = this.pile[this.pile.length - 1];

    if (cardOnPile === undefined) {
      result = await this.itIsOK(apiObservable);
    } else if (
      (playedCard.value === 2) ||
      (playedCard.value === 10) ||
      (playedCard.value >= cardOnPile.value)
    ) {
      result = await this.itIsOK(apiObservable);
    } else {
      result = false;
    }
    return result;
  }

  async itIsOK(apiObservable: Observable<any>) {
    try {
      await firstValueFrom(apiObservable);
      return true;
    } catch (error) {
      console.error(error)
      return false;
    }
  }

  fetchData(res: any) {
    this.players = res.players;
    this.deck = res.deck;
    this.pile = res.pile;
    this.playerIndex = res.playerIndex;
    this.player = this.players[this.playerIndex];
    this.gameStatus = res.gameStatus;

    if (res.winner) {
      const winner = res.winner;
      alert("Game over! " + winner.playerName + " win!")
    }

    this.fetchDataSubject.next({
      players: this.players,
      deck: this.deck,
      pile: this.pile,
      playerIndex: this.playerIndex,
      player: this.player,
      gameStatus: this.gameStatus
    });
  }

  stopInterval() {
    if (this.getGameIntervalSubs) {
      this.getGameIntervalSubs.unsubscribe();
    }
  }
}
