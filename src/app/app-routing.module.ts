import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewGameComponent } from './new-game/new-game.component';
import { LobbyComponent } from './lobby/lobby.component';
import { GameTableComponent } from './game-table/game-table.component';

const routes: Routes = [
  { path: '', redirectTo: '/newgame', pathMatch: 'full' },
  { path: 'newgame', component: NewGameComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: 'gametable', component: GameTableComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
