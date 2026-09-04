# Cursos de idiomas para hispanohablantes

Cinco cursos de idiomas en español, cada uno en una sola página. Sin registro, sin backend y sin
dependencias: todo el sitio son ficheros estáticos que funcionan también sin conexión.

| Carpeta | Curso | Lo que tiene de propio |
|---|---|---|
| `tailandes/` | **Hua Jai Thai** | Los 5 tonos, las 44 consonantes y sus clases |
| `japones/` | **Kana no Michi** | 46 hiragana + 46 katakana, el ritmo de las moras |
| `coreano/` | **Hangul Gil** | El hangul y cómo se montan los bloques silábicos |
| `ingles/` | **Sounds Right** | Los 20 sonidos que no tenemos y nuestros errores típicos |
| `italiano/` | **Andiamo** | Las consonantes dobles y los falsos amigos |

Todos comparten las mismas herramientas: alfabeto o sonidos con ficha ampliada, trazado a mano donde
tiene sentido, tarjetas de vocabulario con cinco niveles, frases por situación, gramática con
constructor de frases, números, juegos (emparejar y dictado), repaso mezclado, objetivo diario y racha.

El progreso se guarda en `localStorage`, es decir, en el navegador de cada persona. No se envía nada
a ningún servidor.

---

## Publicar en GitHub Pages

Para que las direcciones queden limpias (`tuusuario.github.io/japones/`) hace falta un repositorio
llamado exactamente **`TUUSUARIO.github.io`**:

1. Crea ese repositorio, **público**.
2. Sube el contenido de esta carpeta **respetando las subcarpetas**.
3. **Settings → Pages → Deploy from a branch → `main` / `(root)`**.
4. Si tenías otro repositorio sirviendo alguna de esas rutas, desactívale Pages para que no choquen.

Queda así:

```
tuusuario.github.io/            → portal con las cinco tarjetas
tuusuario.github.io/tailandes/
tuusuario.github.io/japones/
tuusuario.github.io/coreano/
tuusuario.github.io/ingles/
tuusuario.github.io/italiano/
```

---

## Cómo está montado

Un solo motor y un paquete de datos por idioma:

| Fichero | Qué es |
|---|---|
| `part1.html` | Estilos y estructura, comunes a todos |
| `part3.js`, `part4.js` | El motor: vistas, tests, juegos, progreso |
| `data-<idioma>.js` | Todo lo propio del idioma: textos, alfabeto, vocabulario, gramática, números |
| `build.js` | Genera `dist-<idioma>/` con su tipografía y sus metadatos |
| `gen-portal.js` | Genera el portal raíz a partir de los paquetes |
| `gen-icons.js` | Genera los iconos PNG sin dependencias |

Reconstruir todo:

```bash
for L in tailandes japones coreano ingles italiano; do
  node build.js $L https://tuusuario.github.io/
done
node gen-portal.js https://tuusuario.github.io/ tailandes japones coreano ingles italiano
```

**Añadir un idioma nuevo** es copiar un `data-*.js`, traducir su contenido y añadirlo a esos dos comandos.
El paquete declara qué secciones tiene, cómo se llaman, qué voz usa y con qué tipografía se escribe.

### El botón de apoyo y la autoría

Ambos viven en la cabecera de `part3.js` (`SUPPORT` y `AUTOR`) y se aplican a los cinco cursos y al
portal a la vez. Cambiar el enlace o el nombre en un sitio los cambia en todos.

---

## Antes de cobrar por esto

Ningún curso está revisado por hablantes nativos y el audio es síntesis de voz del navegador.
Para publicarlo como producto de pago, hazlo revisar y sustituye el audio por grabaciones reales.
