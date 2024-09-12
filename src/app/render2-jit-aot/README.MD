## Render2

Proporciona una API para acceder de forma segura a elementos DOM incluso cuando no están soportados por la plataforma (web workers, SSR). Además, evitamos acoplar la capa de lógica con la capa visual.

```js
@Component({
  selector: 'app-root',
  template: '<button #myButton></button>'
})
export class AppComponent{
  @ViewChild("myButton") myButton: ElementRef;

  constructor(private renderer: Renderer2) {}

  click(): void {
    this.renderer.addClass(this.myButton.nativeElement, "clicked")
    this.renderer.setAttribute(this.myButton.nativeElement, "disabled", "true");
    this.renderer.selectRootElement(this.myButton.nativeElement).click(); // llamar un metodo
  }

  addText() { // Crear contenido en el DOM
    let text = this.renderer.createText("my button");
    this.renderer.appendChild(this.myButton.nativeElement, text);
  }
}
```

- addClass
- removeClass
- setAttribute
- removeAttribute

## JIT vs AOT

### JIT

**Just in time** es un tipo de compilación que compila la aplicación en el navegador en runtime. Es el modo de compilación por defecto de Angular.

Ventajas:

- Cambios de desarrollo más rápidos de ver
- No se necesitan pasos de build durante desarrollo
- Generación más flexible del template

### AOT

**Ahead of time** es un tipo de compilación que compila la aplicación durante build. Se usa para precompilar aplicaciones Angular antes del despliegue.

Ventajas:
- Tiempos de inicio más rápido ya que el navegador solo debe procesar código compilado
- Rendimiento mejorado gracias a las plantillas optimizadas y precompiladas
- Mayor seguridad ya que las plantillas ya están compiladas y validadas
- Tamaño de paquete más pequeños
