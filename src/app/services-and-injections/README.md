# Servicios

Los servicios se usan para encapsular lógica que puede ser compartida a través de los componentes

```js
@Injectable
export class DataService {
  getData() {
    return "Data from the service";
  }
}
```

## Inyección manual

veamos un ejemplo de cómo podemos crear un servicio desde cero. Para esto necesitamos

- Una clase que actue como servicio
- Una función fábrica que va a creer el provider
- Un Token de inyección para identificar el provider
- Agregar el servicio al sistema de inyección de dependencias
- Una clase que inyecte este servicio

```js
// class
export class CourseService {
  constructor(private http: HttpClient) {}
}

// fabric function
export const function coursesServiceProviderFactory(http:HttpClient): CoursesService {
  return new CoursesService(http);
}

// inyection token
export const COURSES_SERVICE_TOKEN = new InjectionToken<CoursesService>("COURSES_SERVICE_TOKEN");

// Sistema de inyección
{
  providers: [
    {
      provide: COURSE_SERVICE_TOKEN, // token para identificar de forma unica
      useFactory: coursesServiceProviderFactory, // función para crear el provider
      deps: [HttpClient] // dependencias del servicio
    }
  ]
}

// Clase que haga uso del servicio
@Component({})
class CourseComponent {
  constructor(@Inject(COURSES_SERVICE_TOKEN) private courseService: CourseService) {}
}
```

Esto es lo que sucede bajo el capó cuando creamos un servicio, pero siempre hay un proveedor y un token de inyección (u otro mecanismo de identificación) cuando creamos servicios, componentes y demás.

### De manual a automático

Veamos a hora como pasar de la forma manual a la automatica a la que estamos acostumbrados

- Podemos usar la clase como identificador y así reemplazar el token de inyección

```js
{
  providers: [
    {
      provide: CoursesService,
      useFactory: coursesServiceProviderFactory,
      deps: [HttpClient],
    },
  ];
}
```

- Ya que borramos el token, podemos usar la clase del servicio en el componente

```js
constructor(@Inject(CoursesService) private coursesService: CoursesService) {}
```

- Podemos configurar los porveedores de forma más sencilla. Podemos cambiar `useFactory` por `useClass` para que Angular sepa que le pasamos una función constructora válida y puede simplemente usar new.

```js
[
  {
    provide: CoursesService,
    useClass: CoursesService,
    deps: [HttpClient],
  },
];
```

- Como usamos `useClass`, Angular intentará inferir el token en tiempo de ejecución. En ezte caso Angular inspecciona el tipo de la propiedad inyectada (`CoursesService`) y usar ese tipo para determinar el proveedor y sus dependencias

```js
constructor(private coursesService: CoursesService) {}
```

- Podemos simplificar la declaración del proveedor

```js
providers: [CoursesService];
```

- Pero lo anterior tiene un problema, Angular no sabe como inyectar las dependencias del servicio, para que esto funcione le tenemos que agregar el decorador `@Inject()`

```js
@Injectable()
export class CoursesService() {
  http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }
}
```

## Dependencias multiples

Podemos querer tener multiples proveedores para un mismo token de inyección. En este caso usamos la propiedad `multi: true`, que agrega a un arreglo de proveedores el proveedor que estamos definiendo.

```js
providers: [
  {
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: ChooseQuantityComponent,
  },
];
```

Además, podemos notar que usamos `useExisting`, este se puede usar para definir un proveedor basado en otro ya existente, que a su vez sirve para agregarle un alias a un provider.

## Jerarquía de dependencias y resolución de dependencias

El sistema de inyección de dependencias funciona de forma jerarquica. Funciona de la siguiente forma:

- Angular primer busca en los proveedores del componente
- si no lo encuentra, busca el servicio en los proveedores del componente padre
- sigue así hasta llegar a la raiz
- si no lo encuentra, empieza a buscar en el modulo, y así hasta el modulo raiz

De esto podemos afirmar lo siguiente:

- La jerarquia de dependencias de los componentes tiene prioridad sobre la de los modulos
- Si un componente inyecta un servicio y este se declara en las depencias del componente, entonces cada instancia del componente creará una instancia del servicio.

## Modificar resolución de dependencias

- `@Optiona()`: nos permite decirle a Angular que la dependencia es opcional, en caso de que no encuentre un proveedor, entonces regresará `null`
- `@SkipSelf()`: le dice a Angular que un componente no debe usar su provider, sino buscar desde el padre. Sin embargo, los componentes hijos si podrán usar este provider. Es un caso de uso raro
- `@Self()`: Solo busca en sus depedencias, y no sigue ejecutando la resolución
- `@Host()`: le dice a Angular que solo busque en los proveedores del componente host y en ningun otor lugar

## Three-shakeable dependencies

Al definir el provider en el modulo u otro lugar, Angular no lo eiminará aunque no se use, y esto causa problemas si importamos un modulo que tiene miles de servicios pero solo usamos algunos.

Para ello, en lugar de definir el servicio en el modulo, le decimos al servicio a donde "pertenece".

```js
Injectable({
  providedIn: CoursesModule
})
export class CoursesService() {
}
```

## Ejemplos

Veamos un ejemplo de uso de providers definidos de forma manual.

### Adapter

Veremos un patrón adapter para dado

```js
// Token de inyección para el servicio externo
export const EXTERNAL_SERVICE = new InjectionToken<ExternalService>('ExternalService');

// Clase adaptada (implementación externa)
@Injectable({
  providedIn: 'root'
})
class ExternalServiceImpl implements ExternalService {
  getData() {
    return { id: 1, name: 'Ejemplo' };
  }
}

// Módulo que proporciona el servicio externo
@NgModule({
  providers: [
    { provide: EXTERNAL_SERVICE, useClass: ExternalServiceImpl }
  ]
})
export class ExternalModule {}


// Adaptador
@Injectable({
  providedIn: 'root'
})
export class AdapterService implements ExternalService {
  constructor(@Inject(EXTERNAL_SERVICE) private externalService: ExternalService) {}

  getData() {
    return this.externalService.getData();
  }
}
```

### Estrategy

Veamos como podemos aplicar el patron strategy con esto

```js
//1. Creamos el servicio que usaremos
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private reportGeneratorStrategy: ReportGeneratorStrategy) {}
  generateReport(data: any[]): string {

    return this.reportGeneratorStrategy.generateReport(data);
  }
}

//2. Creamos la clase abstracta de la estrategia
abstract class ReportGeneratorStrategy {
  generateReport(data: any[]): string;
}

//3. Creamos un uso de la estrategia, en este caso reportes en pdf
@Injectable()
export class PdfReportGeneratorStrategy implements ReportGeneratorStrategy {
 generateReport(data: any[]): string {
    return 'PDF Report Content';
  }
}

//4. Inyectamos nuestra estrategia para que sea la que se use
{
  providers: [
    PdfReportGeneratorStrategy
  ]
}

/*
Cuando se use el servicio ReportService, este no sabrá que estrategia se usa y por tanto no dependerá de su implementación.

En cambio, esto se definirá en los proveedores y es aquí donde elegimos la estrategia. Podemos incluso usar diferentes estrategias en diferentes partes del arbol de componentes
*/


// modulo A
{
  providers: [
    {
      provide: ReportGeneratorStrategy, // o token,
      useClass: PdfReportGeneratorStrategy
    }
  ]
}

// modulo B
{
  providers: [
    {
      provide: ReportGeneratorStrategy, // o token,
      useClass: TxtReportGeneratorStrategy
    }
  ]
}
```