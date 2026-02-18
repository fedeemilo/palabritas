# Palabritas

Aplicación web educativa diseñada para ayudar a niños a aprender a escribir palabras en español.

## Objetivo

Palabritas fue creada pensando en niños que están aprendiendo a leer y escribir, con especial atención a necesidades de accesibilidad. La aplicación presenta:

- **Una palabra a la vez** - Sin distracciones, foco total en la tarea
- **Ilustraciones claras** - Imágenes simples que representan cada palabra
- **Feedback inmediato** - El niño sabe al instante si escribió correctamente
- **Sin presión de tiempo** - Cada niño avanza a su propio ritmo
- **Progresión gradual** - De palabras cortas a palabras más complejas

## Características

### Niveles de dificultad

| Nivel | Longitud | Ejemplos |
|-------|----------|----------|
| 1 | 3-4 letras | SOL, LUNA, GATO, CASA |
| 2 | 5-7 letras | PELOTA, HELADO, CABALLO |
| 3 | 8+ letras | BICICLETA, MARIPOSA, COMPUTADORA |

### Diseño accesible

- Fondo blanco puro
- Tipografía clara y grande (Inter)
- Palabras en MAYÚSCULAS
- Alto contraste
- Sin música ni sonidos intrusivos
- Animaciones sutiles y no abrumadoras

### Gamificación sutil

- Progreso guardado automáticamente
- Insignia de completado por palabra
- Barra de progreso por nivel
- Niveles que se desbloquean progresivamente
- Opción de reiniciar para nuevos usuarios

## Tecnologías

- [Next.js 14+](https://nextjs.org/) - Framework React
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático
- [Tailwind CSS](https://tailwindcss.com/) - Estilos
- [Flaticon](https://www.flaticon.com/) - Ilustraciones

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/fedeemilo/palabritas.git
cd palabritas

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Iniciar build de producción
npm run lint     # Ejecutar ESLint
```

## Estructura del proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── page.tsx           # Página principal
│   ├── layout.tsx         # Layout con fuentes
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── Game.tsx          # Componente principal del juego
│   ├── ImageDisplay.tsx  # Muestra la ilustración
│   ├── WordDisplay.tsx   # Muestra la palabra objetivo
│   ├── UserInput.tsx     # Input con validación
│   ├── SuccessAnimation.tsx
│   ├── ProgressIndicator.tsx
│   ├── LevelSelector.tsx
│   └── ResetButton.tsx
├── data/
│   └── words.json        # 50 palabras con URLs de imágenes
├── hooks/
│   └── useGameProgress.ts # Hook de progreso y gamificación
├── types/
│   └── index.ts          # Tipos TypeScript
└── utils/
    └── normalize.ts      # Normalización de texto (acentos)
```

## Personalización

### Agregar palabras

Editar `src/data/words.json`:

```json
{
  "nivel1": [
    {
      "word": "nueva",
      "imageUrl": "https://url-de-la-imagen.png",
      "difficulty": 1
    }
  ]
}
```

### Cambiar ilustraciones

Las imágenes actuales provienen de Flaticon. Para cambiarlas, actualizar las URLs en `words.json` y agregar el dominio en `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'tu-dominio.com',
    },
  ],
},
```

## Deploy

La aplicación está optimizada para deploy en [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fedeemilo/palabritas)

## Licencia

MIT

## Autor

**Federico Milone**

- Web: [fedmilo.com](https://fedmilo.com)
- GitHub: [@fedeemilo](https://github.com/fedeemilo)

---

Hecho con amor para ayudar a los mas pequenos a aprender.
