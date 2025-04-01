const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        const uploadsDir = path.join(__dirname, '../uploads');
        cd(null, uploadsDir);
    },
    filename: (req, file, cd) => {
        const fileName = req.body.fileName;

        cd(null, fileName);
    }
})

module.exports = multer({storage})