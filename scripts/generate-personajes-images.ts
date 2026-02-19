import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import wordsData from '../src/data/words.json';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const OUTPUT_DIR = path.join(process.cwd(), 'public/images/personajes');

// Helper to create a safe filename
function toFilename(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Descripciones genéricas de animales en estilo Ghibli (evitando copyright)
const characterDescriptions: Record<string, string> = {
    // León cachorro
    "simba": "a cute baby lion with golden fur, big round eyes, playful pose, warm sunny day, soft watercolor style",
    // León adulto majestuoso
    "mufasa": "a noble adult lion with flowing golden mane standing on a rocky outcrop, African savanna at golden hour, dignified pose",
    // Panda rojo gigante
    "mei": "a fluffy giant red panda with expressive eyes, sitting in an urban park, cheerful and friendly expression",
    // Mamut lanudo
    "manny": "a gentle woolly mammoth with long curved tusks walking through a snowy prehistoric landscape, kind eyes",
    // Ardilla prehistórica con bellota
    "scrat": "a funny prehistoric squirrel holding an acorn tightly, exaggerated panicked expression, snowy background",
};

async function generateImage(name: string): Promise<string | null> {
    const description = characterDescriptions[name];

    if (!description) {
        console.error(`  ⚠️ No description found for "${name}"`);
        return null;
    }

    const prompt = `A single illustration of: ${description}

Style: Studio Ghibli inspired, soft watercolor, warm colors, expressive character, peaceful and whimsical mood. Detailed but gentle linework.

Important: Single character portrait, no collage, no borders, no frames, no text, no logos.`;

    try {
        console.log(`  Generating: "${name}"...`);
        console.log(`  Description: ${description}`);

        const response = await openai.images.generate({
            model: 'gpt-image-1.5',
            prompt,
            n: 1,
            size: '1024x1024',
            quality: 'medium',
        });

        const imageData = response?.data?.[0]?.b64_json;
        if (!imageData) {
            console.error(`  ❌ No image data returned for "${name}"`);
            console.error(`  Response:`, JSON.stringify(response?.data?.[0], null, 2));
            return null;
        }

        const buffer = Buffer.from(imageData, 'base64');
        const filename = `${toFilename(name)}.png`;
        const filepath = path.join(OUTPUT_DIR, filename);
        fs.writeFileSync(filepath, buffer);

        console.log(`  ✅ Saved: ${filename}`);
        return filename;
    } catch (error) {
        console.error(`  ❌ Error generating "${name}":`, error);
        return null;
    }
}

async function main() {
    // Check for specific character argument
    const targetCharacter = process.argv[2];

    if (targetCharacter) {
        console.log(`🎬 Generating image for: ${targetCharacter}\n`);

        if (!characterDescriptions[targetCharacter]) {
            console.error(`❌ Unknown character: "${targetCharacter}"`);
            console.log(`Available: ${Object.keys(characterDescriptions).join(', ')}`);
            return;
        }

        // Ensure output directory exists
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        await generateImage(targetCharacter);
        console.log('\n✨ Done!');
        return;
    }

    // Generate all if no argument
    console.log('🎬 Generating ALL character images for nivel7...\n');

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const words = (wordsData as Record<string, Array<{ word: string }>>)['nivel7'];

    if (!words) {
        console.error('❌ nivel7 not found in words.json');
        return;
    }

    const results: Record<string, string> = {};

    for (const item of words) {
        const filename = await generateImage(item.word);
        if (filename) {
            results[item.word] = filename;
        }

        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Save mapping file
    const mappingPath = path.join(OUTPUT_DIR, 'mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(results, null, 2));
    console.log(`\n📝 Mapping saved to: ${mappingPath}`);

    console.log(`\n✨ Done! Generated ${Object.keys(results).length} character images.`);
}

main().catch(console.error);
