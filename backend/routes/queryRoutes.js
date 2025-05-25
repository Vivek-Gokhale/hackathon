const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const queryController = require('../controllers/queryController');
const generateUniqueFileName = require('../utils/generateUniqueFileName');

const uploads = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, path.join(__dirname, '..', 'uploads', 'images'));
        } else if (file.mimetype.startsWith('audio/')) {
            cb(null, path.join(__dirname, '..', 'uploads', 'audio'));
        } else {
            cb(new Error('Unsupported file type'), null);
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = generateUniqueFileName(file.originalname);
        file.savedFileName = uniqueName; // Attach to file object
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: uploads });


// Multiple optional files: image + audio
router.post('/add-query', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
]), async (req, res, next) => {
    try {
        // Extract file paths if available
        if (req.files?.image?.[0]) {
            req.body.imagePath = `/uploads/images/${req.files.image[0].filename}`;
        }
        if (req.files?.audio?.[0]) {
            req.body.audioPath = `/uploads/audio/${req.files.audio[0].filename}`;
        }

        await queryController.addQuery(req, res, next);
    } catch (error) {
        console.error("Error in /add-query:", error);
        next(error);
    }
});

router.post('/assign-query', queryController.setQuery);

module.exports = router;
