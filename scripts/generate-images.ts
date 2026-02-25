import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

const wordsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/words.json'), 'utf-8'));

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

// New sentences for nivel 7 and 8 (to be integrated into words.json later)
const newLevelSentences: Record<string, string[]> = {
    nivel7: [
        "mi mama me lee un cuento",
        "el pajaro canta en el arbol",
        "quiero ir a la playa",
        "mi papa me lleva a la escuela",
        "el perro juega con la pelota",
        "vamos a hacer un castillo de arena",
        "me gusta pintar con muchos colores",
        "mi abuelo me cuenta una historia",
        "el gato juega con un ovillo",
        "quiero un vaso de jugo de naranja",
    ],
    nivel8: [
        "hoy vamos a cocinar una torta de chocolate",
        "mi hermana y yo jugamos en el parque",
        "el perro corre por el jardin muy contento",
        "quiero ir al zoologico a ver los animales",
        "mi mama me prepara la merienda con leche",
        "vamos a plantar una flor en el jardin",
        "el gato duerme en la silla todo el dia",
        "mi papa me enseña a andar en bicicleta",
        "hoy vamos a jugar con mis amigos al futbol",
        "quiero dibujar un arcoiris con todos los colores",
    ],
};

// Translate common Spanish phrases to English for better DALL-E results
const translations: Record<string, string> = {
    // nivel 4
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
    // nivel 5
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
    // nivel 6
    "hoy vamos a pasear al perro": "a family walking their dog in the park",
    "quiero comer pizza con mi familia": "a family eating pizza together",
    "el sol sale temprano": "a beautiful sunrise over a landscape",
    "mi gato duerme en la cama": "a cat sleeping peacefully on a bed",
    "vamos a comprar al supermercado": "a family shopping with a cart at the supermarket",
    "me gusta jugar en el jardin": "a child playing happily in a garden",
    "vamos a ir a esa plaza": "a family planning to visit a plaza",
    "mi perro corre muy rapido": "a dog running fast and happy",
    "quiero tomar leche con galletitas": "milk and cookies on a table",
    "hoy hace un dia muy lindo": "a beautiful sunny day with blue sky",
    // nivel 7
    "mi mama me lee un cuento": "a mother reading a storybook to a child in bed",
    "el pajaro canta en el arbol": "a colorful bird singing on a tree branch",
    "quiero ir a la playa": "a child excited pointing at the beach and ocean",
    "mi papa me lleva a la escuela": "a father walking with a child towards school",
    "el perro juega con la pelota": "a happy dog playing with a ball in a yard",
    "vamos a hacer un castillo de arena": "children building a sandcastle at the beach",
    "me gusta pintar con muchos colores": "a child painting with many colors on a canvas",
    "mi abuelo me cuenta una historia": "a grandfather telling a story to a child on a couch",
    "el gato juega con un ovillo": "a playful cat batting a ball of yarn",
    "quiero un vaso de jugo de naranja": "a glass of fresh orange juice on a table",
    // nivel 8
    "hoy vamos a cocinar una torta de chocolate": "a family baking a chocolate cake in the kitchen",
    "mi hermana y yo jugamos en el parque": "a brother and sister playing together at the park",
    "el perro corre por el jardin muy contento": "a joyful dog running through a sunny garden",
    "quiero ir al zoologico a ver los animales": "a child at the zoo looking at animals excitedly",
    "mi mama me prepara la merienda con leche": "a mother preparing a snack with a glass of milk",
    "vamos a plantar una flor en el jardin": "a child and parent planting a flower in a garden",
    "el gato duerme en la silla todo el dia": "a cat curled up sleeping on a chair all day",
    "mi papa me enseña a andar en bicicleta": "a father teaching a child to ride a bicycle",
    "hoy vamos a jugar con mis amigos al futbol": "kids playing soccer together on a field",
    "quiero dibujar un arcoiris con todos los colores": "a child drawing a rainbow with crayons",
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

    const targetLevels = process.argv[2];
    const results: Record<string, string> = {};

    if (targetLevels === 'new') {
        // Generate only new levels (nivel7, nivel8)
        for (const [level, sentences] of Object.entries(newLevelSentences)) {
            console.log(`\n📚 ${level.toUpperCase()} (nuevo):`);
            for (const sentence of sentences) {
                const filename = await generateImage(sentence);
                if (filename) {
                    results[sentence] = filename;
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    } else {
        // Generate existing levels (nivel4-6) from words.json
        const levels = ['nivel4', 'nivel5', 'nivel6'] as const;
        for (const level of levels) {
            console.log(`\n📚 ${level.toUpperCase()}:`);
            const words = wordsData[level];

            for (const item of words) {
                const filename = await generateImage(item.word);
                if (filename) {
                    results[item.word] = filename;
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    // Save mapping file for reference
    const mappingPath = path.join(OUTPUT_DIR, 'mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(results, null, 2));
    console.log(`\n📝 Mapping saved to: ${mappingPath}`);

    console.log(`\n✨ Done! Generated ${Object.keys(results).length} images.`);
}

main().catch(console.error);
