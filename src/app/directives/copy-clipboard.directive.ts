import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appCopyClipboard]',
  standalone: true,
})
export class CopyClipboardDirective {
  // @Input({
  //   transform: booleanAttribute,
  //   required: true,
  // }) shouldCopy: boolean = false;

  @Input() textToCopy?: string;

  @Output() isCopySucessful = new EventEmitter<boolean>();

  @HostListener('click')
  onClick(): void {
    navigator.clipboard
      .writeText(this.textToCopy ?? '')
      .then(() => {
        this.isCopySucessful.emit(true);
      })
      .catch(() => {
        this.isCopySucessful.emit(false);
      });
  }
}
