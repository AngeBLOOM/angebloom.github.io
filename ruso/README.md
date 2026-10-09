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
| `menu.js` | El menú (cajón en móvil, grupos plegables en escritorio) y el troceado de cada pantalla. Va entre `vida.js` y `part4.js` |
| `charla.js` | Las conversaciones, la barra de lo que suena y el juego de ordenar. Va entre `menu.js` y `part4.js` |
| `cuerpo.js` | El muñeco de las partes del cuerpo |
| `oido.js` | Sílabas que se encienden, tono en color y la curva recorriéndose |
| `gen-audio.js` | Qué audio hace falta, cuánto hay y generar lo que falte |
| `examen.js` | Un examen por lección, con su estado |
| `data-<idioma>.js` | Todo lo propio del idioma: color, textos, alfabeto, vocabulario, gramática, números |
| `build.js` | Genera `dist-<idioma>/` con su tipografía y sus metadatos |
| `gen-portal.js` | Genera el portal raíz a partir de los paquetes |
| `gen-icons.js` | Genera los iconos PNG sin dependencias |
| `verificar.js` | Comprueba que ningún idioma arrastre escritura de otro |
| `gen-og.js` | La imagen de 1200×630 que se ve al compartir el enlace |
| `avisar.js` | Avisa a los buscadores por IndexNow (después de desplegar) |

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

### De dónde eres

Las frases de presentarse decían **«vengo de España»** a todo el mundo, y en dos cursos llevaban escrito
el nombre del autor («Me llamo Ángel»). Para quien aprende desde Venezuela o México eso no es un detalle:
es enseñarle a decir algo que no es verdad.

Ahora el país y el nombre son huecos: `{pais}`, `{gent}`, `{nombre}` en el texto del idioma, y
`{PAIS}`, `{GENT}`, `{NOMBRE}` en la traducción. Los resuelven `ponHuecos()` y `ponHuecosEs()`. Sin país
elegido el hueco queda en `____`, que enseña el patrón, que es lo que de verdad se aprende.

**Cada paquete declara `PAISES` con la forma exacta que entra en el hueco**, ya con la preposición o el
caso que pida ese idioma. El motor sustituye y no tiene que saber gramática de nadie:

- donde la frase pide genitivo, el país va en genitivo;
- donde lleva artículo contraído, va con él;
- donde «ser de X» se forma con el país («país» + persona), no hace falta nada más;
- donde es un adjetivo irregular, el paquete trae el gentilicio en masculino y femenino, con su lectura.

El gentilicio **de la traducción** sale de `PAIS_GENT_ES`, en el motor. Me equivoqué una vez poniendo el
del idioma que se estudia y la traducción decía «Soy statunitense».

Hay 22 países (los hispanohablantes y Estados Unidos). **Son material nuevo sin contrastar**, y lo más
frágil del curso junto con las palabras del cuerpo.

Dos avisos para quien toque esto:

- `renderPhrase` y `renderRom` se iban de vacío si el idioma no tenía partículas. Eso quería decir que
  en cinco de los siete cursos no sustituían nunca nada. Ya no.
- Todo lo que guarde texto **ya resuelto** hay que tirarlo cuando cambie el país, el nombre o el género:
  el índice de la barra de abajo y los guiones de las conversaciones. Eso lo hace `olvidaFichero()`.
  Cambiar de género sin tirar los guiones ya estaba roto desde antes.

### Las tareas del día cambian

Eran tres fijas para siempre (10 tarjetas, 20 palabras, 1 test). Ahora hay un catálogo de ocho
(`TAREAS`, en `part4.js`) y cada día se eligen tres. `GOALS` dejó de ser una constante: lo rellena
`fijaMetasDeHoy()` a partir de `S.today.tareas`, así que todo lo que ya leía `GOALS` sigue igual.

- **La elección se siembra con la fecha.** No cambia al recargar a media mañana y cambia sola al día
  siguiente.
- **`vale()` por tarea.** No se pide una conversación donde no hay conversaciones, ni hablar en voz
  alta si el navegador no trae micrófono.
- **Siempre entra una ligera** (tarjetas o escuchar). Si las tres salen largas, el día que andas justo
  se rompe la racha y se abandona. Con eso, cada tarea sale aproximadamente cada tres días.

Las tareas nuevas necesitan que alguien las cuente: hay `bump("letras")` al marcar una letra,
`bump("marcar")` al marcar una frase, `bump("decir")` al decir algo bien, `bump("charla")` al terminar
una conversación y `bump("orden")` al ordenar una escena. Si añades una tarea, añade su `bump`.

### El tono mal no es «bien dicho»

En la conversación, `comparaHabla` puede devolver `marca`: los sonidos están bien y el tono o el acento
no. Eso **pasaba de turno**, y estaba mal. Donde el tono distingue una palabra de otra, decirla con el
tono cambiado es decir otra cosa; darlo por bueno contradice lo primero que enseña el curso.

Ahora solo avanza solo con `ok`. Con `marca` se para y se elige: oírlo muy lento, intentarlo otra vez,
o seguir sabiendo que esa queda floja. A partir del tercer intento se dice explícitamente que puede
seguir y repasarla al final, para que nadie se atasque. Las flojas se juntan en `chFlojas` y salen al
terminar, cada una con su micrófono para practicarla.

### La barra no puede cantar la respuesta

La barra de lo que suena enseñaba palabra, lectura **y significado**. En un «¿qué palabra has oído?»
eso es la respuesta servida; en el dictado, directamente lo que hay que escribir.

`tapaChivatos(true)` la deja en «🔊 Escucha…» mientras hay una pregunta sin contestar. Se activa en el
motor de tests, en el dictado, en el memorama y en **la tarjeta de vocabulario sin girar**, y `go()` la
desactiva al cambiar de pantalla para que no se quede tapada por ahí.

La tarjeta se me escapó la primera vez, y es el sitio donde más cantaba: en un sentido la respuesta es
el significado y en el otro es la palabra, y los dos salían en la barra. Si añades un ejercicio donde
haya algo que adivinar **y** algo que suene, acuérdate de taparla.

Cuidado con una trampa en la que caí: el aviso de «no hay voz de este idioma» se saltaba el tapado y
enseñaba el texto igual. Justo en los dispositivos sin voz, que son los que más lo necesitan. El
tapado manda sobre todo lo demás; el aviso se sigue dando porque no delata nada.

### Ver el sonido: `oido.js`

Tres cosas para quien aprende mirando además de escuchando. Ninguna necesita datos nuevos: todo sale
de lo que el paquete ya trae, y donde el idioma no da, no se ofrece.

**El tono de cada sílaba se deduce, no se escribe.** Cada idioma marca los tonos con tildes sobre la
vocal, y **la misma tilde significa cosas distintas en cada uno**: U+0301 es tono alto en uno y segundo
tono en otro. Por eso `mapaDeTonos()` lo saca de los ejemplos de tono del propio paquete (`TONE_DEMO`).
Así no puede quedarse desfasado si el paquete cambia.

**Trocear la palabra** (`silabasDe`) tiene dos caminos:

| camino | cuándo | qué suena |
|---|---|---|
| `signo` | escrituras donde cada signo es sílaba o mora | cada trozo por separado, sincronizado de verdad |
| `rom` | la romanización viene separada por guiones | la palabra entera despacio, marcando al ritmo estimado |

En el camino `rom` **el corte es del paquete y es correcto; lo aproximado es el momento**, no la
división. Conviene no venderlo como más de lo que es: por eso la nota debajo lo dice.

Cobertura real, que no es la misma en todos: tailandés 47 de 155 (el resto son de una sola sílaba y no
hay nada que partir), japonés 98/98, coreano 82/97, chino 45/97, italiano 90/98. **Ruso e inglés, cero**:
ni tienen escritura silábica ni su romanización trae separadores.

**El color del tono** va con la forma, no solo con el color: cada sílaba lleva su curva en pequeño
(`miniTono`). Solo con el color no vale — hay quien no los distingue, y además la forma es justo lo que
hay que aprender a oír.

En chino el pinyin va pegado y no se puede cortar sin inventar. Lo que sí se puede es leer sus tildes en
orden: **si hay exactamente una por signo, cada una es la de su signo y no hay duda**; si falta alguna
(sílabas de tono neutro) no se sabría cuál se queda sin ella, así que no se pinta ninguna. 26 de 45.

**La curva se recorre mientras suena** (`animaContorno`). Antes se dibujaba de un tirón en 0,85 s y se
quedaba quieta, a su aire del audio. Ojo: va con temporizador y **no** con `requestAnimationFrame`, que
se congela cuando la pestaña no está delante y dejaba el punto clavado en la salida.

**Comparar el par.** En la prueba de oído, fallar y que te digan cuál era no enseña; oírlas seguidas sí.
Se engancha por `alAcertar`, **con un tick de espera**: el motor rellena `#qFb` justo después de llamar,
y sin esperar se lleva por delante lo que pongas.

Y un aviso que ya me costó una vez: aquí **no puede aparecer ni un carácter de ningún idioma**. Los
rangos de escritura van por número (`RANGOS_SILABICOS`, `PEGADOS`), no escritos. `verificar.js` lo caza.

### El cuerpo: `cuerpo.js`

Un muñeco en SVG, siempre el mismo, y las palabras las pone el paquete en `CUERPO`
(`[parte, nativo, romanización, etiqueta]`). Tocas un trozo del dibujo y se enciende, suena y sale su
ficha; debajo está la lista entera, que además es lo que lee un lector de pantalla.

**Si un idioma no tiene una parte, ese trozo se dibuja apagado y no se puede tocar.** No es un
descuido: hay idiomas que no separan la mano del brazo, ni el pie de la pierna. Inventar la diferencia
sería enseñar algo falso, así que la lista de cada paquete manda y el dibujo se adapta.

Ojo con una trampa de HTML que ya me comí una vez: el `<g>` lleva **un solo** atributo `class`. Si se
escriben dos (uno fijo y otro calculado), el navegador se queda con el primero y el resto se pierde.

### Los exámenes por lección: `examen.js`

El repaso mezclado pregunta de todo a la vez y no dice si una lección concreta está sabida. Esto sí:
un examen por lección, en una fila, con tres estados y nada más.

| | |
|---|---|
| 🔒 cerrado | aún no has estudiado esa lección |
| ⏳ pendiente | estudiada, y el examen sin aprobar |
| ✓ aprobado | 80 % o más, con la nota |

No fabrica preguntas nuevas: llama a `makeMixed(tipos)` con los tipos de esa lección, para no
preguntar de lo que todavía no has visto. Por eso `makeMixed` acepta ahora una lista; sin argumento
sigue mezclando de todo, como siempre.

**Qué cuenta como «haberla estudiado».** Al principio bastaba con `visitado()`, y así pasar por el menú
una vez desbloqueaba los cinco exámenes. Ahora, donde se puede medir el avance (`P[seccion]`), se pide
además que haya algo hecho: una letra marcada, una tarjeta superada, una frase. Donde no hay medida,
basta con haber entrado.

La fila sale en dos sitios: en **Repaso** se puede tocar y el examen se abre ahí mismo; en el **inicio**
solo informa y lleva al repaso. Un examen que no exista en un idioma no se ofrece: los tonos solo
aparecen donde el paquete trae ejemplos de tono.

Y cuidado con el resumen de la cabecera: cero pendientes puede ser por haberlos aprobado todos o por
no haber abierto ninguno. No es lo mismo y no dice lo mismo (`exResumen()`).

### Los grupos de letras, en color

Los siete cursos reparten sus letras en grupos, y cada uno quiere decir algo distinto: clase de tono,
si son aspiradas, si se parecen al castellano. Antes eso se contaba con un párrafo y se marcaba con
puntos negro, blanco y gris. Exacto e imposible de recordar.

Ahora cada grupo tiene **un color**, `--k1`..`--k4`, y es el mismo en todas partes: en la rejilla de
letras, en la ficha, en la chuleta del test, en las propias opciones del test y en el mapa. El color se
elige por la **posición** del grupo en `CLASSNAME` (`claseN()`), no por su nombre, que cambia en cada
idioma.

`mapaAlfabetoHTML()` pinta el mapa: un panel por grupo, con su color, cuántas letras tiene, una barra
con la proporción y todas sus letras como fichas (letra grande + dibujo + nombre). Dos detalles que
importan:

- **El grupo más numeroso no se memoriza.** Si uno dobla al siguiente y pasa de diez, se marca como
  «todas las demás»: la regla de verdad es que si una letra no está en los otros grupos, está en ese.
  Lo decide `grupoDeDescarte()` solo, sin que el paquete diga nada.
- **Con más de cuatro grupos no se pinta.** Los colores se repetirían y dejarían de significar nada;
  ahí se queda la tabla de siempre. (Pasa donde los grupos son las filas del silabario, que son once.)

Los dibujos de las fichas salen de `dibujo()`, que busca por el significado en castellano del nombre de
la letra. Si falta la palabra en `DIBUJO_PALABRAS`, la ficha sale sin dibujo y no pasa nada.

### El audio grabado

**El problema.** La voz la pone el navegador, y si el dispositivo no tiene voz del idioma no se calla:
lee las letras con la que tenga a mano y sale un ruido que no se parece a nada. Para quien aprende de
oído eso no es un detalle: es que el curso no funciona. Y pasa más de lo que parece — el equipo donde se
desarrolla esto no tiene voz de **ninguno** de los siete idiomas salvo inglés.

**La solución** son ficheros propios: se graban una vez y suenan igual en todos los dispositivos, sin
conexión y sin depender de lo que cada uno tenga instalado. Son unos 1.300 en total: tailandés 276,
japonés 203, ruso 191, chino 170, inglés 172, coreano 164, italiano 163.

**Cómo funciona.** Si el paquete trae audio, `diAlgo()` toca el fichero y ni se acerca a la voz del
navegador; si no, sigue todo como antes. Si el fichero falla o no carga, cae a la voz: nunca se queda
mudo sin avisar. `lecDiSeguido()` hace lo mismo.

```
audio/<idioma>/manifest.json     {"texto exacto": "fichero"}
audio/<idioma>/<ficheros>        mp3, ogg o wav
```

`build.js` mete el manifest **dentro** de la página (son unos kB, así no hace falta otra descarga y
funciona sin conexión desde el primer momento) y copia los ficheros al lado. El service worker los va
guardando según se usan, así que no hay que precargar nada.

**Ojo con dónde se mete el manifest.** Va después del paquete de datos, nunca antes: `verificar.js`
localiza el motor buscando `<script>` seguido del comienzo del paquete, y si se le cuela algo en medio
pierde la marca, revisa el fichero entero y da por fugas las frases del propio curso. Pasó.

**De dónde salen los ficheros.** De quien quieras; lo mejor, un hablante nativo. `gen-audio.js` solo
sabe generarlos con las voces que Windows tenga instaladas, y únicamente del idioma de una voz que esté
puesta. Si no hay voz de ese idioma lo dice y no inventa nada.

```bash
node gen-audio.js                    # informe de los siete
node gen-audio.js tailandes --generar # genera lo que falte, si hay voz
```

Para que haya voz de un idioma: *Configuración → Hora e idioma → Idioma y región → Añadir idioma →
Opciones → Voz*, y reiniciar el navegador.

**Sobre el peso.** En wav a 16 kHz mono un curso ocupa unos 8 MB. Es mucho para algo que se guarda en el
móvil: si los grabas tú, **en mp3**, que baja a menos de la décima parte. Se probó generando el inglés
entero y se retiró: eran 8 MB de la misma voz robótica que el navegador ya trae, para el único idioma
cuya voz está en casi todos los dispositivos. La maquinaria quedó probada de punta a punta.

### Que se oiga: `diAlgo()`

Había un «a veces no se escucha nada» que no era casualidad. Tres causas, las tres reales:

1. En Chrome, `cancel()` y `speak()` en el mismo tick dejan la locución muda. No lanza error: no suena.
2. El motor se queda **en pausa** con la pestaña de fondo, al bloquear el móvil o al cancelar a media
   palabra. A partir de ahí todo lo que pidas se encola y no suena nunca. `resume()` lo despierta.
3. Aun con las dos cosas, alguna se pierde.

Por eso ahora todo el audio pasa por `diAlgo()`: espera 40 ms tras cancelar, llama a `resume()`, y si en
400 ms no ha arrancado lo reintenta una vez desde cero. `lecDiSeguido()` hace lo mismo. Si tocas algo del
motor de voz, respeta las tres: quitar cualquiera de ellas devuelve el fallo.

### La barra de lo que suena

`subtitula()` enseña abajo lo que se acaba de pronunciar —palabra, romanización y significado— con un
botón para repetirlo muy lento. El índice sale de VOCAB, PHRASES, CONS y los números, y cada fuente se
lee protegida: si un paquete cambia de forma se pierde esa fuente, no el índice. Se guarda solo cuando
está entero, que si no una fuente rota lo deja a medias para siempre.

### Las conversaciones: `charla.js`

Una escena, alguien te habla y te toca contestar en voz alta; corrige con el mismo `comparaHabla` que
el resto del curso, y `escuchaRepeticion` avisa del veredicto llamando a `trasRepetir()`.

Lo importante es de dónde sale el texto. **Las frases de los paquetes son todas cosas que dice quien
aprende**: no hay guiones del otro lado. Así que el otro lado solo habla cuando la frase existe y vale
para ambos (saludos, cortesía, preguntas), y el resto del hilo lo lleva la escena, en castellano. Nada
de lo que suena está inventado: todo sale del paquete.

Los guiones (`GUIONES`) se escriben una vez para los siete idiomas y se resuelven contra cada paquete
buscando por el significado en castellano, sin tildes ni signos y por el principio («Hola», «Hola (de
día)», «¡Hola! (informal)» son la misma). Si una frase no existe en un idioma, ese turno se cae y las
escenas vecinas se juntan; si quedan menos de tres cosas que decir, el guion no se ofrece. Hoy los cinco
salen enteros en los siete.

### La traducción no puede estar a la vista

Dos veces ha pasado lo mismo: un ejercicio en el que la traducción al castellano estaba delante y el
idioma que se aprende sobraba. Primero en la barra de lo que suena, luego en el juego de ordenar, donde
cada ficha llevaba su traducción debajo y la escena se montaba **leyendo castellano**, sin mirar el
tailandés ni una vez.

La regla, por si vuelve a aparecer: **si un ejercicio tiene algo que adivinar, la traducción no se
enseña hasta que se responde.** Se puede pedir a propósito —hay un botón— pero no sale sola. En el
juego de ordenar lo lleva , y se vuelve a esconder al cambiar de escena.

Queda un sitio donde la traducción sí se enseña y es discutible: las frases que te dicen a ti en la
conversación. Ahí es apoyo para seguir el hilo, no respuesta a nada, pero si se quiere el mismo rigor
habría que taparla también.

### El juego de ordenar

Empezó siendo «monta la frase», partiendo la frase por espacios. No valía: **en tailandés, japonés y
chino la escritura no separa palabras**, así que en tres de los siete idiomas no había nada que partir.
Ahora se ordenan las frases de una conversación, que funciona igual en todos y entrena algo que ninguna
otra pantalla toca: cómo se encadena un intercambio de verdad.

### Las tareas del día

`GOALS` (en `part4.js`) son las tres de cada día: 10 tarjetas, 20 palabras escuchadas y un test.
`bump()` las cuenta, marca el check y celebra al completarlas; se reinician solas al cambiar de día.

El recuadro grande (`#goalBox`) va **lo primero del inicio**, encima de la portada. Estuvo un tiempo
por debajo de los demás recuadros, a 3.200 px del borde, y allí no lo encontraba nadie: es lo que se
mira a diario, así que va arriba.

Además `pintaHoy()` deja una copia pequeña en dos sitios que se ven desde cualquier pantalla: la barra
lateral (y por tanto el cajón del móvil) y la barra de arriba, con tres puntos que se ponen verdes.
Las dos llevan `data-go="inicio" data-foco="#goalBox"`, el mismo camino que usan las propias tareas.

Ojo con el nombre: `.hoy` **ya existía** para los avisos del horario y apila en columna. Lo de aquí se
llama `.tareas`.

### El menú y el largo de cada pantalla: `menu.js`

Con diecisiete secciones, la lista entera no cabe en ninguna pantalla. Tres cosas lo arreglan, y las
tres viven en `menu.js`.

**El cajón.** Por debajo de 860 px la barra lateral deja de ser una fila que se iba a lo ancho y pasa
a ser un cajón que entra desde la izquierda. Arriba queda una barra con el botón, dónde estás y el
nivel. Se cierra al elegir sección, al tocar fuera y con Escape; mientras está abierta, el fondo no se
desplaza. El HTML del cajón es el mismo `#rail` de siempre: solo cambia dónde se coloca.

**Los grupos.** «Empezar», «Fundamentos» y «Práctica» se pliegan. Se abre el de la sección en la que
estás —aunque lo hubieras cerrado— y lo que abras a mano se recuerda en `S.navAb`.

**Los bloques.** Cada `h2.sec` de una vista y todo lo que lleva detrás se envuelven en un bloque que
se abre y se cierra, con un índice de pastillas encima para saltar. Las vistas no saben nada de esto:
se hace sobre el HTML ya pintado, después de `init()`, porque varias rellenan sus listas ahí y hay que
medirlas para decidir qué se recoge. La regla: se pliega si hay tres bloques o más, o si entre todos
pasan de dos pantallas; y el primero se deja abierto solo si él solo cabe en dos pantallas. Por eso el
vocabulario pasó de catorce pantallas a menos de dos, y la gramática abre como un índice.

Dos detalles que hay que respetar al tocar esto:

- Lo que esté dentro de un bloque recogido **no se anima** (`animaVista` se salta lo que no se ve). Si
  no, al abrirlo aparecería en blanco esperando su turno en la cascada.
- Cualquier sitio que lleve el foco a un trozo de pantalla llama antes a `abreBloquesDe(elemento)`: si
  no, el desplazamiento apunta a algo escondido. Lo hacen la misión del inicio, «Trazarla a mano», el
  horario y las tarjetas de «Cómo se lee».

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

### Ejercicios: uno cada vez, y de boca

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

### El cuaderno de ejercicios (lo que se vende)

`node bajar-fuentes.js` (una vez, con internet) baja la letra tailandesa con bucles; sin ella, al
generar el PDF sin ventana Chrome la sustituye por una sin bucles, que es justo lo contrario de lo que
el cuaderno enseña a trazar. Japonés, coreano y chino usan las de Windows (Yu Gothic, Malgun, YaHei),
nombradas a propósito en `RESPALDOS`: la pila de la web empieza por las de Google y sin internet el
texto no se dibujaba.

`node gen-cuadernillo.js [idiomas…]` saca un HTML imprimible por idioma en
`C:\Users\angel\OneDrive\Documentos\CLAUDE\cuadernillos`. **No va al repositorio**: es el producto.
`node gen-pdf.js` los convierte en PDF con el Chrome instalado, sin abrir ventana. (A mano también:
Ctrl+P → Guardar como PDF.) Cómo se venden y se envían: `COMO-ENVIAR.txt`, en esa misma carpeta.

Todo el contenido sale de los paquetes, igual que la web, así que no hay texto escrito a mano que pueda
colarse en otro idioma. Si existe `cuadernillos/imagenes/<idioma>-portada.jpg` (o .png/.webp), se usa
en la portada; si no, va el glifo del curso.

La tarjeta de compra de la web se configura en el bloque `COMPRA` de `part3.js`: para cambiar el precio
hay que tocar `precio` **y** el número del enlace de PayPal. `activo:false` la esconde en los siete
cursos. La entrega es a mano: PayPal avisa del pago con el correo de quien compra.

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

## Que la encuentren

La página está lista para que la encuentren —`robots.txt`, `sitemap.xml` con las ocho direcciones,
título y descripción por curso, datos estructurados— pero eso no basta: **los buscadores descubren
páginas porque otras páginas enlazan a ellas**, y a esta no enlaza nadie todavía.

### Al compartir el enlace

`gen-og.js` hace una imagen de **1200×630** por curso, más una del portal con las siete escrituras.
Antes se usaba el icono de la app, que es cuadrado: al pegar el enlace salía un sello diminuto al lado
del texto. Con la medida correcta sale la tarjeta grande.

Se dibuja con el mismo Chrome sin ventana que hace los cuadernos, con HTML. Así la escritura de cada
idioma sale con su tipografía y no hay que pintar letras a mano.

**Hay que ejecutarlo después de construir**, en este orden:

```bash
for L in tailandes japones coreano chino ruso ingles italiano; do node build.js $L <URL>; done
node gen-og.js            # las imágenes de compartir
node gen-portal.js <URL> tailandes japones coreano chino ruso ingles italiano
node verificar.js
node desplegar.js "mensaje"
```

### Avisar a los buscadores

`avisar.js` usa **IndexNow**, que es lo único que no pide abrir cuenta en nadie. Lo comparten Bing,
Yandex, Seznam y Naver; DuckDuckGo y Ecosia beben de Bing.

Se ejecuta **después de desplegar**, nunca antes: comprueba que el fichero de la clave esté colgado y
que las ocho direcciones respondan 200, y solo entonces avisa. Avisar de una página que no responde es
peor que no avisar.

La clave vive en `gen-portal.js` y se cuelga sola en la raíz del sitio. No es un secreto: solo
demuestra que quien avisa manda en el sitio.

### Google va por su cuenta

Google **no** usa IndexNow. Para Google hace falta **Search Console**, y eso pide la cuenta de Google
del dueño del sitio: no es algo que se pueda automatizar desde aquí. Los pasos son dar de alta
`https://angebloom.github.io/` como «prefijo de URL», verificar con la etiqueta HTML que dé (se pega en
la cabecera de `gen-portal.js` y se despliega) y enviar `sitemap.xml`.

Y una expectativa honesta: aunque la indexe, competir por «aprender tailandés» contra Duolingo no va a
pasar. Donde hay sitio es en las búsquedas largas y concretas, y sobre todo en el enlace pasado a mano.

## Antes de cobrar por esto

Ningún curso está revisado por hablantes nativos y el audio es síntesis de voz del navegador.
Para publicarlo como producto de pago, hazlo revisar y sustituye el audio por grabaciones reales.
