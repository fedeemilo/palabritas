import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import wordsData from '../src/data/words.json';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const OUTPUT_DIR = path.join(process.cwd(), 'public/images/oraciones');

// Helper to create a safe filename from the sentence
function toFilename(sentence: string): string {
    return sentence
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanumeric with dashes
        .replace(/^-|-$/g, '');          // Trim dashes
}

// Translate common Spanish phrases to English for better DALL-E results
const translations: Record<string, string> = {
    "tengo hambre": "a child feeling hungry, holding their stomach",
    "hace mucho calor": "a hot sunny day, someone wiping sweat",
    "quiero jugar": "a happy child wanting to play with toys",
    "me gusta el helado": "a child happily eating ice cream",
    "estoy cansado": "a tired child yawning",
    "vamos afuera": "a child excited to go outside, near a door",
    "es de noche": "a peaceful night sky with moon and stars",
    "llueve mucho": "heavy rain falling outside a window",
    "tengo sed": "a thirsty child wanting water",
    "hace frio": "a cold winter day, someone shivering",
    "el perro quiere salir": "a dog waiting eagerly at the door",
    "mama cocina la cena": "a mother cooking dinner in the kitchen",
    "vamos al parque": "a family walking towards a park",
    "papa llega del trabajo": "a father arriving home, family greeting him",
    "el gato tiene hambre": "a hungry cat near its food bowl",
    "quiero ver una pelicula": "a child excited with popcorn, ready to watch a movie",
    "es hora de dormir": "a child in pajamas ready for bed",
    "hoy no hay escuela": "a happy child at home on a day off",
    "mi hermano esta jugando": "a boy playing video games",
    "abri la ventana": "an open window with fresh air coming in",
    "hoy vamos a pasear al perro": "a family walking their dog in the park",
    "quiero comer pizza con mi familia": "a family eating pizza together",
    "el sol sale temprano": "a beautiful sunrise over a landscape",
    "mi gato duerme en la cama": "a cat sleeping peacefully on a bed",
    "vamos a comprar al supermercado": "a family shopping with a cart at the supermarket",
    "me gusta jugar en el jardin": "a child playing happily in a garden",
    "vamos a ir a esa plaza": "a family planning to visit a plaza",
    "mi perro corre muy rapido": "a dog running fast and happy",
    "quiero tomar leche con galletitas": "milk and cookies on a table",
    "hoy hace un dia muy lindo": "a beautiful sunny day with blue sky"
};

async function generateImage(sentence: string): Promise<string | null> {
    const sceneDescription = translations[sentence] || sentence;

    const prompt = `A single simple illustration of: ${sceneDescription}

Style: Simple Studio Ghibli inspired, soft watercolor, minimal details, warm colors, peaceful mood. One clear scene, one focal point.

Important: Single image only, no collage, no color palette, no borders, no frames, no text.`;

    try {
        console.log(`  Generating: "${sentence}"...`);

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
            console.error(`  ❌ No image data returned for "${sentence}"`);
            console.error(`  Response:`, JSON.stringify(response?.data?.[0], null, 2));
            return null;
        }

        // Save base64 to file
        const buffer = Buffer.from(imageData, 'base64');
        const filename = `${toFilename(sentence)}.png`;
        const filepath = path.join(OUTPUT_DIR, filename);
        fs.writeFileSync(filepath, buffer);

        console.log(`  ✅ Saved: ${filename}`);
        return filename;
    } catch (error) {
        console.error(`  ❌ Error generating "${sentence}":`, error);
        return null;
    }
}

async function main() {
    console.log('🎨 Generating images for sentences...\n');

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const levels = ['nivel4', 'nivel5', 'nivel6'] as const;
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
