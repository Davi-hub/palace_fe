import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  deckPosition: {x: number, y: number} = {x: NaN, y: NaN};

  constructor() { }
}
