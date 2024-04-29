import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

function uploadFile(fileObjArray) {
    let image = null;
    if (Array.isArray(fileObjArray) && fileObjArray.length > 0) {
        const originalFilename = fileObjArray[0].originalname;
        const extname = path.extname(originalFilename);
        const timestamp = Date.now();

        image = `${timestamp}${extname}`;

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const uploadDir = path.join(__dirname, '../public/image/');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uploadPath = path.join(uploadDir, image);

        fs.writeFileSync(uploadPath, fileObjArray[0].buffer);
    }
    return image;
}

const upload = async (fileObjArray) => {
    let images = [];

    try {
        for (let fileObj of fileObjArray) {
            const originalFilename = fileObj.originalname;
            const extname = path.extname(originalFilename);

            const randomString = [...Array(15)].map(() => Math.random().toString(36)[2]).join('');
            const image = `${randomString}${extname}`;

            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            let uploadPath = path.join(__dirname, '../public/image/', image);
            let outStream = fs.createWriteStream(uploadPath);

            await new Promise((resolve, reject) => {
                outStream.on('error', reject);
                outStream.on('finish', resolve);
                outStream.write(fileObj.buffer);
                outStream.end();
            });

            images.push(image);
        }

        return { success: true, images };
    } catch (error) {
        return { success: false, message: error.message };
    }
}


export {
    uploadFile,
    upload
}