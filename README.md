# Esquina Libertad · Carta digital

Carta web mobile-first para abrir desde el QR de la mesa. Es un sitio estático (HTML + CSS + JS, sin build ni dependencias) armado a partir de `Esquina - Carta Digital 7.10 Corregida.pdf`.

## Qué hace

- **Info del local arriba:** 15% de descuento en efectivo, WiFi con botón "Copiar clave" y reservas por WhatsApp (mensaje precargado) o Instagram.
- **Navegación sticky:** tabs Comida · Bebidas · Postres y café y chips por categoría que se marcan solos al scrollear.
- **Links por categoría:** `/#pizzas`, `/#tragos-de-autor`, etc., para compartir o imprimir un QR por sección.
- **Buscador sin acentos:** "faina" encuentra "Fainá". Busca en nombre, descripción, opciones y categoría.
- **Filtros de dieta:** Vegetariano (incluye veganos), Vegano y Sin TACC, combinables. Las categorías vacías se ocultan.
- **Detalle de cada ítem** en bottom sheet: elegir opción (Rubia/Roja/IPA), tamaño (Mediana/Grande), adicional (doble carne) y cantidad, con el precio en efectivo.
- **Mi pedido:** lista local para mostrarle al mozo, con total y total con 15% en efectivo. No envía nada; se guarda en el navegador.
- Ítems con `available: false` se muestran tachados como "Sin stock".

## Estructura

```
index.html        estructura + íconos SVG
styles.css        estilos (tokens de color y tipografía en :root)
app.js            render, scroll-spy, búsqueda, filtros, pedido
data/menu.js      TODA la carta: categorías, ítems, precios, datos del local
assets/           logo (vector, extraído del PDF), ornamentos y fotos
```

## Cambiar precios o platos

Todo está en `data/menu.js`. Para subir un precio, cambiá el número de `price` (sin puntos ni `$`):

```js
{ name: "Hummus con pan árabe", price: 10000, tags: ["vegano"] },
```

Campos disponibles por ítem: `name`, `desc`, `price`, `variants` (tamaños con precio propio), `options` (opciones sin cambio de precio), `unit` ("x2", "1/2 Lt"), `tags` (`vegetariano`, `vegano`, `sintacc`, `kosher`) y `available`. Los datos del local (WiFi, WhatsApp, descuento, fecha de actualización) están en `settings`.

## Verlo en local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

También funciona abriendo `index.html` directo en el navegador.

## Publicar

Es una carpeta estática: se puede subir tal cual a Vercel, Netlify o GitHub Pages. Conviene usar una URL fija para el QR, así no hay que reimprimirlo cuando cambian los precios.

Para Framer o Webflow: publicar esta carpeta y linkear el QR a esa URL, o embeberla con un componente Embed/iframe a pantalla completa.

## Pendiente de confirmar con el local

Corregí en la web estos errores de tipeo del PDF: "Wold Turkey" → Wild Turkey, "Chardonay" → Chardonnay, "ciboullette" → ciboulette, "gratén" → gratín, "Ramazzoti" → Ramazzotti, "$44000" → $44.000. También saqué el "Lorem ipsum" que había en Vermut.

Quedan para confirmar:

- **Fainá:** tiene la misma descripción que la Quesadilla ("con hongos, cebolla caramelizada y morrón"). Se dejó como está en el PDF.
- **Íconos de dieta:** el PDF usa un brote (vegetariano) y dos hojas (vegano) sin leyenda. La Ensalada de terrina tiene dos hojas pero lleva queso reggianito, así que se marcó como vegetariana. El ícono de dos hojas que está entre Falafel y Wrap se asignó al Falafel.
- **Sin TACC:** solo están marcados los 2 platos de "Platos sin TACC". ¿Hay otros aptos?
- **Picada Medio Oriente:** tiene una "K" en círculo; se mostró como Kosher.
- "Queppe" (Empanadas) y "quebbe" (Picada Medio Oriente) se dejaron como en el original.
