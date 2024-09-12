# HTTP

## Interceptors

```js
@Injectable()
export class MyInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const httpReq = req.clone({
      url: req.url.replace("http://", "https://"),
    });
    return next.handle(httpReq);
  }
}
```

Luego de tener el servicio, tenemos que registrarlo en el sistema de inyección de dendepencias de Angular.

Puede ser en el Root si asi se quiere o en otro modulo/componente. Notemos que usamos `multi: true` y un token de inyección ya definido por Angular

```js
providers: [{ provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true }];
```

Casos de uso comunes:

- Agregar headers
- Agregar tokens de autentación
- Almacenar logs de peticiones realizadas
- Loading centralizado
- Manejar errores
- Notificaciones
- Debugger respuestas
- Calcular tiempo que tarda en salir y regresar la request