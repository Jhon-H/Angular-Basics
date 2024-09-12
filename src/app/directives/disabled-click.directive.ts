import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDisabledClick]',
  standalone: true,
})
export class DisabledClickDirective {
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: Event): void {
    event.preventDefault();
  }
}
