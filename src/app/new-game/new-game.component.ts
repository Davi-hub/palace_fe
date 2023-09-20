import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CreateFormData, JoinFormData } from '../types';
import { SessionStorageService } from '../services/session-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent implements OnInit, OnDestroy {
  isCreate = true;
  newGameFormGroup!: FormGroup;
  gameId!: string;
  startGameSubscription!: Subscription;
  createFormGroup = new FormGroup({
    playerName: new FormControl(),
    playerNumber: new FormControl()
  });
  joinFormGroup = new FormGroup({
    playerName: new FormControl(),
    gameId: new FormControl()
  })

  constructor(
    private apiService: ApiService,
    private sessionStorageService: SessionStorageService,
    private router: Router) {}

  ngOnInit(): void {
    this.newGameFormGroup = this.createFormGroup;
    console.log(this.apiService.baseUrl);
  }

  onSubmit() {
    if (this.isCreate) {
      const createFormData: CreateFormData = {
        firstPlayerName: this.newGameFormGroup.get('playerName')?.value,
        playerNumber: +this.newGameFormGroup.get('playerNumber')?.value
      }
      this.startGameSubscription = this.apiService.startGame(createFormData).subscribe((ids) => {
        this.saveIds(ids);
      });
    } else {
      const joinFormData: JoinFormData = {
        playerName: this.newGameFormGroup.get('playerName')?.value,
        gameId: this.newGameFormGroup.get('gameId')?.value
      }
      this.apiService.joinGame(joinFormData).subscribe(ids => {
        this.saveIds(ids);
      });
    }
  }

  onJoin() {
    this.isCreate = !this.isCreate;
    this.newGameFormGroup = this.joinFormGroup;
  }

  onCreate() {
    this.isCreate = !this.isCreate;
    this.newGameFormGroup = this.createFormGroup;
  }

  saveIds(ids: any) {
    this.sessionStorageService.saveData("ids", ids);
    this.apiService.setIds(ids);
    this.router.navigate(['lobby']);
  }

  ngOnDestroy(): void {
    if (this.startGameSubscription) {
      this.startGameSubscription.unsubscribe();
    }
  }
}
