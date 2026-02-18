# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

## [1.0.0] - 2024-02-18

### Agregado

- **Sistema de palabras por niveles**
  - Nivel 1: palabras cortas (3-4 letras) - sol, luna, casa, gato, etc.
  - Nivel 2: palabras medianas (5-7 letras) - pelota, helado, caballo, etc.
  - Nivel 3: palabras largas (8+ letras) - bicicleta, mariposa, computadora, etc.

- **Interfaz educativa minimalista**
  - Fondo blanco puro sin distracciones
  - Ilustraciones claras y coloridas (iconos Flaticon)
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

- **Optimizaciones**
  - Loader durante carga de imágenes
  - Precarga de imagen siguiente
  - Transiciones suaves entre palabras

### Técnico

- Next.js 14+ con App Router
- TypeScript
- Tailwind CSS
- 50 palabras con ilustraciones
- Sin backend, 100% frontend
