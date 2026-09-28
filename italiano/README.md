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
| `vida.js` | Dibujos de las palabras, experiencia y niveles, celebraciones y el «siguiente paso». Va entre `part3.js` y `part4.js` |
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

### Lo que da vida: `vida.js`

- **Dibujos.** Cada palabra lleva un emoji, buscado por su significado en español, que es lo único que
  comparten los siete cursos: primero frases hechas («hace calor»), luego palabra a palabra y, si nada
  encaja, el de su categoría. Salen en las tarjetas (al verse el significado, para no regalar la
  respuesta), en la lista y en las cartas del juego de parejas. Para una palabra nueva sin dibujo, se
  añade a `DIBUJO_PALABRAS`. **Nunca pongas ahí nombres de idioma** («ruso», «china»…): el verificador
  los detecta como fuga, con razón.
- **Experiencia y niveles**, por curso: escuchar +1, tarjeta +5 (o +2 si no la sabías), acierto en
  test +10, letra aprendida +5, pareja +5, partida completa +40, dictado +15, habla +10, objetivo del
  día +50. La tabla de niveles es `25·n·(n+1)` XP.
- **Celebraciones**: confeti y aviso al subir de nivel, cumplir el objetivo, hacer una tanda de test de
  80 % o más y completar las parejas. Se apagan solas con «reducir movimiento» del sistema.
- **Siguiente paso.** La portada abre con una misión: quien llega por primera vez va a la primera
  parada de la ruta; quien vuelve, a lo que le falta del objetivo de hoy; con todo hecho, a la ruta o a
  un repaso. Cada meta del objetivo es un botón que lleva a la pantalla exacta (`data-foco`) y la
  resalta. La ruta marca lo visitado y lo siguiente.

- **Repetir y que te corrija** (`repetirHTML(texto)`): un botón de micrófono que escucha, compara con
  lo esperado y explica el fallo con la misma lógica que la sección Hablar. Está en los tests con
  audio (tras responder, «Ahora dilo tú»), en cada frase y en la tarjeta girada. Para añadirlo en otro
  sitio basta con pintar `repetirHTML(lo_que_hay_que_decir)`: el clic se atiende solo. Da experiencia
  una vez por cada cosa bien dicha, para que repetir la misma palabra no sea una granja de puntos.
- **Claro, oscuro o automático.** Las dos paletas ya existían; ahora hay un selector en la barra
  lateral que se guarda en `S.tema`. Un pequeño script en la cabecera (lo inyecta `build.js`) lo
  aplica antes de pintar, para que quien eligió oscuro no vea un fogonazo blanco al abrir.

### Cómo se lee: de las piezas a la palabra

Sección `lectura`, en los siete cursos, cada uno con su propia idea de «pieza»: consonante, vocal,
final y tono en tailandés; sílabas de un tiempo, ん, っ y vocales largas en japonés; letras apiladas
en bloques con su batchim en coreano; inicial, final y tono del pinyin en chino; letras, sílabas y
acento en ruso; qué hace cada letra según sus vecinas en inglés (ahí las piezas no suenan solas,
porque una letra inglesa suelta no se puede pronunciar, y el sonido se aprende con la palabra entera
y parejas como cap/cape); y sílabas con sus trampas en italiano. Cada curso nombra sus piezas en
`LECTURA.papeles`. Enseña lo
que va antes de leer: cómo suena cada pieza sola y cómo se juntan. Arriba, las cuatro piezas
(consonante, vocal, final, tono) con ejemplos que se oyen; debajo, palabra a palabra, de la más
fácil a la más enredada. En cada palabra: oírla entera o muy lenta, **pieza a pieza** (suena cada
pieza iluminándose, luego las sílabas, luego la palabra), tocar una pieza para oírla sola y leer qué
hace, comparar con la palabra que cambia por una marca, y decirla tú.

En los datos, `suena` es lo que se le pide a la voz para esa pieza: consonantes con la อ detrás
(กอ, ขอ), vocales apoyadas en อ, finales como rima (อิน), y `null` para las marcas de tono, que no
suenan solas. `orden` indica el orden en que se *dicen* las piezas cuando no coincide con el escrito
(vocales que van delante) y `silabas` qué piezas forman cada sílaba. Para otro idioma basta con
declarar su `LECTURA` y añadir `"lectura"` a sus `secciones`.

En la ficha de cada letra, el paquete puede declarar `suenaInicio`, `suenaFinal` y `ejemploLetra`
para que se oiga lo que antes solo se leía, y `nombreLetra` cuando la segunda columna de `CONS` no es
algo pronunciable (en ruso, japonés y chino es la romanización, y la voz la leía tal cual). Y el test «¿de qué tipo es?» lleva una chuleta de las
clases que se abre si hace falta.

### Ejercicios

Sección `ejercicios`, en los siete cursos. **Completa la frase**: las frases no están escritas a mano,
las arma el constructor del propio curso (`BUILD.arma` con `SUBJ`, `BVERBS` y sus complementos), así que
siempre son correctas y no se acaban; se tapa el verbo, o el complemento si el verbo no aparece como
palabra entera. Al contestar, el hueco se rellena con la respuesta y se puede oír la frase y decirla.
**Una palabra, varios sonidos**: los grupos de `PAIRS`, con su dibujo, para oír cómo cambia la palabra
cuando cambia un solo sonido.

### Dilo y escríbelo

Primer ejercicio de la sección `ejercicios`: se da el significado en español y hay que producirlo, en voz
alta o escrito con el teclado del idioma. La corrección es deliberadamente generosa, porque dar por
malo algo bien dicho desanima más que cualquier otra cosa: se ignoran espacios, puntuación y
mayúsculas; se aceptan las **formas válidas** que devuelve `formasValidas()` (por ejemplo la frase sin
la partícula de cortesía, avisando de que falta); donde la marca no forma parte de la escritura real
(`LANG.marcaOpcional`) se ignora; y cuando solo fallan las marcas se dice eso —«las letras, bien; las
marcas, no»— en vez de un «no» seco. Al dictar números, el reconocedor devuelve cifras, así que
`repetirHTML` acepta otras formas del mismo contenido.

### La portada

Además de la misión y el objetivo del día: **tu semana** (siete círculos, uno por día, marcados con los
días estudiados que apunta `marcaDiaEstudiado()` desde `touchStreak`), **la palabra del día** (elegida
con un hash de la fecha, así que es la misma todo el día y cambia al siguiente, con su dibujo y su
botón de decirla) y **¿cuál es?**, un juego de tres segundos: una palabra y tres dibujos. Las tres
salen de `VOCAB` y de `dibujo()`, así que funcionan en los siete cursos sin escribir contenido nuevo.

### Desplegar

**Usa `node desplegar.js "mensaje del commit"`**, no copies a mano. Este repositorio no aloja solo los
cursos: también `app-ads.txt` y tres políticas de privacidad que **Google Play y AdMob consultan** para
las apps Android. Un `git add -A` descuidado los borra sin decir nada, y las URLs empiezan a dar 404.
Ya ocurrió una vez.

El script toma la huella de esos cinco ficheros antes de copiar, la vuelve a comprobar después, pasa
`verificar.js` y solo entonces prepara el commit — y aún revisa el índice de git antes de cerrarlo. Si
algo no cuadra **aborta sin tocar nada** y dice cómo restaurarlo. Sin mensaje de commit se queda en
copiar y comprobar. El `push` se hace aparte, a propósito.

### Dónde vive el código

Las fuentes se copian a `C:\Users\angel\OneDrive\Documentos\CLAUDE\idiomas-fuentes`. Trabajar sobre
una carpeta temporal es cómodo hasta que se limpia: sin las fuentes solo queda el HTML compilado, que
no se puede volver a construir ni ampliar. Si tocas las fuentes, actualiza esa copia.

### La analítica

Se declara en el bloque `ANALITICA` de `part3.js`, igual que `SUPPORT` y `AUTOR`, y vale para los siete
cursos y el portal a la vez. **Mientras `goatcounter` esté vacío no se carga ningún script ni se hace
ninguna petición a nadie**, y el pie no menciona nada. En cuanto lleva un código, `build.js` y
`gen-portal.js` inyectan la etiqueta en la cabecera y el pie añade la frase que lo explica.

Se eligió [GoatCounter](https://www.goatcounter.com) porque no usa cookies, no sigue a nadie entre
webs y no guarda datos personales: sin eso haría falta un banner de consentimiento, que en una página
de estudio sobra. Da visitas, páginas más vistas, país y de dónde llega la gente. No da "usuarios
únicos" fiables, y está bien que así sea.

El service worker no interfiere: su `fetch` se desentiende de todo lo que no sea de este origen
(salvo las tipografías de Google), así que la petición de la analítica pasa de largo.

Para cambiarlo por otro proveedor basta con sustituir esa etiqueta en los dos generadores. Si algún
día se usa uno con cookies, hay que añadir banner de consentimiento y política de privacidad.

### El botón de apoyo y la autoría

Ambos viven en la cabecera de `part3.js` (`SUPPORT` y `AUTOR`) y se aplican a los cinco cursos y al
portal a la vez. Cambiar el enlace o el nombre en un sitio los cambia en todos.

---

## Antes de cobrar por esto

Ningún curso está revisado por hablantes nativos y el audio es síntesis de voz del navegador.
Para publicarlo como producto de pago, hazlo revisar y sustituye el audio por grabaciones reales.
