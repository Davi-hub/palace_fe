import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { Player } from '../classes/player';
import { Card, Ids } from '../types';
import { ApiService } from '../services/api.service';
import { GameService } from '../services/game.service';
import { Observable, defer, firstValueFrom } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.css'],
  animations: [
    trigger('moveToTarget', [
      state('start', style({ transform: 'translateX(0)' })),
      state('end', style({ transform: 'translateX(100px)' })),
      transition('start => end', animate('1000ms ease-in')),
    ]),
  ],
})
export class SeatComponent {
  @Input() player!: Player;
  @Input() isMainSeat = false;
  @Input() gameStatus!: number;

  scale = 9;
  conv = document.body.getBoundingClientRect().height / 100;

  isReady = false;
  isCurrentPlayer = false;
  selectedCardIsCorrect = false;

  selectedOnCardIndex: number = -1;
  selectedInHandIndex: number = -1;
  selectedOnTableIndex: number = -1;
  selectedOnCard: SVGElement | null = null;
  selectedInHand: SVGElement | null = null;
  selectedOnTable: SVGElement | null = null;

  animationState = 'start';

  constructor(
    private apiService: ApiService,
    private gameService: GameService
  ) {

  }

  prepareCard(svgEl: SVGElement) {
    const conv = document.body.getBoundingClientRect().height / 100;
    if (svgEl.getAttribute('transform')) {
      svgEl.setAttribute('transform', '');
    } else {
      svgEl.setAttribute('transform', `translate(0, ${-0.25 * 10 * conv})`);
    }
  }

  onCardOnCard(event: Event, j: number, card: Card) {

    if ((this.gameStatus === 1) && (this.player.cardsInHand.length !== 0)) return;
    if (!this.isMainSeat || card.figure === 'NULL') return;

    const onCard = event.target as SVGElement;
    // Ha ugyanarra a kártyára kattintunk, visszahelyezzük az eredeti pozíciójába és kilépünk
    if (this.selectedOnCard === onCard) {
      this.prepareCard(this.selectedOnCard);
      this.selectedOnCard = null;
      this.selectedOnCardIndex = -1;
      return;
    }
    // Ha van már kiválasztott kártya, visszahelyezzük az eredeti pozíciójába
    if (this.selectedOnCard) {
      this.prepareCard(this.selectedOnCard);
    }
    // Megjelöljük a kiválasztott kártyát
    this.selectedOnCard = onCard;
    this.selectedOnCardIndex = j;
    // Ha már van kiválasztva egy kártya a kézből, cseréljük ki őket
    if ((this.gameStatus === 0) && (this.selectedInHandIndex !== -1)) {
      this.swapCards();
    } else {
      // Ha nincs másik kiválasztott kártya, akkor futtatjuk a prepareCard metódust
      this.prepareCard(this.selectedOnCard);
    }
  }

  onCardInHand(event: Event, k: number, card: Card) {
    if (!this.isMainSeat || card.figure === 'NULL') return;
    if ((this.gameStatus > 0) && !this.player.isCurrentPlayer) return;
    const inHand = event.target as SVGElement;
    // Ha ugyanarra a kártyára kattintunk, visszahelyezzük az eredeti pozíciójába és kilépünk
    if (this.selectedInHand === inHand) {
      this.prepareCard(this.selectedInHand);
      this.selectedInHand = null;
      this.selectedInHandIndex = -1;
      return;
    }
    // Ha van már kiválasztott kártya, visszahelyezzük az eredeti pozíciójába
    if (this.selectedInHand) {
      this.prepareCard(this.selectedInHand);
    }
    // Megjelöljük a kiválasztott kártyát
    this.selectedInHand = inHand;
    this.selectedInHandIndex = k;


    // Ha már van kiválasztva egy kártya az asztalon, cseréljük ki őket
    if ((this.selectedOnCardIndex !== -1) && (this.gameStatus === 0)) {
      this.swapCards();
      return;
    } else {
      // Ha nincs másik kiválasztott kártya, akkor futtatjuk a prepareCard metódust
      this.prepareCard(this.selectedInHand);
    }
  }

  onCardOnTable(event: Event, i: number, card: Card) {
    for (let i = 0; i < this.player.cardsOnCards.length; i++) {
      const element = this.player.cardsOnCards[i];
      if ((this.gameStatus === 1) && (element.src !== "")) return;
    }

    if ((this.gameStatus === 1) && (this.player.cardsInHand.length !== 0)) return;
    if (!this.isMainSeat) return;


    const onTable = event.target as SVGElement;
    // Ha ugyanarra a kártyára kattintunk, visszahelyezzük az eredeti pozíciójába és kilépünk
    if (this.selectedOnTable === onTable) {
      this.prepareCard(this.selectedOnTable);
      this.selectedOnTable = null;
      this.selectedOnTableIndex = -1;
      return;
    }
    // Ha van már kiválasztott kártya, visszahelyezzük az eredeti pozíciójába
    if (this.selectedOnTable) {
      this.prepareCard(this.selectedOnTable);
    }
    // Megjelöljük a kiválasztott kártyát
    this.selectedOnTable = onTable;
    this.selectedOnTableIndex = i;

    this.prepareCard(this.selectedOnTable);
  }

  swapCards() {
    // Cseréljük ki a kártyákat
    let temp = this.player.cardsOnCards[this.selectedOnCardIndex];
    this.player.cardsOnCards[this.selectedOnCardIndex] = this.player.cardsInHand[this.selectedInHandIndex];
    this.player.cardsInHand[this.selectedInHandIndex] = temp;
    // Reseteljük a kiválasztott kártyákat és indexeket
    if (this.selectedOnCard) {
      this.prepareCard(this.selectedOnCard);
      this.selectedOnCard = null;
    }
    if (this.selectedInHand) {
      this.prepareCard(this.selectedInHand);
      this.selectedInHand = null;
    }
    this.selectedOnCardIndex = -1;
    this.selectedInHandIndex = -1;
  }

  onReady() {
    this.apiService.customizedCardsOnCards(
      this.player.cardsOnCards,
      this.player.cardsInHand
    ).subscribe((res) => {
      this.isReady = true;
      this.everybodyIsReady();
    });
  }

  async onOk() {
    let selectedCardEl: SVGElement | null;
    let playersCardArray;
    let selectedCard: Card;
    let apiObservable: Observable<any>;
    this.moveSvgElement();

    // if (this.selectedInHand && (this.selectedInHandIndex >= 0)) {
    //   selectedCardEl = this.selectedInHand;
    //   selectedCard = this.player.cardsInHand[this.selectedInHandIndex];
    //   playersCardArray = this.player.cardsInHand;
    //   apiObservable = defer(() => this.apiService.playedACard(selectedCard));
    // } else if (this.selectedOnCard && (this.selectedOnCardIndex >= 0)) {
    //   selectedCardEl = this.selectedOnCard;
    //   selectedCard = this.player.cardsOnCards[this.selectedOnCardIndex];
    //   playersCardArray = this.player.cardsOnCards;
    //   apiObservable = defer(() => this.apiService.playedACardOnCard(selectedCard));
    // } else if (this.selectedOnTable && (this.selectedOnTableIndex >= 0)) {

    //   selectedCardEl = this.selectedOnTable;
    //   selectedCard = await firstValueFrom(this.apiService.getCardOnTable(this.selectedOnTableIndex)) as Card;
    //   this.player.cardsOnTable.splice(this.selectedOnTableIndex, 1, selectedCard);
    //   playersCardArray = this.player.cardsOnTable;
    //   apiObservable = defer(() => this.apiService.playedACardOnTable(selectedCard));
    // } else {
    //   return;
    // }

    // this.gameService.playACard(selectedCard, apiObservable).then(result => {
    //   if (result && selectedCardEl && (this.selectedOnTableIndex < 0)) {

    //     this.prepareCard(selectedCardEl);
    //   } else if (result && selectedCardEl && (this.selectedOnTableIndex > 0)) {
    //     this.apiService.playedACardOnTable(selectedCard).subscribe(() => {
    //       this.gameService.isMyTurn();
    //     });
    //   } else {
    //     this.apiService.drawThePile().subscribe(() => {
    //       this.apiService.playedACardOnTable(selectedCard).subscribe(() => {
    //         this.apiService.drawThePile().subscribe(() => this.gameService.isMyTurn());
    //       });
    //     });
    //   }

    //   this.selectedInHand = null;
    //   this.selectedInHandIndex = -1;
    //   this.selectedOnCard = null;
    //   this.selectedOnCardIndex = -1;
    //   this.selectedOnTable = null;
    //   this.selectedOnTableIndex = -1;
    //   this.gameService.isMyTurn();
    // });
  }

  everybodyIsReady() {
    this.apiService.everbodyIsReady().subscribe(() => {
      this.gameStatus = 1;
      this.gameService.isMyTurn();
    });
  }

  moveSvgElement() {
    this.animationState = 'end';
    // Az animáció beállítása után várjunk egy kis időt, majd állítsuk vissza az animáció állapotát
    setTimeout(() => {
      this.animationState = 'start';
    }, 1000); // Az időt itt állíthatod be az animáció hosszához igazítva
  }
}
