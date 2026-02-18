/**
 * Script para generar words.json con imágenes de Unsplash
 *
 * Uso:
 * 1. Obtener API key de Unsplash: https://unsplash.com/developers
 * 2. Crear archivo .env.local con: UNSPLASH_ACCESS_KEY=tu_api_key
 * 3. Ejecutar: npx ts-node scripts/generate-words.ts
 *
 * Nota: El archivo words.json ya viene pre-poblado con URLs estáticas de Unsplash,
 * así que este script solo es necesario si quieres regenerar con nuevas imágenes.
 */

import * as fs from 'fs';
import * as path from 'path';

// Palabras organizadas por nivel de dificultad
const wordsByLevel = {
  nivel1: [
    'sol', 'luna', 'casa', 'gato', 'perro', 'mesa', 'silla', 'agua',
    'pan', 'flor', 'pez', 'oso', 'mar', 'nube', 'cama'
  ],
  nivel2: [
    'pelota', 'arbol', 'helado', 'pajaro', 'caballo', 'naranja', 'manzana',
    'zapato', 'estrella', 'banana', 'conejo', 'limon', 'avion', 'tortuga',
    'ventana', 'puerta', 'camion', 'globo'
  ],
  nivel3: [
    'bicicleta', 'computadora', 'mariposa', 'elefante', 'dinosaurio', 'girasol',
    'cocodrilo', 'chocolate', 'telefono', 'helicoptero', 'paraguas', 'zanahoria',
    'sandia', 'frutilla', 'guitarra', 'canguro', 'hamburguesa'
  ]
};

// Mapeo de palabras en español a términos de búsqueda en inglés para Unsplash
const searchTerms: Record<string, string> = {
  sol: 'sun sky',
  luna: 'moon night',
  casa: 'house home',
  gato: 'cat',
  perro: 'dog',
  mesa: 'table wood',
  silla: 'chair',
  agua: 'water glass',
  pan: 'bread',
  flor: 'flower',
  pez: 'fish',
  oso: 'bear',
  mar: 'ocean sea',
  nube: 'cloud sky',
  cama: 'bed bedroom',
  pelota: 'ball soccer',
  arbol: 'tree',
  helado: 'ice cream',
  pajaro: 'bird',
  caballo: 'horse',
  naranja: 'orange fruit',
  manzana: 'apple red',
  zapato: 'shoe',
  estrella: 'star night',
  banana: 'banana',
  conejo: 'rabbit bunny',
  limon: 'lemon',
  avion: 'airplane plane',
  tortuga: 'turtle',
  ventana: 'window',
  puerta: 'door',
  camion: 'truck',
  globo: 'balloon',
  bicicleta: 'bicycle bike',
  computadora: 'computer laptop',
  mariposa: 'butterfly',
  elefante: 'elephant',
  dinosaurio: 'dinosaur',
  girasol: 'sunflower',
  cocodrilo: 'crocodile',
  chocolate: 'chocolate',
  telefono: 'phone mobile',
  helicoptero: 'helicopter',
  paraguas: 'umbrella',
  zanahoria: 'carrot',
  sandia: 'watermelon',
  frutilla: 'strawberry',
  guitarra: 'guitar',
  canguro: 'kangaroo',
  hamburguesa: 'hamburger burger'
};

interface UnsplashPhoto {
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
}

interface UnsplashResponse {
  results: UnsplashPhoto[];
}

async function fetchImageUrl(word: string, accessKey: string): Promise<string> {
  const searchTerm = searchTerms[word] || word;
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=1&orientation=squarish`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching image for ${word}: ${response.statusText}`);
  }

  const data: UnsplashResponse = await response.json();

  if (data.results.length === 0) {
    console.warn(`No image found for: ${word}`);
    return `https://via.placeholder.com/500x500?text=${encodeURIComponent(word)}`;
  }

  // Return optimized URL with size parameters
  return `${data.results[0].urls.raw}&w=500&h=500&fit=crop`;
}

async function generateWordsJson() {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    console.error('Error: UNSPLASH_ACCESS_KEY no está configurada.');
    console.log('Crea un archivo .env.local con tu API key de Unsplash.');
    console.log('Puedes obtener una en: https://unsplash.com/developers');
    process.exit(1);
  }

  const wordsData: Record<string, Array<{ word: string; imageUrl: string; difficulty: number }>> = {
    nivel1: [],
    nivel2: [],
    nivel3: []
  };

  for (const [level, words] of Object.entries(wordsByLevel)) {
    const difficulty = level === 'nivel1' ? 1 : level === 'nivel2' ? 2 : 3;

    console.log(`\nProcesando ${level}...`);

    for (const word of words) {
      try {
        console.log(`  Buscando imagen para: ${word}`);
        const imageUrl = await fetchImageUrl(word, accessKey);
        wordsData[level].push({ word, imageUrl, difficulty });

        // Rate limiting: esperar 100ms entre requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`  Error con ${word}:`, error);
        wordsData[level].push({
          word,
          imageUrl: `https://via.placeholder.com/500x500?text=${encodeURIComponent(word)}`,
          difficulty
        });
      }
    }
  }

  const outputPath = path.join(__dirname, '../src/data/words.json');
  fs.writeFileSync(outputPath, JSON.stringify(wordsData, null, 2));
  console.log(`\n✓ Archivo generado: ${outputPath}`);
}

generateWordsJson();
