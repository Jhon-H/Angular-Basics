import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appEllipsis]',
  standalone: true,
})
export class EllipsisDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  // ngAfterViewInit(): void {
  //   this.el.nativeElement.styles['white-space'] = 'nowrap';
  //   this.el.nativeElement.styles['overflow'] = 'hidden';
  //   this.el.nativeElement.styles['text-overflow'] = 'ellipsis';
  // }

  //* Usaremos Renderer2 para acceder de forma segura a un elemento nativo

  ngAfterViewInit(): void {
    const container = this.el.nativeElement;
    const content = container.innerHTML;
    if (container.scrollWidth > container.clientWidth) {
      this.renderer.setAttribute(container, 'title', content);
      this.renderer.setStyle(container, 'white-space', 'nowrap');
      this.renderer.setStyle(container, 'overflow', 'hidden');
      this.renderer.setStyle(container, 'text-overflow', 'ellipsis');
    }
  }
}
