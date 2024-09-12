# Signals

Los signals son primitivos reactivos que permiten actualizaciones detalladas del DOM, son más fáciles de entender que RXJS y permiten mejorar el performance al permitir eliminar zone.js.

Un signal es un primitivo reactivo que permite almacenar un valor de forma controlada y rastrear sus cambios a lo largo de la aplicación.

## Funciones

### `set`
Nos permite actualizar el valor de una señal. A diferencia de `updated`, no tenemos acceso al valor actual de la señal.

```js
const counter = signal(0)
this.counter.set(this.counter() + 1) 
```

### `update`
Nos permite actualizar el valor de una señal, y nos da acceso al valor actual.

```js
const counter = signal(0)
this.counter.update(current => current + 1)
```

### `computed`
Nos permite crear señales a partir de otras, pero hay cosas a tener en cuenta:

- Son readonly, no se pueden editar directamente
- En la primera ejecución detecta las señales de las que depende, y cada vez que estas se actualizan se recalcula la señal computada
- Debemos tener cuidado con logica dentro, si una señal B no se llama la primera vez, entonces no lo detecta como dependencia y cuando B se actualice, NO se actualizará la señal computada
- Sin embargo, las dependencias son dinamicas, si la dependencia A se actualiza y eso implica ejecutar la señal B, entonces ahora B se convierte en dependencia.
- Los valores de la señal NO se debe mutar directamente

```js
const counter = signal(0)
const counterMultiple = computed(() => {
  return this.signal() * 10
})
```

Ademàs, tenemos otros casos raros:

- Usar una señal internamente, pero que no se incluya como dependencia, podemos usar `untracked`

```js
const counter = signal(0)
const counterMultiple = computed(() => {
  return untracked(this.signal()) * 10
})
```

- Por defecto, la comparación que usan las señales para ver si cambiaron es con `===`, pero lo podemos modificar

```js
const counter = signal(
  { title: 'A', id: 1 },
  {
    equal: (a, b) => {
      return a.id === b.id && a.title === b.title
    }
  } 
)
```

### readonly
Podemos crear señales readOnly de 2 formas:

- Usar `computed`
- Usar `signal.asReadonly()`

```js
private state = signal(0)
readonly stateReadonly = this.state.asReadonly()
```

### `effect`
Podemos usar effect para realizar lógica sin necesidad de regresar un valor ni crear una nueva señal, pero manteniendonos sincronizados cada vez que cambie una seña interna.

Casos de uso:

- Realizar peticiones en segundo plano
- Logging cada vez que ambien los datos
- Sincronizar un valor con localStorage o cookies

```js
effect(() => {
  console.log("Nuevo valor: ", this.counter())
})
```

Así mismo, podemos realizar acciones cuando se limpie un effecto, por ejemplo

- cerrar una conexión a una base de datos
- dar de baja un observable
- eliminar un settimeout

```js
effect((onCleanup) => {
  console.log(`current value: ${this.count()}`);

  onCleanup(() => {
    console.log("Perform cleanup action here");
  })
})
```

Tambien existen algunos casos avanzados:

- No podemos actualizar señales dentro de effect, pero podemos cambiar esto

```js
effect(() => {
  console.log(this.counter())
  this.counter.set(4)
}, {
  allowSignalWrites: true    
})
```

- Por defecto, Angular limpiará el effect según el contexto en el que se creó, por ejemplo, cada vez que el componente se destruye, la señal se limpia automáticamente. Esto tambien lo podemos hacer manual

```js
const effe = effect(() => {
  console.log(this.counter())
}, {
  manualCleanup: true
})

this.effe.destroy()
```

## input, output, model

### input

`input` es un signal que funciona como input y almacena el último valor de entrada vinculado desde el padre.
Debemos tener en cuenta que esto es simplemente un signal de solo lectura, podemos hacer uso de `computed` e `effect` como normalmente,

```js
book = input<Book>() // opcional, por defecto es undefined
book = input<number>(3) // opcional, por defecto 3
book = input.required<Book>() // requerido, NO se le puede asingar valor por defecto

book = input.required<Book>({ alias: "bookInput" }); // ALIAS

book = input.required({ // Transformar entrada
  transform: (value: Book | null) => {
    if (!value) return null;

    value.title += " :TRANSFORMED";

    return value;
  },
});
```

Algo a tener en cuenta es que ya no necesitamos `ngOnChanges` para detectar si cambió una entrada, para esto solo necesitamos `effect`.

### output

`output` es el reemplazo de `@Output`. 

```js
deleteBook = output<Book>() // Regresa --> OutputEmitterRef

onDelete() {
  this.deleteBook.emit({
    title: "Angular Deep Dive",
    synopsis: "A deep dive into Angular core concepts",
  });
}
```

```js
deleteBook = output<Book>({ // ALIAS
  alias: "deleteBookOutput",
});

deleteBookObservable$ =  outputToObservable(this.deleteBook); // Output a Observable
```

### model

Es como un input escribible, ademàs es bidireccional.

## viewChild y contentChild

### viewChild

Es un signal que se usa para recuperar elementos del template.

```js
// html
<b #title>Title</b>

// js
title = viewChild<ElementRef>("title");
```

Veamos que no usamos `ngAfterViewInit`, la señal se encargue de obtener el valor cuando esté disponible y si nos suscribimos desde un `effect` o `computed` recibiremos la notitificación.

Si hay varios `#title` en html, entonces solo se quedará con el primero que encuentre. Para obtenerlo todos usamos `viewChildren`.

Además, si tenemos un componente podemos consultarlo

```js
// html
<div>
  <book #book></book>
</div>

// js
book = viewChild<BookComponent>() // Nos regresa el componente

// Podemos decirle que nos regrese ElementRef en lugar del componente
bookComponent = viewChild("book", {
  read: ElementRef
});
```

Además, `read` lo podemos usar para consultar otras cosas, como una directiva que use el componente

```js
bookComponent = viewChild("book", {
  read: MatTooltip
});
```

Podemos hacer que la consulta viewChild sea obligatoria

```js
titleRef = viewChild.required("bold");
```






