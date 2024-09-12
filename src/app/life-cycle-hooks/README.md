# Life cycle hooks

- ngOnChanges
- ngOnInit
- ngDoCheck
- ngAfterContentInit
- ngAfterContentChecked
- ngAfterViewInit
- ngAfterViewChecked
- ngOnDestroy

## Constructor
No es un hook como tal, pero es el primero en llamarse y se usa para inicializar variables e inyectar servivios.

## ngOnChanges
Se llama siempre que se los inputs vinculados a un componente o directiva. Se llama antes de ngOnChanges y siempre que cambien una o más propiedades de inputs.

```js
ngOnChanges(changes: SimpleChanges) {
  if (changes['userInput']) {
    this.processUserInput(changes['userInput'].currentValue);
  }
}
```

## ngOnInit
Se llama una vez Angular haya iniciado todas las propiedad de un componente o directiva. Se llama solo una vez después del primer ngOnChanges. Se usa para incializaciones que requieran que los inputs estén vinculados.

```js
ngOnInit() {
  this.dataService.getData().subscribe(data => {
    this.initialData = data;
  });
}
```

## ngDoCheck
Se llama durante cada ejecución de detección de cambios y se usa para detectar cambios que Angular no detecta pos si solo.

Por ejemplo, detectar cambios en array u objetos que angular no pueda hacer.

```js
ngDoCheck() {
  if (this.hasArrayChanged(this.previousArray, this.currentArray)) {
    this.updateView();
  }
}
```

## ngAfterViewInit
Se llama luego de que Angular inicializa la vista completa de un componente y sus hijos. Es el lugar correcta de colocar cualquier logica que modifique la vista.


## ngAfterViewChecked
Se llama luego de que Angular haya comprobado la vista del componente y las vistas hijas. Se llama luego de ngAfterViewInit y cada ngAfterContentChecked.

## ngAfterContentInit
Se llama luego de que Angular haya proyectado el contenido en la vista de un componente. Util cuando se necesita interactuar con contenido proyectado.

```js
ngAfterContentInit() {
  this.contentChildren.forEach(child => child.initialize());
}
```

## ngAfterContentChecked
Se ejecuta luego de que Angular comprueba el contenido proyectado.

```js
ngAfterContentChecked() {
  if (this.contentHasErrors()) {
    this.reportContentErrors();
  }
}
```

## ngOnDestroy
Se llama justo antes de que Angular destruya un componente o directa. Se usa para desuscribirse y limpiar recursos que se hayan creado.
