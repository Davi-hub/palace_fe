import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Card, CreateFormData, JoinFormData } from '../types';
import { Subject, filter, interval, switchMap, take } from 'rxjs';
import { SessionStorageService } from './session-storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public baseUrl = environment.backendUrl;
  private ids: any;
  public currentPlayerIndex!: number;
  public startGetGameInterval = new Subject();

  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) { }

  startGame(createFormData: CreateFormData) {
    return this.http.post(this.baseUrl + "/new-game", createFormData);
  }

  joinGame(joinFormData: JoinFormData) {
    return this.http.post(this.baseUrl + "/join", joinFormData);
  }

  getPlayers() {
    return this.http.post(this.baseUrl + "/get-players", this.getIds());
  }

  getGameInterval() {
    return interval(1000)
      .pipe(
        switchMap(() => this.http.post(this.baseUrl + "/get-game", this.getIds(), { responseType: 'text' }))
      );
  }

  customizedCardsOnCards(cardsOnCards: Card[], cardsInHand: Card[]) {
    return this.http.post(this.baseUrl + "/ready", {
      cardsOnCards: cardsOnCards,
      cardsInHand: cardsInHand,
      ids: this.getIds()
    });
  }

  everbodyIsReady() {
    return interval(1000)
      .pipe(
        switchMap(() => this.http.post(this.baseUrl + "/is-eb-ready", this.getIds())),
        filter((response: any) => response === true),
        take(1)
      );
  }

  playedACard(card: Card) {
    return this.http.post(this.baseUrl + "/played-a-card-in-hand", {
      cards: [card], ids: this.getIds()
    });
  }

  playedACardOnCard(card: Card) {
    return this.http.post(this.baseUrl + "/played-a-card-on-card", {
      cards: [card], ids: this.getIds()
    });
  }

  playedACardOnTable(card: Card) {
    return this.http.post(this.baseUrl + "/played-a-card-on-table", {
      cards: [card], ids: this.getIds()
    });
  }

  getCardOnTable(i: number) {
    return this.http.post(this.baseUrl + "/get-card-on-table", {
      ids: this.getIds(), onTableIndex: i
    });
  }

  getACardFromDeck() {
    return this.http.post(this.baseUrl + "/get-card-on-table", { ids: this.getIds() });
  }

  getPlayersInLobby() {
    return interval(1000)
      .pipe(
        switchMap(() => this.getPlayers())
      );
  }

  drawThePile() {
    return this.http.post(this.baseUrl + "/draw-the-pile", this.ids);
  }

  getIds() {
    if (!this.ids) {
      this.ids = this.sessionStorageService.getData('ids');
    }
    return this.ids;
  }

  setIds(ids: any) {
    this.ids = ids;
  }
}
