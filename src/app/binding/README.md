
# Binding
Binding es una feature de Angular que permite vincular datos entre el componente y la vista. hay 2 tipos:

- One-way binding: Permite pasar data del componente a la vista o viceversa
- Two-way binding: Permite vincular data del componente a la visya y viceversa

## One way binding

### Del componente a la vista

#### Interpolación
Permite embeber propiedades en la vista

```js
@Component({
  template: `
    <h1>{{ title }}</h1>
  `
})
class AComponent {
  title = "Valor"
}
```

#### Property binding
Permite vincular una propiedad de un elemento HTML a una propiedad del componente.

```js
@Component({
  template: `
    <button [disabled]="isDisabled">Text</button>
  `
})
class AComponent {
  isDisabled = true
}
```

#### Class binding
Permite vincular una clase css de un elemento html con una propiedad del component

```js
@Component({
  template: `
    <h1 [class.active]="isActive">Title </h1>
  `,
  style: `
    .active {
      color: blue;
    }
  `
})
class AComponent {
  isActive = true;
}
```

#### Style binding
Permite vincular estilos de un elementos html con una propiedad del componente

```js
@Component({
  template: `
    <h1 [style.backgroud-color]="bgColor">Title </h1>
  `
})
class AComponent {
  bgColor = "white";
}
```

#### Attribute binding 
Permite vincular un atributo de un elemnento html con una propiedad del componente

```js
@Component({
  template: `
    <img [attr.src]="src" />
  `
})
class AComponent {
  src = "https://image"
}
```

### De la vista al componente

#### Event binding
Permite vincular un evento de un elemento html a un método del componente

```js
@Component({
  template: `
    <button (click)="onClick()"> click me </button>
  `
})
class AComponent {
  onClick() {
    console.log("cliked!!")
  }
}
```

## Two way binding

### NgModel
Esta directiva se usa para crear vinculaciones de 2 direcciones entre un input html y una propiedad del componente

```js
@Component({
  template: `
    <input ([ngModel])="name" />
  `
})
class Component {
  name: string;
}
```

### ngModelChange
Este evento es emitido cuando un valor vinculado a un ngModel cambia

```js
@Component({
  template: `
    <input ([ngModel])="name" (ngModelChange)="onChangeModel($event)" />
  `
})
class Component {
  name: string;

  onChangeModel(m: string) {}
}
```

### Change event
Este event es emitido cuando el valor de un input cambia

```js
@Component({
  template: `
    <input ([ngModel])="name" (change)="onChange($event)" />
  `
})
class Component {
  name: string;

  onChange(m: string) {}
}
```