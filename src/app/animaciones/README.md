# Animaciones

Angular tiene un API de animaciones, los modulos principales están en `@angular/animations` y `@angular/platform-browser`.

1. Lo primero que debemos hacer es importar el modulo de animaciones

```js
bootstrapApplication(AppComponent, {
  providers: [provideAnimationsAsync()],
});
```

Si necesitaramos cargar las animaciones al instante, debemos usar el modulo `provideAnimations`

2. Usamos la propiedad `animations` del componente

```js
Component({
  standalone: true,
  selector: "app-root",
  animations: [
    // animation triggers go here
  ],
});
```

## Animación básica

Para crear una animación, necesitamos

1. Estado que son los estilos a aplicar
2. Transiciones para indicar cómo pasar de un estado a otro
3. Triggers para decirle a Angular que debe ejecutar una transicion

Ejemplo de estado:

```js
state(
  'open',
  style({
    height: '200px',
    opacity: 1,
    backgroundColor: 'yellow',
  }),
),
```

Ejemplo de transición:

```js
transition('open => closed', [animate('1s')]),
```

En este caso, con `=>` decimos que esa transicion aplica al pasar de estado open a closed (unidireccional). Tambien existe la bidireccional `<=>`.

Tambien podemos tener varios estados `transition( 'on => off, off => void' )`.

Veamos un ejemplo completo junto a triggers:

```js
animations: [
  trigger('openClose', [
    state(
      'open',
      style({
        height: '200px',
        opacity: 1,
        backgroundColor: 'yellow',
      }),
    ),
    state(
      'closed',
      style({
        height: '100px',
        opacity: 0.8,
        backgroundColor: 'blue',
      }),
    ),
    transition('open => closed', [animate('1s')]),
    transition('closed => open', [animate('0.5s')]),
  ]),
],
```

Luego, para usar este trigger, debemos adjuntarlo a un elemento de la plantilla

`<div [@triggerName]="expression">…</div>;`

La animación se activa cuando el valor de la expresión cambia a un nuevo estado

```html
<div [@openClose]="isOpen ? 'open' : 'closed'" class="open-close-container">
  <p>The box is now {{ isOpen ? 'Open' : 'Closed' }}!</p>
</div>
```

## Transiciones y triggers

En Angular podemos definir los estados con: `state`, `*` o `void`

### `*`

Un comodín asterisco coincide con cualquier estado de animación, es util para animaciones que se apliquen a independiente del estado inicial o final.

Por ejemplo, una transición `open => *` aplica cuando el estado cambia de open a cualquier otro.

#### Comodin con estilos

Podemos usar el comodin como valor de respaldo cuando el estado que se anima no está dentro del trigger.

`transition('* => open', [animate('1s', style({opacity: '*'}))]),`

### `void`

Utilizamos el estado `void` para configurar la transicion de un elemento que entra o sale de la página.

- `* => void`: aplicar una transición cuando el elemento sale de la vita sin importar el estado anterior
- `void => *`: cuando el elemento ingresa a la vista
- `*` coincide con cualquier estado, incluso `void`

Veamos un ejemplo

```js
animations: [
  trigger('flyInOut', [
    state('in', style({transform: 'translateX(0)'})),
    transition('void => *', [style({transform: 'translateX(-100%)'}), animate(100)]),
    transition('* => void', [animate(100, style({transform: 'translateX(100%)'}))]),
  ]),
],
```

### `:enter` and `:leave`

`:enter` es un alias para `void => *`, y `:leave` para `* => void`.

Veamos un ejemplo con ngIf y ngFor.

```js
@if (isShown) {
  <div @myInsertRemoveTrigger class="insert-remove-container">
    <p>The box is inserted</p>
  </div>
}

//

trigger('myInsertRemoveTrigger', [
  transition(':enter', [style({opacity: 0}), animate('100ms', style({opacity: 1}))]),
  transition(':leave', [animate('100ms', style({opacity: 0}))]),
])
```

### `:increment` y `:decrement`

Se usan para iniciar una transicion cuando un valor numerico aumenta o disminuye.

```js
trigger('filterAnimation', [
  transition(':enter, * => 0, * => -1', []),
  transition(':increment', [
    query(
      ':enter',
      [
        style({opacity: 0, width: 0}),
        stagger(50, [animate('300ms ease-out', style({opacity: 1, width: '*'}))]),
      ],
      {optional: true},
    ),
  ]),
  transition(':decrement', [
    query(':leave', [stagger(50, [animate('300ms ease-out', style({opacity: 0, width: 0}))])]),
  ]),
]),
```

### Booleanos

Podemos comprar booleanos si estos se usan como estado

```js
animations: [
  trigger("openClose", [
    state("true", style({ height: "*" })),
    state("false", style({ height: "0px" })),
    transition("false <=> true", animate(500))
  ])
];
```

### Animaciones padre e hijo

Cada vez que Angular ejecuta una animación, la animación principal tiene prioridad y las secundarias se bloquean. Para permitir que se ejecuten, podemos usar `animateChild()`

### Desactivar animaciones

Podemos desactivar animaciones usando `@.disabled` con un valor en true

```html
<div [@.disabled]="isDisabled">
  <div [@childAnimation]="isOpen ? 'open' : 'closed'" class="open-close-container">
    <p>The box is now {{ isOpen ? 'Open' : 'Closed' }}!</p>
  </div>
</div>
```

Ademàs, podemos desactivar todas las animaciones, por ejemplo en una prueba E2E

```js
@HostBinding('@.disabled')
public animationsDisabled = false;
```

### trigger callbacks

Un trigger tiene devoluciones de llamada de cuando inicia y cuando termina la animación

```html
<div
  [@openClose]="isOpen ? 'open' : 'closed'"
  (@openClose.start)="onAnimationEvent($event)"
  (@openClose.done)="onAnimationEvent($event)"
  class="open-close-container"
></div>
```

### Keyframes

Nos permite varios cambios de estilos en un único segmento de tiempo. Por ejemplo,

```js
transition('* => active', [
  animate(
    '2s',
    keyframes([
      style({backgroundColor: 'blue'}),
      style({backgroundColor: 'red'}),
      style({backgroundColor: 'orange'}),
    ])
  )
])
```

#### Offset
Los keyframes tiene una propiedad `offset` que definen en que punto del tiempo se aplican los estilos.

- Si usa por lo menos un offset en un keyframe, se debe declarar en los demás
- Si no se usa offset, los estilos se espacian de forma uniforme

```js
transition('* => active', [
  animate(
    '2s',
    keyframes([
      style({backgroundColor: 'blue', offset: 0}),
      style({backgroundColor: 'red', offset: 0.8}),
      style({backgroundColor: '#754600', offset: 1.0}),
    ]),
  ),
]),
```

#### Calculo de propiedades

Si no conocemos un valor al crear la animación (como la altura de un componente), podemos usar el comodin `*` yse reemplazará el valor en tiempo de ejecución. Por ejemplo, acá se animará desde la altura original hasta 0


```js
animations: [
  trigger('shrinkOut', [
    state('in', style({height: '*'})),
    transition('* => void', [style({height: '*'}), animate(250, style({height: 0}))]),
  ]),
],
```

## Secuencias complejas
Podemos crear animaciones más complejas a grupos de elementos y con secuencias coordinadas.

Para ello, veremos 

- `query`: Encuentra a uno o más elementos internos 
- `stagger`: aplica un retraso de cascada a las animaciones de multiples elementos
- `group`: ejecuta multiples pasos de animación en paralelo
- `sequence`: ejecuta los pasos de animación uno tras otro

### query

Podemos usar la combinacion

- `query`+ `animate` para encontrar elementos html simples y animarlos
- `query`+ `animateChild` para consultar elementos secundarios que tengan metadata de animación y activarlo (que de otro modo estaría bloqueada por la animación del elemento actual)

`query` recibe un selector css, pero además, recibe:

- `:enter`, `:leave`: elementos que entran o salen
- `:animating`: elemento que se está animando actualmente
- `@*`, `@triggerName`: elementos con cualquier trigger
- `:self`: elemento animador en si

### stagger

Podemos combinar `query` con `stagger` para encontrar elemntos y darle un retraso a la animación

```js
animations: [
  trigger('pageAnimations', [
    transition(':enter', [
      query('.hero', [
        style({opacity: 0, transform: 'translateY(-100px)'}),
        stagger(30, [
          animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({opacity: 1, transform: 'none'})),
        ]),
      ]),
    ]),
  ])
]
```

Veamos más a detalle:

- `query(.hero)`: busca el o los elementos que tengan la clase hero
- `style`: les da un estilo inicial a todos lo elementos
- `stagger`: retrasa cada animación 30ms
- `animate`: anima cada elemento de la pantalla

### Group
Se usa para agrupar pasos de animación

```js
transition(':enter', [
  style({width: 10, transform: 'translateX(50px)', opacity: 0}),
  group([
    animate(
      '0.3s 0.1s ease',
      style({
        transform: 'translateX(0)',
        width: '*',
      }),
    ),
    animate(
      '0.3s ease',
      style({
        opacity: 1,
      }),
    ),
  ]), 
])
```

En esta caso las animaciones se ejecutarán en paralelo

### Sequence

Permite ejecuta animaciones paso a paso. La podemos usar con

- `style`: aplica los estilos inmediatamente
- `animate`: aplica los estilos en un periodo de tiempo

### NOTAS

- Si anima los elementos con ngFor y estos se reordenan, debe usar `TrackByFunction` para que angular sepa rastrear cada elemento
- Las animaciones se basan en la estrucutra DOM, no tiene en cuenta la view encapsulation



## Animaciones reusables

Podemos usar `animation()` para animaciones reusables

```js
export const transitionAnimation = animation([
  style({
    height: "{{ height }}",
    opacity: "{{ opacity }}",
    backgroundColor: "{{ backgroundColor }}",
  }),
  animate("{{ time }}"),
]);
```

los valores de estilos estilos se reemplazan en tiempo de ejecución, y para usar esta animación usamos `useAnimation()`.

Además, podemos exportar una parte de una animación

```js
export const triggerAnimation = trigger("openClose", [
  transition("open => closed", [
    useAnimation(transitionAnimation, {
      params: {
        height: 0,
        opacity: 1,
        backgroundColor: "red",
        time: "1s",
      },
    }),
  ]),
]);
```

## Animaciones de transicion de ruta

Podemos animar las transiciones entre rutas, para esto haga:

1. Configurar las rutas con un identificador

```js
export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/enter-leave'},
  {
    path: 'open-close',
    component: OpenClosePageComponent,
    data: {animation: 'openClosePage'},
  },
  {
    path: 'status',
    component: StatusSliderPageComponent,
    data: {animation: 'statusPage'},
  },
  {
    path: 'toggle',
    component: ToggleAnimationsPageComponent,
    data: {animation: 'togglePage'},
  }
];
```

2. En app.component agregamos router-outlet, con un trigger para la animación

```html
<div [@routeAnimations]="getRouteAnimationData()">
  <router-outlet></router-outlet>
</div>
```

3. Obtener el identificador de la ruta

```js
constructor(private contexts: ChildrenOutletContexts) {}

getRouteAnimationData() {
  return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
}
```

4. Definimos las animaciones, en este caso en un archivo separado

```js
export const slideInAnimation =
  trigger('routeAnimations', [
    transition('HomePage <=> AboutPage', [
      style({position: 'relative'}),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ]),
      query(':enter', [style({left: '-100%'})], {optional: true}),
      query(':leave', animateChild(), {optional: true}),
      group([
        query(':leave', [animate('300ms ease-out', style({left: '100%'}))], {optional: true}),
        query(':enter', [animate('300ms ease-out', style({left: '0%'}))], {optional: true}),
      ]),
    ]),
    transition('* <=> *', [
      style({position: 'relative'}),
      query(
        ':enter, :leave',
        [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }),
        ],
        {optional: true},
      ),
      query(':enter', [style({left: '-100%'})], {optional: true}),
      query(':leave', animateChild(), {optional: true}),
      group([
        query(':leave', [animate('200ms ease-out', style({left: '100%', opacity: 0}))], {
          optional: true,
        }),
        query(':enter', [animate('300ms ease-out', style({left: '0%'}))], {optional: true}),
        query('@*', animateChild(), {optional: true}),
      ]),
    ]),
  ]);
```

5. Agregamos la animación en appComponent

```js
@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  imports: [RouterLink, RouterOutlet],
  animations: [
    slideInAnimation
  ],
})
```