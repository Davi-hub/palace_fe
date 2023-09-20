import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appSelectedOnClick]'
})
export class SelectedOnClickDirective {

  constructor() { }

  @HostListener('click', ['$event.target'])
  onClick(target: HTMLElement | SVGElement) {
    const conv = document.body.getBoundingClientRect().height/100;
    const svgEl: HTMLElement | SVGElement = target;

    if (svgEl.getAttribute('transform')) {
      svgEl.setAttribute('transform', '');
    } else {
      svgEl.setAttribute('transform', 'translate(' + 0 + ',' + -0.25 * 10 * conv + ')');
    }
  }

}
