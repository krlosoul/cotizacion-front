import {Directive, ElementRef, Input} from '@angular/core';
import Inputmask from 'inputmask';

@Directive({
  selector: '[appRestrictInput]'
})
export class RestrictInputDirective {

  private regexMap = {
    integer: '^[0-9]*$',
    words: '([A-z]*\\s)*'
  };

  constructor(private el: ElementRef) {}

  @Input('appRestrictInput')
  public set defineInputType(type: string) {
    Inputmask({regex: this.regexMap[type], placeholder: ''})
      .mask(this.el.nativeElement);
  }

}
