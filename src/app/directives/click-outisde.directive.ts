import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutisde]',
  standalone: true
})
export class ClickOutisdeDirective {
  @Output() onClickOutside = new EventEmitter()

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if(!this.el.nativeElement.contains(event.target)) {
      this.onClickOutside.emit()
    }
  }
}
