# RXJS

- Stream: Secuencia de valores en el tiempo
- Observable: API para acceder y manipular streams
- RXJS: Extensiones reactivas para javascript, es una libreria que permite crear observables
- Operador RXJS: Toma un observable, hace algo, y regresa otro observable
- Programación reactiva: Paradigma de programación que se centra en flujos asincronos y la propagación de cambios

```js
const obs = interval(1000).pipe(take(5));
```

## Observables frios y calientes

Un observable se dice que es **frio** si solo emite valores cuando hay suscripciones activas.

Un observable se dice **caliente** si emite valores incluso si no hay suscripciones, quienes se suscriben más tarde pueden perder valores.

## Observables lazyness

Por defecto los observables son perezosos, es decir, no hacen nada hasta que se suscriben a ellos

## Formas de crear obserables

- interval: Emite numeros en secuencia con un tiempo de espera
- of: Emite valores en secuencia apartir de los datos especificados, luego se completa
- from: Convierte un array, iterable o promesa en un Observable
- fromEvent: Convierte un evento en un Observable
- create: Crea un observable con la función de suscripción data
- range: Emite numeros en un rango
- timer: Emite numeros en sencuencia luego de un tiempo indicado


## Operadores

### map
Obtiene el observable y lo transforma según la función de mapeo

```js
of(1,2,3).pipe(
  map(x => x*10)
).suscribe(console.log)
```

### filter
Permite filtrar valores según condiciones

```js
from([1,2,3,4]).pipe(
  filter(x => x % 2 === 0)
).suscribe(console.log)
```

### take, takeLast

Toma tantos valores como se indique, luego destruye el observable. takeLast toma los ultimos valores

```js
interval(1000).pipe(
  take(3)
).suscribe(console.log) // 0 1 2 
```

### mergeMap

Mapea cada valor a un observable, entonces aplana todos los observables internos, todos los observables anteriores se mantienen activos.

```js
from([1,2,3]).pipe(
  mergeMap(x => of(x, x*2))
).suscribe(console.log) // 1 2 2 4 3 6
```

### merge

Mergea varios observables en 1 solo

### concatMap

Espera a que se complete el observable anterior antes de crear el siguiente

### swithMap

Mapea cada valor a un observable, antes de crear el nuevo observable completa el anterior.

```js
from([1,2,3]).pipe(
  switchMap(x => interval(x).pipe(take(2)))
).suscribe(console.log) // 0, 1 (del ultimo observable)
```

### debounceTime

Emite una notificación del observable solo despues de que haya pasado un tiempo sin ninguna otra emisión.
observable
```js
fromEvent(inputElement, 'input').pipe(
  debounceTime(300)
).suscribe(console.log)
```

### distincUntilChanged

Emite valores diferentes al anterior. Por ejemplo: 1 (emite) 1 (nada) 2 (emite) 2 (nada)

```js
of(1, 1, 2, 2, 3, 1).pipe(
  distinctUntilChanged()
).suscribe(console.log) //  1 2 3 1
```

### catchError

Catchea errores de un observable y regresa otro  observable o lanza un error

```js
throwError("error").pipe(
  catchError((error) => of("Error capturado"))
).suscribe(console.log) // Error capturado
```

### tap

Realiza efectos secundarios

```js
of(1, 2, 3).pipe(
  tap(x => console.log('Antes:', x)),
  map(x => x * 2),
  tap(x => console.log('Después:', x))
).subscribe();
```

### delay

Retrasa la emisión del observable un cierto tiempo.

```js
of('Hola').pipe(
  delay(2000)
).subscribe(console.log);
```

### combineLatest

Combina varios observable y emite un valor cada vez que cualquier observable e emite un valor. Emite el ultimo valor de los observables en forma de array

```js

```

### shareReplay

Cada vez que nos suscribimos generamos una nueva "conexión", pero si queremos compartir la misma "conexión" podemos usar shareReplay. Esto es util cuando tenemos efectos secundarios o realizamos calculos complejos.

```js
interval(1000).pipe(
  take(3),
  shareReplay()
)
```

### startWith, endWith

`startWith` emite un valor inicial. `endWith` emite un valor final.

```js
of(1,2,3).pipe(
  startWith(0)
).suscribe(console.log) // 0,1,2,3
```

### scan, reduce

Es un reducer. Scan es un reducer pero emite valores cada vez que el observable emite, sin embargo, reduce solo emite al final

```js
of(1, 2, 3).pipe(
  scan((acc, curr) => acc + curr, 0)
).subscribe(console.log); // Salida: 1, 3, 6
```

### every

Regresa true si todos cumplen una condición

```js
of(1,2,3,4,5).pipe(
  //is every value even?
  every(val => val % 2 === 0)
).suscribe(console.log) // false
```

### defaultIfEmpty

Emite un valor indicado si nada es emitido antes de completarse

```js
of().pipe(
  defaultIfEmpty("EMPTYY!!")
).suscribe(console.log) // EMPTYY!!
```

### iif

Se suscribe al primer o segundo observable dado un valor

```js
const r$ = of('R');
const x$ = of('X');

interval(1000)
  .pipe(mergeMap(v => iif(() => v % 4 === 0, r$, x$)))
  .subscribe(console.log); // R X X X R X X X R
```

### retry

Reintente una secuencia observable un numero de veces si ocurre un error

```js
interval(1000).pipe(
  mergeMap(val => {
    if (val > 2) return throwError('Error!');
    return of(val);
  }),
  //retry 2 times on error
  retry(2)
).suscribe(console.log); // 0 1 2  |  0 1 2  |  0 1 2  | No reintenta más  
```

### retryWhen

Reintenta si hay error y cumple ciertas condiciones

```js
interval(1000).pipe(
  map(val => {
    if (val > 2) throw val;
    return val;
  }),
  retryWhen(errors =>
    errors.pipe(
      //restart in 6 seconds
      delayWhen(val => timer(val * 1000))
    )
  )
)
```

### find

Emite el primer valor que cumple una condición

```js
interval(1000).pipe(
  find(x => x % 2 === 0 && x > 0)
).suscribe(console.log) // 2
```

### first, last

Emite el primer o ultimo valor

```js
from([1, 2, 3, 4, 5]).pipe(first()) // 1
```

## skip, skipLast

Omite los primeros o ultimos valores

### skipUntil, skipWhile

Omite valores (hasta que) / (mientras que) un observable origen emita.

```js
interval(1000).pipe(skipUntil(timer(6000)));
```

### throttleTiime

Emite el primer valor, luego ignora un tiempo determinado

```js
interval(1000).pipe(throttleTime(5000))
```

### takeUntil

Emite valores hasta que un observable origen emita.

```js
interval(1000).pipe(takeUntil(timer(5000)));
```

### takeUntilDestroyed

Especial de Angular. Completa el observable cuando, segùn el contexto de llamado (componente, directiva, servicio), es desstruido.

```js
this.route.firstChild.paramMap.pipe(
  takeUntilDestroyed()
).subscribe((res: ParamMap) => { });
```

## Subjects

### Subject

- Emite valores a multiple suscriptores
- No tiene valor inicial y no almacena el último valor
- Útil para eventos simples o notificaciones.

### BehaviorSubject

- Requiere un valor inicial y almacena el último emitido
- Cuando un nuevo observador se suscribe, recibe el ultimo valor almacenado
- Ideal para valores que cambian con el tiempo, como el estado de la aplicación.

### ReplaySubject

- Puede almacenar multiples valores antiguos y emitirlos a nuevos suscriptores
- Se puede configurar para almacenar un número especifico de valores o valores dentro de una ventana de tiempo
- Útil cuando necesitas proporcionar valores "perdidos" a nuevos suscriptores, como un historial reciente.

### AsyncSubject

- Emite solo el ultimo valor a los observadores cuando la secuencia se completa
- Se usa raramente, pero puede ser útil cuando solo te interesa el valor final de una operación asíncrona.

## Casos de uso comunes

### Subject pattern

```js
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageSubject = new Subject<string>();

  message$ = this.messageSubject.asObservable();

  sendMessage(message: string) {
    this.messageSubject.next(message);
  }

  clearMessage() {
    this.messageSubject.next('');
  }
}
```

### Debounce y throtle

```js
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({...})
export class SearchComponent {
  @ViewChild('searchInput') searchInput: ElementRef;

  ngAfterViewInit() {
    fromEvent(this.searchInput.nativeElement, 'input').pipe(
      map((event: any) => event.target.value),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      // Realizar la búsqueda
    });
  }
}
```

### http

```js
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get('https://api.example.com/data').pipe(
      catchError(error => {
        console.error('Error:', error);
        return throwError('Algo salió mal; por favor intenta de nuevo más tarde.');
      })
    );
  }
}
```

```js
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({...})
export class DataComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://api.example.com/data').pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      // Procesar datos
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Destroy

Es importante desuscribirnos de los observers para evitar fugas de memoria, hay varias fomas de hacerlo, pero una muy útil para no tener que hacerlo en onDestroy es

```js
private readonly destroy: DestroyRef = inject(DestroyRef);

ngOnInit(): void {
  of([])
    .pipe(takeUntilDestroyed(this.destroy))
    .subscribe();
}
```
