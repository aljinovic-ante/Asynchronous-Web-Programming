const fs = require('fs').promises;
const sharp = require('sharp');
const path = require('path');
const fsSync = require('fs');

const IMAGES_DIR = path.join(__dirname, '..', 'slike');
const SIZES = [
  { width: 150, height: 150 },
  { width: 100, height: 100 },
  { width: 50, height: 50 }
];

function getNewFileName(originalName, width, height) {
  const [name, ext] = originalName.split('.');
  return `${name}-${width}x${height}.${ext}`;
}

// async function processImage(imagePath, targetSize) {
//   try {
//     const imageName = path.basename(imagePath);
//     const originalImage = sharp(imagePath); // note: returns a Sharp instance that represents the loaded image
//     const legendData = [];

//     const sizesToProcess = targetSize ? [targetSize] : SIZES;

//     for (const { width, height } of sizesToProcess) {
//       const newFileName = getNewFileName(imageName, width, height);
//       const outputPath = newFileName; 

//       await originalImage
//         .clone()
//         .resize(width, height)
//         .toFile(outputPath)
//         .catch(error => console.log(error));

//       const stats = await fs.stat(outputPath);
//       legendData.push(`${newFileName}: ${stats.size} bytes`);
//     }

//     return legendData;
//   } catch (error) {
//     console.log("Error: ", error);
//     throw error;
//   }
// }

async function processImage(imagePath, targetSize) {
  try {
    const imageName = path.basename(imagePath);
    const originalImage = sharp(imagePath); // note: returns a Sharp instance that represents the loaded image
    const legendData = [];

    const sizesToProcess = targetSize ? [targetSize] : SIZES;

    for (const { width, height } of sizesToProcess) {
      const newFileName = getNewFileName(imageName, width, height);
      const outputPath = newFileName;

      const outputStream = fsSync.createWriteStream(outputPath);

      await originalImage
        .clone()
        .resize(width, height)
        .pipe(outputStream);

      await new Promise((resolve, reject) => {
        outputStream.on('finish', resolve);
        outputStream.on('error', reject);
      });

      const stats = await fs.stat(outputPath);
      legendData.push(`${newFileName}: ${stats.size} bytes`);
    }

    return legendData;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

async function resizeImages(targetSize) {
    try {
      const files = await fs.readdir(IMAGES_DIR);
      // console.log(files);
      if (files.length === 0) {
        console.log('No pictures in the dir');
        return;
      }
  
      const legend = [];
      for (const file of files) {
        const imagePath = path.join(IMAGES_DIR, file);
        // console.log(imagePath);
        const legendData = await processImage(imagePath, targetSize);
        legend.push(...legendData);
      }
  
      await fs.writeFile(
        'legend.txt', 
        legend.join('\n')
      );
    } catch (error) {
      console.log("error: ", error);
    }
  }

const argument = process.argv.find(arg => arg.startsWith('--velicina'));
let targetSize = null;
console.log(argument);

if (argument) {
  const sizeStr = process.argv[process.argv.indexOf(argument) + 1];
  
  if (sizeStr) {
    const [width, height] = sizeStr.split('x').map(Number);
    if (!isNaN(width) && !isNaN(height)) {
      targetSize = { width, height };
    } else {
      console.log("Error 1");
    }
  } else {
    console.log("Error 2");
  }
}
console.log(targetSize);

resizeImages(targetSize);