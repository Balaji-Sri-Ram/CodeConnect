const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase config
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Storage config - Use Memory Storage
const storage = multer.memoryStorage();

const checkFileType = (file, cb) => {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
};

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// @route   POST /api/upload
// @desc    Upload an image to Supabase
// @access  Public
router.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const fileExt = path.extname(req.file.originalname);
        const fileName = `${req.file.fieldname}-${Date.now()}${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return res.status(500).send('Upload failed');
        }

        const { data: { publicUrl } } = supabase.storage
            .from('uploads')
            .getPublicUrl(filePath);

        // Return the full public URL relative path (frontend expects a path it can append to BASE_URL, 
        // but since we are now returning a full external URL, we need to handle that. 
        // Ideally frontend should handle absolute URLs.
        // Let's modify frontend to check if URL is absolute or relative, OR just hack it here.
        // Frontend logic (StudentProfile.jsx): const fullUrl = `${BASE_URL}${filePath}`; 
        // This expects a relative path.
        // HACK: We can return the full URL, but frontend will prepend BASE_URL (http://localhost:5000). 
        // Wait, frontend says: 
        // const { data: filePath } = await api.post('/upload', ...)
        // const fullUrl = `${BASE_URL}${filePath}`;
        // If we send back "https://supabase...", frontend will make "http://localhost:5000https://supabase..." -> BROKEN.

        // CORRECTION: We MUST update Frontend too OR make backend act as proxy (streaming).
        // Since we want PERSISTENCE on Supabase, direct link is best for performance.
        // Checking frontend code again...
        // StudentProfile:93: const fullUrl = `${BASE_URL}${filePath}`;

        // If we return just the path "/storage/v1/object/public/uploads/..." it might work if correct proxy is set up, 
        // but Supabase is external.

        // DECISION: I will change this file to return the object data, 
        // AND I will update Frontend to handle absolute URLs.

        res.send(publicUrl); // Sending absolute URL
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
