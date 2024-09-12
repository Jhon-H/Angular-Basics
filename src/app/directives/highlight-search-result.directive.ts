import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightSearchResult]',
  standalone: true,
})
export class HighlightSearchResultDirective implements OnChanges {
  @Input() searchQuery?: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    if (this.searchQuery && this.searchQuery.length > 0) {
      const text = this.el.nativeElement.innerText;
      const regex = new RegExp(`(${this.escapeRegExp(this.searchQuery)})`, 'gi');
      const highlightedText = text.replace(regex, '<mark>$1</mark>');
      this.el.nativeElement.innerHTML = highlightedText;
    }
  }

  private escapeRegExp(query: string): string {
    return query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
}
