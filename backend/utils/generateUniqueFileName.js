const path = require('path');

function generateUniqueFileName(originalName) {
    const timestamp = Date.now();
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext);
    return `${base}-${timestamp}${ext}`;
}

module.exports = generateUniqueFileName;
