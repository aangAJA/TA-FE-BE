// fileUploadConfig.ts
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'thumbnail') {
            cb(null, path.join(__dirname, '../public/story_thumbnails'));
        } else if (file.fieldname === 'content') {
            cb(null, path.join(__dirname, '../public/story_content'));
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.fieldname === 'thumbnail') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for thumbnails'), false);
        }
    } else if (file.fieldname === 'content') {
        const allowedTypes = ['.txt', '.docx', '.pdf'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only .txt, .docx, and .pdf files are allowed for content'), false);
        }
    }
};

export const storyUpload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
}).fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'content', maxCount: 1 }
]);

