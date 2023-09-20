import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewGameComponent } from './new-game/new-game.component';
import { LobbyComponent } from './lobby/lobby.component';
import { GameTableComponent } from './game-table/game-table.component';
import { SeatComponent } from './seat/seat.component';
import { CardComponent } from './card/card.component';
import { TranslateSvgDirective } from './directives/translate-svg.directive';
import { SelectedOnClickDirective } from './directives/selected-on-click.directive';

@NgModule({
  declarations: [
    AppComponent,
    NewGameComponent,
    LobbyComponent,
    GameTableComponent,
    SeatComponent,
    CardComponent,
    TranslateSvgDirective,
    SelectedOnClickDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
