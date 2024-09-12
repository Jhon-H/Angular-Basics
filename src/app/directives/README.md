# Directivas

Le agregan comportamientos a elementos de DOM o instancias de componentes. Existen 3 tipos de directivas:ç

- Estructurales: Se usa para agregar o eliminar elementos del DOM. Se represetan con un \*
- De atributos: Se usan para cambiar la apariencia o comportamiento de un elemento. Se represetan con []
- Custom: Son agregadas por el usuario

## Estructurales

### ngIf

```html
<div *if="showElement"></div>
```

### ngFor

```html
<div>
  <p *ngFor="item of items">{{item.title}}</p>
</div>
```

### ngSwitch

```html
<div [ngSwitch]="option">
  <p *ngSwitchCase="1">Case 1</p>
  <p *ngSwitchCase="2">Case 2</p>
  <p *ngSwitchCase="3">Case 3</p>
  <p *ngSwitchDefault>Case default</p>
</div>
```

## Atributos

### ngClass, ngStyle, ngModel

```html
<div [ngClass]="{active: isActive}">Element</div>
<div [ngStyle]="{color: isError ? 'red' : 'black'}">Element</div>
```

## Custom

Podemos crear nuestras propias directivas. Algunas de las más útiles son:

- Autofocus
- Click outside
- Confirm dialog
- Copy clipboard
- Disabled rigth click
- Drag and drop
- Ellipsis
- Highlight search results
- Infinite scroll
- Lazy load images

Veamos un ejemplo. Los demás ejemplos los podemos ver en la carpeta de directivas.

```js
@Directive({
  selector: '[appCustomDirective]',
})
export class CustomDirectiveDirective {
  @Input() bgColor: string;

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.bgColor);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}

///

<div appCustomDirective="yellow"> Yellow or default bg </div>
```

## Existen otras directivas.

### ngContainer

Es un contenedor que no genera ningún elemento DOM. Se usa para agrupar contenido y se require usar una directiva estructural sin generar otro elemento DOM

```html
<ng-container *ngIf="condition">
  <p>Content to be conditionally rendered</p>
  <p>More content...</p>
</ng-container>
```

### ngTemplate
Se usa para definir una plantilla reutilizable que puede usarse dentro del mismo componente o entre otros componentes mediante `ngTemplateOutlet`

```html
<div class="lessons-list" *ngIf="lessons else loading"></div>

<ng-template #loading>
    <div>Loading...</div>
</ng-template>

//...

<div>
  <ng-container *ngTemplateOutlet="selectedTemplate"></ng-container>
</div>

<button (click)="selectedTemplate = myTemplate">Load Template</button>
```

### ngContent
Se usa para proyección (incluir un children). Permite crear componentes reutilizables

```html
<!-- Child Component Template -->
<div>
  <ng-content></ng-content>
</div>

<!-- Parent Component -->
<app-child>
  <p>Content projected into the child component</p>
</app-child>
```

### ngTemplateOutlet
Se usa para representar un template de ngTemplate.

```html
<ng-container *ngTemplateOutlet="selectedTemplate"></ng-container>
<ng-template #template1>Template 1 content</ng-template>
<ng-template #template2>Template 2 content</ng-template>

<button (click)="selectedTemplate = template1">Load Template 1</button>
<button (click)="selectedTemplate = template2">Load Template 2</button>
```

