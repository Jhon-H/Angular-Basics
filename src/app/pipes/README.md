# Pipes

Un pipe toma data como input y la transforma en un output deseado.

Estos son los buildIn pipes

- Date Pipe
- Uppercase Pipe
- Lowercase Pipe
- Currency Pipe
- Percent Pipe
- Slice Pipe
- Decimal/number Pipe
- JSON Pipe
- Async Pipe

## Pipes impuros

Un pipe puro es aquel que no tiene estado y solo cambia cuando el input cambie. Sin embargo, se pueden crear pipes impuros con `pure: false`

```js
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "impurePipe",
  pure: false,
})
export class ImpurePipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}
```

Un pipe impuro se llama en cada ciclo de detección de cambios, mientras que los puros solo cuando cambie el input del pipe.

Esto es importante por varias razones:

- Cuando pasamos un array o objeto cuyo contenido cambió (pero no es detectado porque es la misma instancia)
- Cuando el pipe inyecta servicio para obtener otros valores, angular no reconoce si han cambiado

En los casos anteriores es posible que queramos que se ejecute el pipe, aquí usamos los pipes impuros.
Nota: estos pipes impuros pueden ser ineficientes

## Custom pipes

Para crear un custom pipe debemos usar el decorador `@Pipe` y una función `transform`.

```js
@Pipe({
  name: 'letras'
})
export class LetrasPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (args != null) {
      if (args=='ingles')
        switch (value) {
          case 1: return 'one';
          case 2: return 'two';
        }
        if (args=='portugues')
        switch (value) {
          case 1: return 'um';
          case 2: return 'dois';
        }
    }
  
    switch (value) {
      case 1: return 'uno';
      case 2: return 'dos';
    }
  
  return null;
  }

}

<p>{{valor | letras:'ingles'}}</p>
```
