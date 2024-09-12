# Change Detection

Angular parchea varias funciones nativas del navegador y usa Zone.js para detectar los cambios en estas funciones. Por ejemplo, parchea

- todos los eventos del navegador (click, hover, ..)
- setTimeout setInternal
- http ajax
- websockets

Si alguna función no está parcheada, entonces no ejecutará la detección de cambios.

## Cómo funciona la detección por defecto

- Angular analiza las propiedades usadas en la plantilla. Compara el vzlor nuevo con el anterior, si cambia entonces lo marca como `isChanged = true`
- Angular compara con `===`, si le pasamos un objeto anidado, no detectará el cambio, solo el de las propiedades usadas en la plantilla.

Además, en la forma por defecto
- Se verifica toda la jerarquia de componentes
- Se activa por cada evento del dom (click, hover), http, temporizadore y promesas
- Puede afectar el rendimiento en aplicaciones grandes y complejas

## OnPush

"Al utilizar detectores OnPush, el marco verificará un componente OnPush cuando cambie cualquiera de sus propiedades de entrada, cuando active un evento o cuando un Observable active un evento."

```js
Component({
    selector: 'todo-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: ...
})
```

Es decir, solo verifica un componente cuando:

- Cambia un referencia de Input
- Se dispara un evento desde uno de sus hijos o el mismo
- Se ejecuta manualmente la detección de cambios

### Casos de usos

- Componentes presentacionales: Estos solo dependen de sus input y no tiene logica interna compleja
- Lista con muchos elementos
- Componentes con datos inmutables
- Arboles de componentes profundos
- Componentes que rara vez cambian
- 

## Forma manual

```js
constructor(private ref: ChangeDetectorRef) {
    ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 5000);
  }
```
