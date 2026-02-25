# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

## [2.0.0] - 2026-02-25

### Agregado

- **Pantalla de inicio (Home)**
  - Nuevo home minimalista con selector de juegos
  - Tarjetas grandes con emoji, nombre y descripción por cada juego
  - Diseño responsive (1 columna en móvil, 2 en desktop)
- **Juego de Matemáticas** (`/matematicas`)
  - Sumas y restas para niños de 4–6 años
  - Ejercicios aleatorios con 3 opciones de respuesta
  - Visualización con puntos de colores (conteo visual)
  - Animación secuencial de puntos al generar ejercicio (pop-in uno a uno)
  - Animación de merge al acertar: suma une puntos en verde, resta elimina puntos y muestra resultado en verde
  - Feedback visual: botón verde al acertar, shake rojo al errar
  - Delay de 700ms antes del "Muy bien!" para ver el resultado
  - 3 niveles: sumas hasta 5, sumas hasta 10, restas simples
  - Progreso persistente en localStorage
  - Desbloqueo secuencial de niveles
  - Auto-avance al siguiente nivel tras 3 segundos
  - Selector de nivel con barra de progreso ámbar
  - Botón Home para volver al inicio
  - Reutiliza sonidos, animaciones de éxito y modal de nivel completo

### Cambiado

- **Reestructuración de rutas**
  - Home (`/`) ahora es el selector de juegos
  - Palabritas movido a `/palabritas`
  - Metadata del layout actualizada a "Juegos Educativos"
- **Palabritas: botón Home**
  - Integrado en el selector de niveles (esquina superior izquierda)
  - Ícono Home de Lucide React, mismo estilo que el dropdown

### Técnico

- Nueva estructura: `src/components/matematicas/` para componentes del juego de matemáticas
- Nuevo archivo de datos: `src/data/mathLevels.ts` (config de niveles + generador de ejercicios)
- Nuevo hook: `useMathProgress` para progreso independiente de matemáticas
- Nuevas animaciones CSS: `dot-pop` para puntos del juego de matemáticas
- Arquitectura modular: agregar niveles es solo sumar un objeto al array `MATH_LEVELS`

---

## [1.4.2] - 2026-02-19

### Mejorado

- **Layout adaptativo para teclado móvil**
  - Detecta cuando el teclado virtual está abierto
  - Reduce la imagen y ajusta espacios para que el contenido sea visible
  - Nuevo hook `useKeyboardVisible` usando Visual Viewport API

---

## [1.4.1] - 2026-02-19

### Mejorado

- **Botones de navegación rediseñados**
  - Botones circulares con iconos Lucide (ChevronLeft/ChevronRight)
  - Colores suaves que combinan con el fondo
  - Sin texto, más minimalistas
- **Modo Zen mejorado**
  - Oculta el contador de caracteres/letras debajo del input

---

## [1.4.0] - 2026-02-19

### Agregado

- **Nivel Bonus - Personajes**
  - Nuevo nivel especial con personajes de películas animadas
  - 5 frases representativas: "hakuna matata", "yo soy el rey leon", etc.
  - Imágenes estilo Ghibli generadas con IA para cada personaje
  - Se desbloquea al completar el Nivel 6

### Técnico

- Nuevo script: `generate-personajes-images` para generar imágenes de personajes
- Soporte para argumento individual: `npm run generate-personajes-images -- simba`
- Carpeta de imágenes: `/public/images/personajes/`

---

## [1.3.0] - 2025-02-19

### Agregado

- **Imágenes generadas con IA**
  - 80 imágenes estilo Ghibli generadas con GPT-Image
  - Imágenes para todas las palabras (niveles 1-3)
  - Imágenes para todas las oraciones (niveles 4-6)
  - Transición suave con fade-in al cargar imágenes
  - Scripts de generación: `generate-images.ts` y `generate-words-images.ts`
- **Hint de barra espaciadora**
  - Aparece después de 3 errores cuando el próximo carácter es un espacio
  - Ayuda visual para niños que no saben usar la barra espaciadora
- **Iconos Lucide React**
  - Reemplazados emojis de UI por iconos vectoriales
  - Check, Star, Trophy, Crown, Volume, etc.
  - Aspecto más limpio y profesional

### Cambiado

- **Oraciones mejoradas (niveles 4-6)**
  - Frases más naturales y útiles para el día a día
  - "tengo hambre", "vamos al parque", "es hora de dormir", etc.
  - Mejor representación visual con imágenes generadas
- **Fondo de la app**
  - Variable CSS `--background` para cambiar color en un solo lugar
  - Tono más suave, menos cansador para la vista

### Técnico

- Nueva dependencia: `lucide-react`
- Nueva dependencia: `openai` (dev)
- Scripts npm: `generate-images`, `generate-words-images`

---

## [1.2.0] - 2025-02-18

### Agregado

- **3 nuevos niveles de oraciones**
  - Nivel 4: Oraciones muy cortas (10 oraciones) - "el sol brilla", "yo como pan", etc.
  - Nivel 5: Oraciones cortas (10 oraciones) - "el pajaro vuela alto", "yo como una manzana", etc.
  - Nivel 6: Oraciones más largas (10 oraciones) - "el elefante tiene trompa larga", etc.
  - Total: 30 oraciones nuevas con emojis representativos

### Cambiado

- **UI adaptativa para oraciones**
  - Tamaño de fuente dinámico según longitud del texto
  - Input más ancho para oraciones
  - Emojis más pequeños cuando hay múltiples
  - Contador muestra "caracteres" en oraciones, "letras" en palabras
- **Selector de nivel mejorado**
  - Etiquetas "Palabras" vs "Oraciones" para diferenciar tipos de nivel

---

## [1.1.0] - 2025-02-18

### Agregado

- **Sistema de sonidos**
  - Sonidos generados con Web Audio API (sin dependencias externas)
  - Tono al escribir letra correcta
  - Tono de error al equivocarse
  - Melodía de celebración al completar palabra
  - Fanfarria al completar nivel
  - Botón toggle para activar/desactivar sonidos
  - Preferencia guardada en localStorage
- **Modal de nivel completado**
  - Pantalla de celebración al terminar un nivel
  - Trofeo animado (corona en último nivel)
  - Estrellas con animación
  - Botón para continuar al siguiente nivel
- **Auto-avance**
  - Avanza automáticamente a la siguiente palabra tras completar una

### Cambiado

- **Emojis en lugar de imágenes externas**
  - Reemplazadas URLs de Flaticon por emojis nativos
  - Más confiable, sin dependencias externas
  - Carga instantánea
- **Palabra "mesa" reemplazada por "pato"**
  - No existe emoji claro de mesa
  - "pato" tiene emoji representativo (🦆)

### Técnico

- Nuevo hook `useSound` para manejo de audio
- Componente `SoundToggle` para control de sonido
- Componente `LevelCompleteModal` para celebración de nivel
- Componente `EmojiDisplay` reemplaza a `ImageDisplay`
- Animación `float` para elementos flotantes

---

## [1.0.0] - 2025-02-18

### Agregado

- **Sistema de palabras por niveles**
  - Nivel 1: palabras cortas (3-4 letras) - sol, luna, casa, gato, etc.
  - Nivel 2: palabras medianas (5-7 letras) - pelota, helado, caballo, etc.
  - Nivel 3: palabras largas (8+ letras) - bicicleta, mariposa, computadora, etc.
- **Interfaz educativa minimalista**
  - Fondo blanco puro sin distracciones
  - Tipografía Inter ultra legible
  - Palabras en MAYÚSCULAS (como aparecen en el teclado)
- **Sistema de entrada interactivo**
  - Validación letra por letra en tiempo real
  - Feedback visual de error (shake + letra roja)
  - Contador de letras escritas
  - Soporte para escritura sin acentos (arbol = árbol)
- **Gamificación**
  - Progreso guardado en localStorage
  - Badge de completado en palabras resueltas
  - Barra de progreso por nivel
  - Niveles bloqueados hasta completar el anterior
  - Animación de éxito con checkmark y estrellas
- **Navegación**
  - Botones Anterior/Siguiente
  - Selector de nivel con indicador de progreso
  - Botón de reinicio con confirmación

### Técnico

- Next.js 14+ con App Router
- TypeScript
- Tailwind CSS
- 50 palabras con emojis
- Sin backend, 100% frontend

