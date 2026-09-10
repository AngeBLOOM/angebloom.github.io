# Suena — cursos de idiomas para hispanohablantes

**Suena**: siete cursos de idiomas en español, cada uno en una sola página. Sin registro, sin backend y sin
dependencias: todo el sitio son ficheros estáticos que funcionan también sin conexión.

| Carpeta | Curso | Lo que tiene de propio |
|---|---|---|
| `tailandes/` | **Hua Jai Thai** | Los 5 tonos, las 44 consonantes y sus clases |
| `japones/` | **Kana no Michi** | 46 hiragana + 46 katakana, el ritmo de las moras |
| `coreano/` | **Hangul Gil** | El hangul y cómo se montan los bloques silábicos |
| `ingles/` | **Sounds Right** | Los 20 sonidos que no tenemos y nuestros errores típicos |
| `italiano/` | **Andiamo** | Las consonantes dobles y los falsos amigos |
| `chino/` | **Sì Shēng** | Los cuatro tonos y el pinyin con sus trampas |
| `ruso/` | **Bukva** | Las letras que parecen las nuestras, y el acento móvil |

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
tuusuario.github.io/            → portal con las siete tarjetas
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
| `data-<idioma>.js` | Todo lo propio del idioma: color, textos, alfabeto, vocabulario, gramática, números |
| `build.js` | Genera `dist-<idioma>/` con su tipografía y sus metadatos |
| `gen-portal.js` | Genera el portal raíz a partir de los paquetes |
| `gen-icons.js` | Genera los iconos PNG sin dependencias |
| `verificar.js` | Comprueba que ningún idioma arrastre escritura de otro |

Reconstruir todo:

```bash
for L in tailandes japones coreano chino ruso ingles italiano; do
  node build.js $L https://tuusuario.github.io/
done
node gen-portal.js https://tuusuario.github.io/ tailandes japones coreano chino ruso ingles italiano
node verificar.js
```

`verificar.js` revisa cada sitio construido con dos redes. La primera busca escritura ajena: texto
tailandés en el curso de ruso, kana en el de chino. La segunda busca fugas en castellano — el nombre de
otro idioma o de su escritura («tailandés», «hangul», «pinyin»…) escrito a mano en el motor. Esta
segunda es la que más falta hacía: los nombres van acentuados a propósito, para no chocar con los
identificadores del código, que no llevan tilde.

**Pásalo siempre después de construir**: el motor es compartido y cualquier cadena que se deje escrita
a mano en él acaba apareciendo en los siete cursos. Lo propio de cada idioma va en su `data-*.js`:
`LANG.textos` para las frases, `CLASSNOTA` para la regla que explica la clase de cada letra y `PATH`
para el índice que ven los buscadores y quien tenga JavaScript desactivado.

**Añadir un idioma nuevo** es copiar un `data-*.js`, traducir su contenido y añadirlo a esos dos comandos.
El paquete declara qué secciones tiene, cómo se llaman, qué voz usa y con qué tipografía se escribe.

### Marcas que se estudian pero no se escriben

El ruso se aprende con la tilde del acento marcada, porque sin ella no hay forma de saber dónde cae ni
cómo suenan las vocales. Pero en ruso real esa tilde no existe. Por eso el paquete declara
`LANG.marcaOpcional` y aparece un interruptor en la barra lateral: **Marcado** para estudiar,
**Texto real** para leer como se lee fuera de clase. El teclado y lo que escribe quien estudia quedan
fuera del filtro, y el dictado nunca exige la marca. Cualquier idioma puede usarlo declarando ese
campo con el carácter que corresponda.

### El horario y el recordatorio

En **Cómo estudiar**, cada persona marca sus días, su hora y cuánto rato quiere estudiar. Con eso la
página genera una cita `.ics` que se repite cada semana y lleva su propia alarma diez minutos antes,
para importarla en el calendario del móvil.

Se hace así por una limitación real, no por comodidad: sin servidor no se pueden mandar
notificaciones push, y la API que permitía programar avisos locales en el navegador
(`TimestampTrigger`) nunca pasó de fase experimental y hoy no existe en ningún navegador estable. La
única forma de que suene un aviso con la web cerrada es que lo ponga el calendario del propio
teléfono. Dentro de la página quedan dos cosas menores: la línea de «tu próxima sesión» en la portada
y, si se autoriza, una notificación mientras la pestaña siga abierta.

La hora del `.ics` es **flotante** a propósito (sin `TZID` ni `Z`): la sesión es a las siete de donde
estés, no a las siete de un huso fijo. Las líneas se pliegan a 75 octetos como pide la norma, que es
donde Outlook se pone quisquilloso.

### El botón de apoyo y la autoría

Ambos viven en la cabecera de `part3.js` (`SUPPORT` y `AUTOR`) y se aplican a los cinco cursos y al
portal a la vez. Cambiar el enlace o el nombre en un sitio los cambia en todos.

---

## Antes de cobrar por esto

Ningún curso está revisado por hablantes nativos y el audio es síntesis de voz del navegador.
Para publicarlo como producto de pago, hazlo revisar y sustituye el audio por grabaciones reales.
