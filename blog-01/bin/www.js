const http = require('http');
const handleServe = require('../app');
const PORT = 8000;
const server = http.createServer(handleServe);
server.listen(PORT)