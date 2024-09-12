# Componentes

Los componentes tienen 3 partes:

- template: Define el layout y el contenido de la vista
- class: Defina la logica del componente
- metadata: Información adicional del componente

Algunas metadatas son:

- selector: el nombre del componente o selector css
- standalone: decir si el componente es standalone o pertenece a un modulo
- providers: define los providers de las dependencias del componente
- imports: cuando el componente es standalone, nos permite importar
- styles: estilos en linea
- styleUrl: archivo de estilos
- template: template UI en linea
- temlateUrl: archivo de template
- changeDetection: modo de detección
- viewEncapsulation

## View Encapsulation

Es una feature de Angular que permite especificar cómo se aplican los estilos a los componentes. Por defecto, Angular usa EmulatedEncapsulation, en la cual los estilos tienen alcance solo al componente y no afecta a otros.

```javascript
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AppComponent { }
```

Existen otras 2 formas de encapsulación:

**Shadow DOM encapsulation**:

Los estilos son aplicados usando shadow dom y no afectan otro componentes. Este usa el shadow dom nativo del navegador y debe estar habilitado para poder usarlo.

```js
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent { }
```

**None encapsulation**:

Los estilos no son encapsulados de ninguna manera, y pueden afectar otros componentes

```js
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent { }
```

## Comunicación 

### Parent to child
Para que un padre pueda comunicarse con sus hijos, podemos hacer uso de `@Input()` para pasarle información al hijo. 

```js
@Component({})
class AComponent {
  @Input() title: string;
}
```

```js
@Input({
  transform: booleanAttribute,
  required: true
})
```

Además, en las nuevas versiones podemos usar input signals.

```js
// optional inputs
firstName = input<string>();
age = input(0);

// required inputs
lastName = input.required<string>();
```

### Child to parent
Para comunicar un hijo con el padre podemos usar `@Output()`. Esto le permite emitir eventos que el padre puede escuchar.

```js
@Component({ selector: 'app-child'}) 
class ChildComponent {
  @Output() messageEvent = new EventEmmiter<string>();

  sendMessage() {
    this.messageEvent.emit("Hola")
  }
}

@Component({
  template: `
    <app-child (messageEvent)="receiveMessage($event)" ></app-child>
  `
}) 
class ParentComponent {
  receiveMessage(message: string) {
    // child message --> message
  }
}
```

En esta forma de comunicación tambien existen los signals.

```js
messageEvent = output<string>()

...

this.messageEvent.emit("Hola")
```

### Sibling to sibling
Para esto podemos usar servicios, Subjects y ViewChild.

**Servicios**:

```js
@Inject({root: true})
class DataService {
  message = new Subject<string>();

  setMessage(m: string) { this.message.next(m); }
  getMessage() { return this.message; }
}

///

@Component({})
class Sibling1Component {
  constuctor(private dataService: DataService) {}

  sendMessage() {
    this.dataService.setMessage("hola hermano 2")
  }
}

///

@Component({})
class Sibling2Component {
  constuctor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.message.suscribe((m) => {
      console.log(m)
    })
  }
}
```

Ahora veamos la estrategia de viewChild. Puesto que con ViewChild podemos hacer referencia a otros componentes, podemos enviarle la información de forma directa.

```js
@Component({})
class Sibling1Component {
  @ViewChild(Sibling2Component) sibling2: Sibling2Component;

  sendMessage() {
    this.sibling2.message = 'Hello from sibling1 component';
  }
}

// 

@Component({})
class Sibling2Component {
  message: string;
}
```