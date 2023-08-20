const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const tempDir = path.resolve(__dirname, '..','..','imagens');

module.exports = {
    directory: tempDir,
    storage: multer.diskStorage({
        destination: tempDir,
        filename(request,file, callback){
            console.log(file.originalname)
            const nomeHash = crypto.randomBytes(10).toString('HEX');
            const nomeArquivo = `${nomeHash}-${file.originalname}`;
            return callback(null, nomeArquivo);
        }
    })
}

