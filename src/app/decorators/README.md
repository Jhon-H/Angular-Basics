# Decoradores

Algunos decoradores aún no vistos son:

- @HostListener
- @ContentChild
- @ContentChildren
- @ViewChild
- @ViewChildren

## HostListener

Es usado para escuchar eventos en el elemento host, una directiva o un componente.

```js
@HostListener('click')
onClick() {}

@HostListener('document:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) 
```

## ContentChild y ContentChildren
Se usan para consultar el contenido de hijos en una vista

```js
@ContentChild('childButton1', { static: true }) childButton1: ElementRef;
@ContentChildren('childButton2') childButtons2: QueryList<ElementRef>;
```

Considera solo a los elementos hijos del componente

> ViewChild: hijo dentro del template. ContentChild: hijo dentro del componente (como host).

## ViewChild y ViewChildren
Similar a ContentChild, pero se usa para hijos dentro del mismo template

```js
@ViewChild('childButton1', { static: true }) childButton1: ElementRef;
@ViewChildren('childButton2') childButtons2: QueryList<ElementRef>;

<button #childButton1>Button 1</button>
<button #childButton2>Button 2</button>
```
