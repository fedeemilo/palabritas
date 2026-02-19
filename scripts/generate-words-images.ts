import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import wordsData from '../src/data/words.json';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const OUTPUT_DIR = path.join(process.cwd(), 'public/images/palabras');

// Helper to create a safe filename from the word
function toFilename(word: string): string {
    return word
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Simple translations for single words - just the object itself
const translations: Record<string, string> = {
    // Nivel 1
    "sol": "a bright yellow sun",
    "luna": "a crescent moon in the night sky",
    "casa": "a simple cozy house",
    "gato": "a cute cat",
    "perro": "a friendly dog",
    "pato": "a yellow duck",
    "silla": "a wooden chair",
    "agua": "a glass of water",
    "pan": "a loaf of bread",
    "flor": "a beautiful flower",
    "pez": "a colorful fish",
    "oso": "a friendly bear",
    "mar": "the ocean with waves",
    "nube": "a fluffy white cloud",
    "cama": "a comfortable bed",
    // Nivel 2
    "pelota": "a colorful ball",
    "arbol": "a green tree",
    "helado": "an ice cream cone",
    "pajaro": "a small bird",
    "caballo": "a horse",
    "naranja": "an orange fruit",
    "manzana": "a red apple",
    "zapato": "a sneaker shoe",
    "estrella": "a shining star",
    "banana": "a yellow banana",
    "conejo": "a cute bunny rabbit",
    "limon": "a yellow lemon",
    "avion": "an airplane flying",
    "tortuga": "a friendly turtle",
    "ventana": "a window with curtains",
    "puerta": "a door",
    "camion": "a truck",
    "globo": "a colorful balloon",
    // Nivel 3
    "bicicleta": "a bicycle",
    "computadora": "a laptop computer",
    "mariposa": "a beautiful butterfly",
    "elefante": "a friendly elephant",
    "dinosaurio": "a cute dinosaur",
    "girasol": "a sunflower",
    "cocodrilo": "a crocodile",
    "chocolate": "a chocolate bar",
    "telefono": "a smartphone",
    "helicoptero": "a helicopter flying",
    "paraguas": "an umbrella",
    "zanahoria": "an orange carrot",
    "sandia": "a watermelon slice",
    "frutilla": "a red strawberry",
    "guitarra": "an acoustic guitar",
    "canguro": "a kangaroo with baby in pouch",
    "hamburguesa": "a delicious hamburger"
};

async function generateImage(word: string): Promise<string | null> {
    const description = translations[word] || word;

    const prompt = `${description}

Style: Simple Studio Ghibli inspired, soft watercolor, minimal details, warm colors, peaceful mood. One clear subject, centered.

Important: Single image only, no collage, no color palette, no borders, no frames, no text.`;

    try {
        console.log(`  Generating: "${word}"...`);

        const response = await openai.images.generate({
            model: 'gpt-image-1.5',
            prompt,
            n: 1,
            size: '1024x1024',
            quality: 'medium',
        });

        // gpt-image-1 returns base64 data
        const imageData = response?.data?.[0]?.b64_json;
        if (!imageData) {
            console.error(`  ❌ No image data returned for "${word}"`);
            console.error(`  Response:`, JSON.stringify(response?.data?.[0], null, 2));
            return null;
        }

        // Save base64 to file
        const buffer = Buffer.from(imageData, 'base64');
        const filename = `${toFilename(word)}.png`;
        const filepath = path.join(OUTPUT_DIR, filename);
        fs.writeFileSync(filepath, buffer);

        console.log(`  ✅ Saved: ${filename}`);
        return filename;
    } catch (error) {
        console.error(`  ❌ Error generating "${word}":`, error);
        return null;
    }
}

async function main() {
    console.log('🎨 Generating images for words (levels 1-3)...\n');

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const levels = ['nivel1', 'nivel2', 'nivel3'] as const;
    const results: Record<string, string> = {};

    for (const level of levels) {
        console.log(`\n📚 ${level.toUpperCase()}:`);
        const words = wordsData[level];

        for (const item of words) {
            const filename = await generateImage(item.word);
            if (filename) {
                results[item.word] = filename;
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // Save mapping file for reference
    const mappingPath = path.join(OUTPUT_DIR, 'mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(results, null, 2));
    console.log(`\n📝 Mapping saved to: ${mappingPath}`);

    console.log(`\n✨ Done! Generated ${Object.keys(results).length} images.`);
}

main().catch(console.error);
