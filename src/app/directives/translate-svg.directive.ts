import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[translateSvg]'
})
export class TranslateSvgDirective {
  @Input('translateSvg') set translate(value: string) {
    if (value) {

      const x = +value.split(',')[0];
      const y = +value.split(',')[1];
      let scale = 9.5;
      const conv = document.body.getBoundingClientRect().height/100;
      if (value.split(',')[2]) {
        scale = +value.split(',')[2];
      }
      const svgEl: SVGElement = this.elementRef.nativeElement;
      svgEl.setAttribute('transform', 'translate(' + x*scale*conv + ',' + y*scale*conv + ')');
    }
  };

  constructor(private elementRef: ElementRef) {}

}
