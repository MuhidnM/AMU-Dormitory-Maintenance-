import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const processImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  req.body.images = [];
  
  try {
    const processPromises = req.files.map(async (file) => {
      const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}.webp`;
      const outputPath = path.join(uploadDir, filename);

      await sharp(file.buffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);

      req.body.images.push(`/uploads/${filename}`);
    });

    await Promise.all(processPromises);
    next();
  } catch (error) {
    next(error);
  }
};
