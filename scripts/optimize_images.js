const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../assets/images');
const outputDir = inputDir; // Save in same directory

if (!fs.existsSync(inputDir)) {
    console.error(`Directory not found: ${inputDir}`);
    process.exit(1);
}

const files = fs.readdirSync(inputDir).filter(file => /\.(jpg|jpeg|png)$/i.test(file));

console.log(`Found ${files.length} images to process.`);

async function processImages() {
    for (const file of files) {
        const inputPath = path.join(inputDir, file);
        const name = path.parse(file).name;

        // Output filenames
        const desktopOutput = path.join(outputDir, `${name}.webp`);
        const mobileOutput = path.join(outputDir, `${name}-mobile.webp`);

        try {
            // 1. Desktop Optimization (Max 1920px wide, 80% quality WebP)
            if (!fs.existsSync(desktopOutput)) {
                await sharp(inputPath)
                    .resize({ width: 1920, withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toFile(desktopOutput);
                console.log(`Processed Desktop: ${file} -> ${name}.webp`);
            } else {
                console.log(`Skipped Desktop (Exists): ${name}.webp`);
            }

            // 2. Mobile Optimization (Max 800px wide, 80% quality WebP)
            if (!fs.existsSync(mobileOutput)) {
                await sharp(inputPath)
                    .resize({ width: 800, withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toFile(mobileOutput);
                console.log(`Processed Mobile: ${file} -> ${name}-mobile.webp`);
            } else {
                console.log(`Skipped Mobile (Exists): ${name}-mobile.webp`);
            }

        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    }
}

processImages();
