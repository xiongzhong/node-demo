const fs = require('fs');
const path = require('path');
const stream = require('stream');
function writeLog(writeStream, log) {
    writeStream.write(log+'\n')
}
function createWriteStream(fileName) {
    const fullFileName = path.join(__dirname, '../', '../', 'logs', fileName);
    const writeStream = fs.createReadStream(fullFileName, {
        flags: 'a'
    });
   
    return writeStream;
}
const accessWriteStream = createWriteStream('access.log');

function access(log) {
    writeLog(accessWriteStream, log)
}

module.exports = {
    access
}