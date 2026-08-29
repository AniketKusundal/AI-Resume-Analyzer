const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure destination directory exists on ephemeral cloud disk
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, CallBack) {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        CallBack(null, uploadDir);
    },

    filename: function(req, file, CallBack) {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
        CallBack(null, Date.now() + "-" + safeName);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB file limit
});

module.exports = upload;