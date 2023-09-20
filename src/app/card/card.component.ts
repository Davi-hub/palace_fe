import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AnimationService } from '../services/animation.service';

@Component({
  selector: '[app-card]',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements AfterViewInit{
  @Input() cardData: any;
  scale = 9;
  @ViewChild('card') card!: ElementRef;

  constructor(private animationService: AnimationService) {}

  ngAfterViewInit(): void {
    const cardEl = this.card.nativeElement;
    const cardPosition = cardEl.getBoundingClientRect();
    this.animationService.deckPosition.x = cardPosition.x;
    this.animationService.deckPosition.y = cardPosition.y;
  }
}
