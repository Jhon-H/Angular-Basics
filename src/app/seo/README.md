# SEO

Veamos cómo podemos agregar meta etiquetas y creemos un servicio de SEO que se encargue de agregar estas etiquetas de forma dinámica.

Para modificar el título usamos Title

```js
import { Title } from '@angular/platform-browser';

constructor(private titleService: Title) {}

this.titleService.setTitle("title")
```

Para modificar las meta etiquetas usamos Meta

```js
import { Meta } from '@angular/platform-browser';

constructor(private metaService: Meta) {}

this.metaService.updateTag({name: "keywords", value: "a, b, c"})
this.metaService.updateTag({property: "og:title", value: "title"})
```
