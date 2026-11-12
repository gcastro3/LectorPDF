# Lector de documentos — app instalable (PWA)

Lector de PDF para celular y tablet: texto adaptable, modos claro/sepia/oscuro/negro, tamaño de letra con botones o pellizco, índice, búsqueda, progreso guardado y funcionamiento sin conexión.

## Contenido del paquete

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La aplicación completa |
| `manifest.webmanifest` | Nombre, ícono y colores de la app instalada; "Compartir con Lector" en Android |
| `sw.js` | Service worker: permite usarla sin conexión |
| `pdf.min.js`, `pdf.worker.min.js` | Motor de lectura de PDF (pdf.js 3.11.174, licencia Apache 2.0) |
| `icon-*.png`, `apple-touch-icon.png` | Íconos |

## Publicarla gratis con GitHub Pages (≈10 minutos)

La app necesita estar en una dirección **https** para poder instalarse.

1. Entra a github.com e inicia sesión (o crea una cuenta gratuita).
2. Crea un repositorio nuevo, por ejemplo `lector`, **público**.
3. En el repositorio: **Add file → Upload files** y arrastra **todos** los archivos de esta carpeta (sin subcarpetas). Confirma con **Commit changes**.
4. Ve a **Settings → Pages**. En *Source* elige **Deploy from a branch**, rama **main**, carpeta **/ (root)** y guarda.
5. En uno o dos minutos la app queda en `https://TU-USUARIO.github.io/lector/`.

> Alternativas igual de válidas: Netlify Drop (arrastras la carpeta en app.netlify.com/drop) o Cloudflare Pages.

## Instalarla en el celular

**Android (Chrome):** abre la dirección → aparece el aviso **Instalar** dentro de la app (o menú ⋮ → *Instalar aplicación*). Queda con su ícono en el inicio.
Además, desde cualquier app (WhatsApp, Gmail, Archivos) puedes tocar **Compartir → Lector** sobre un PDF para abrirlo directamente.

**iPhone / iPad (Safari):** abre la dirección → botón **Compartir** (□↑) → **Agregar a inicio**. En iOS la opción "Compartir con Lector" no está disponible; los PDF se abren con el botón *Abrir documento*.

## Actualizar la app

Sube los archivos modificados al mismo repositorio. Si cambias algo, edita en `sw.js` la línea `const VERSION = "lector-v1";` (por ejemplo a `lector-v2`) para que los celulares descarguen la nueva versión. La app se actualiza sola la siguiente vez que se abre con conexión.

## Notas

- Los documentos se guardan solo en el dispositivo donde se abrieron; no se sincronizan entre equipos.
- Si desinstalas la app o borras los datos del navegador, se borra la biblioteca.
- PDF escaneados (imágenes) no se pueden leer; la app lo avisa.
- Tablas complejas y textos a dos columnas pueden quedar desordenados.
