# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

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
