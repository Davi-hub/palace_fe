import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Player } from '../classes/player';
import { ApiService } from '../services/api.service';
import { Card} from '../types';
import { Subscription } from 'rxjs';
import { GameService } from '../services/game.service';
import { GameData } from '../interfaces/game-data';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.css'],
})

export class GameTableComponent implements OnInit, AfterViewInit {
  players!: Player[];
  deck!: Card[];
  pile: Card[] = [];
  gameStatus!: number;
  player!: Player;

  scale = 10;

  hSeatsOne: Player[] = [];
  hSeatsTwo: Player[] = [];
  vSeatsOne: Player[] = [];
  vSeatsTwo: Player[] = [];

  getGameIntervalSub!: Subscription;

  pilePosition: {x: number, y: number} = {x:0, y:0};

  @ViewChildren('pile') pileElements!: QueryList<ElementRef>;

  animationState = 'start';
  targetX = 100;
  targetY = 50;

  constructor(
    private apiService: ApiService,
    private gameService: GameService) {
    }
    
  ngOnInit() {
    this.gameService.isMyTurn();
    this.gameService.fetchDataSubject.pipe().subscribe((gameData: GameData | null) => {
      if (gameData) {
        this.players = gameData.players;
        this.deck = gameData.deck;
        this.pile = gameData.pile;
        this.gameStatus = gameData.gameStatus;
        this.player = gameData.player;
        this.sitPlayers(gameData.playerIndex);
        const lastCardOfPile: SVGElement = this.pileElements.last.nativeElement;
        console.log(lastCardOfPile.getClientRects());
        const domRect = lastCardOfPile.getClientRects()[0];
        this.pilePosition.x=domRect.x;
        this.pilePosition.y=domRect.y;
        this.moveSvgElement();
      }
    })
  }

  ngAfterViewInit(): void {
    console.log(this.pileElements);
    console.log(this.pile);
    
  }

  sitPlayers(playerIndex: number) {
    const x = playerIndex;
    const n = this.players.length;
    switch (n) {
      case 2:
        this.hSeatsOne = [this.players[(x) % n]];
        this.hSeatsTwo = [this.players[(x + 1) % n]];
        break;

      case 3:
        this.hSeatsOne = [this.players[(x) % n]];
        this.vSeatsOne = [this.players[(x + 1) % n]];
        this.vSeatsTwo = [this.players[(x + 2) % n]];
        break;

      case 4:
        this.hSeatsOne = [this.players[(x + 1) % n], this.players[(x) % n]];
        this.hSeatsTwo = [this.players[(x + 2) % n], this.players[(x + 3) % n]];
        break;

      case 5:
        this.hSeatsOne = [this.players[(x) % n]];
        this.vSeatsOne = [this.players[(x + 1) % n]];
        this.hSeatsTwo = [this.players[(x + 2) % n], this.players[(x + 3) % n]];
        this.vSeatsTwo = [this.players[(x + 4) % n]];
        break;

      case 6:
        this.hSeatsOne = [this.players[(x + 1) % n], this.players[(x) % n]];
        this.vSeatsOne = [this.players[(x + 2) % n]];
        this.hSeatsTwo = [this.players[(x + 3) % n], this.players[(x + 4) % n]];
        this.vSeatsTwo = [this.players[(x + 5) % n]];
        break;

      case 7:
        this.hSeatsOne = [this.players[(x + 1) % n], this.players[(x) % n]];
        this.vSeatsOne = [this.players[(x + 2) % n]];
        this.hSeatsTwo = [this.players[(x + 3) % n], this.players[(x + 4) % n], this.players[(x + 5) % n]];
        this.vSeatsTwo = [this.players[(x + 6) % n]];
        break;

      case 8:
        this.hSeatsOne = [this.players[(x + 2) % n], this.players[(x + 1) % n], this.players[(x) % n]];
        this.vSeatsOne = [this.players[(x + 3) % n]];
        this.hSeatsTwo = [this.players[(x + 4) % n], this.players[(x + 5) % n], this.players[(x + 6) % n]];
        this.vSeatsTwo = [this.players[(x + 7) % n]];
        break;

      default:

        break;
    }
  }

  onPile() {
    if (!this.player.isCurrentPlayer) return;
    this.apiService.drawThePile().subscribe((res: any) => {
      this.gameService.isMyTurn();
    })
  }

  moveSvgElement() {
    this.animationState = 'end';
  }
}
