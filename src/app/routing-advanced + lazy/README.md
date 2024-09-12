# Routing

## Modulos

### Declaración

Creamos un módulo con las rutas

```js
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

Luego, tenemos que agregar este modulo en el modulo root.

Para definir rutas tenemos la siguiente estructura

```js
const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HomeComponent,
  },
  {
    path: "404",
    component: Error404Component,
  },
  {
    path: "**",
    redirectTo: "/404",
  },
];
```

### Rutas hijas

Para declarar rutas hijas podemo hacerlo en el mismo archivo o crear otro con rutas hijas. Veamos ambas opciones

- En el mismo archivo

```js
const routes: Routes = [
  {
    path: "config",
    componente: ConfigComponent,
    children: [
      {
        path: "user-settings",
        componente: UserSettingsComponent,
      },
    ],
  },
];
```

- En otro archivo con lazy load

```js
const routes: Routes = [
  {
    path: "config",
    componente: ConfigComponent,
    loadChildren: () => import("./settings/user-settings.module").then((e) => e.UserSettingsModule),
  },
];

// routes user settings
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
const RouterModule { }
```

### Layout

Veamos un ejemplo para usar layouts

```js
const routes = [
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full",
  },
  {
    path: "",
    component: MainLayoutComponent,
    children: [
      { path: "dashboard", loadChildren: "../dashboard/dashboard.module#DashboardModule" },
      { path: "users", loadChildren: "../users/users.module#UsersModule" },
      { path: "account-settings", loadChildren: "../account-settings/account-settings.module#AccountSettingsModule" },
    ],
  },
  {
    path: "",
    component: FooterOnlyLayoutComponent,
    children: [
      { path: "login", loadChildren: "../login/login.module#LoginModule" },
      { path: "registration", loadChildren: "../registration/registration.module#RegistrationModule" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
```

### Active links

- Usamos `routerLink="courses"` para decirle a un link a donde redirigir
- Usamos `routerLinkActive="active" oara asignar una clase al links cuando este activa esa ruta`

### Query params

Para acceder a los parametros de rutas podemmos hacer:

```js
constructor(router: Router) {
  route.params.subscribe(
    params =>{
      this.courseId = parseInt(params['id']);
    }
  );
}
```

### Instantanea

Es posible que queramos obtener información de la ruta al momento de crearse y no luego de actualizaciones, ya que el enrutado es reactivo.

```js
constructor(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const parentRouteId = state.parent(route).params['id'];
}
```

### Rutas auxiliares

Son rutas que se asigan a un outlet nombrado, no al principal. Por ejemplo

```js
<router-outlet></router-outlet>
<router-outlet name="section1"></router-outlet>
<router-outlet name="section2"></router-outlet>
<router-outlet name="section3"></router-outlet>
```

Por ejemplo

```js
{
  path: 'playlist',
  outlet: 'aside',
  component: Playlist
}
```

Así se vería la url: `/lessons(aside:playlist//leftmenu:/some/path)`

### Podemos escuchar eventos del router

```js
constructor(private router: Router) {
  router.events.subscribe((event) => {
    if (event instanceof NavigationStart) {
      console.log('Navigation started');
    }
    if (event instanceof NavigationEnd) {
      console.log('Navigation ended');
    }
    if (event instanceof NavigationError) {
      console.log('Navigation error');
    }
  });
}
```

### Guards

Un Guard es una clase (o función) que le dice a Angular si una ruta puede cargarse, activarse o desactivarse Podemos controlar la navegación y acceso a rutas, tenemos varias opciones.

- `canActivate`: Determinar si una ruta puede ser activiada. Se puede usar para protección de authenticación

```js
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

//

{
  ruta : 'dashboard' ,
  componente : DashboardComponent ,
  canActivate : [ AuthGuard ] // Aplicar AuthGuard para proteger la ruta del panel
},
```

- `CanActivateChild`: Como canActivate, pero controla la navegación de rutas secundarias

```js
@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivateChild {

  constructor(private authService: AuthService, private router: Router) {}

  canActivateChild(): boolean {
    if (this.authService.isUserLoggedIn() && this.authService.isAdmin()) {
      return true; // Allow access if the user is logged in and is an admin
    } else {
      this.router.navigate(['/unauthorized']); // Redirect if not authorized
      return false; // Prevent access to admin child routes
    }
  }
}

//

{
  path: 'admin',
  component: AdminPanelComponent,
  canActivateChild: [AdminAuthGuard], // Apply AdminAuthGuard to protect child routes
  children: [
    // Child routes accessible only to authenticated admins
    // Example: /admin/users, /admin/settings, etc.
  ]
},
```

- `canDeactivate`: Valida si una ruta puede ser desactivada, a menudo se usa para validar si un usuario puede salir de una ruta

```js
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: "root",
})
export class PreventUnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}

//
export class EditComponent implements CanComponentDeactivate {}
```

- `canLoad`: Evita que un modulo se cargue de forma diferida hasa que se cumplan ciertas condiciones. Por ejemplo, se puede usar para cargar modulos basados en roles.

```js
@Injectable({
  providedIn: 'root'
})
export class PremiumFeatureGuard implements CanLoad {

  constructor(private authService: AuthService) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    if (this.authService.isUserPremium()) {
      return true; // Allow lazy loading if the user is premium
    } else {
      // Handle cases where the user is not premium (redirect, show message, etc.)
      return false; // Prevent lazy loading of the premium feature module
    }
  }
}

//+

{
  path: 'premium',
  canLoad: [PremiumFeatureGuard], // Apply PremiumFeatureGuard to prevent lazy loading
  loadChildren: () => import('./premium-feature/premium-feature.module').then(m => m.PremiumFeatureModule)
},
```

### Resolvers

Es una clase que tiene un metodo y actua como proveedor de datos para inicializar la página y hace que el enrutador espere a que se resulevan los datos antes de activar la ruta.

```js
@Injectable({
  providedIn: 'root'
})
export class ProductsResolverService implements Resolve<any> {
  constructor(private product: ProductService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    console.log('Called Get Product in resolver...', route);
    return this.product.getProducts().pipe(
      catchError(error => {
        return of('No data');
      })
    );
  }
}

//

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'products',
    component: ProductsComponent,
    resolve: { products: ProductsResolverService }
  },
  { path: 'about', component: AboutComponent }
];

//
constructor(private activatedRoute: ActivatedRoute) {}

ngOnInit(): void {
  this.activatedRoute.data.subscribe((response: any) => {
    console.log('PRODUCT FETCHING', response);
    this.products = response.products;
    console.log('PRODUCT FETCHED');
  });
}
```

## Defer views

Podemos carga de forma diferida componentes con placeholder y condiciones especificas

```js
@defer {
  <large-component />
} @placeholder (minimum 500ms) {
  <p>Placeholder content</p>
}
```

Para que un componente puede ser diferido tiene que ocurrir 2 cosas:

- debe ser standalone
- no debe estar referenciado en otro lado fuera de `defer`

Podemos usar `@loading` para mostrar contenido mientras se carga

```js
@defer {
  <large-component />
} @loading (after 100ms; minimum 1s) {
  <img alt="loading..." src="loading.gif" />
}
```

Para entender la diferencia con placeholder, debemos conocer los estados de carga

- En espera: el @defer bloqueo no se ha activado; no se cumplen las condiciones. El contenido no se está cargando.
- Cargando: @deferse activa (se cumplen las condiciones). El contenido diferido se está cargando. El @placeholder bloque ahora está oculto y @loadingse muestra.
- Cargado/Listo: el contenido diferido se carga y se muestra. Los demás subbloques desaparecen.

Además, en caso de error podemos mostrar otro contenido

```js
@defer {
  <calendar-cmp />
} @error {
  <p>Failed to load the calendar</p>
}
```

Por otro lado, podemos tener desencadenantes para decirle a defer cuando activarse.
Nota: `on` y `when` se unen con un OR

```js
@defer (on viewport; on timer(5s)) { // --> Cuando esté en el viewport O luego de 5 segundos
  <calendar-cmp />
} @placeholder {
  <img src="placeholder.png" />
}
```

```js
@defer (on viewport; when cond) { // Cuando esté en el viewport O cuando se cumpla la condicion
  <calendar-cmp />
} @placeholder {
  <img src="placeholder.png" />
}
```

Para el viewport, tambien podemos referenciar otros componentes

```html
<div #greeting>Hello!</div>
@defer (on viewport(greeting)) {
<greetings-cmp />
}
```

Otras

- `on interaction` o `on interaction(#reference)`
- `on hover` o `on hover(#reference)`
- `on viewport` o `on viewport(#reference)`
- `on timer(time)`

Podemos pregargar el componente para que se cargue más rápido

```js
@defer (on interaction; prefetch on idle) {
  <calendar-cmp />
} @placeholder {
  <img src="placeholder.png" />
}
```

Importante:
- En sitios SSR que usen defer, se cargará el placeholder o nada
- 

## Standalone

```

```
