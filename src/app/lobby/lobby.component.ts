import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Player } from '../classes/player';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, OnDestroy {
  ids!: any;
  isFirstPlayer = false;
  players!: Player[];
  subs!: Subscription;

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.ids = this.apiService.getIds();
    this.subs = this.apiService.getPlayersInLobby().subscribe((players: any) => {
      this.players = players;
      const lastPlayer = this.players[players.length - 1];

      if (lastPlayer.playerId != null) {
        this.router.navigate(['gametable'])
      };
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onCopy(inputElement: HTMLInputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
}
