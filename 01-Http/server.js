// Import du module
var http = require('http')

// Création de notre application en NodeJS
http.createServer(function (req, res) {
    res.end('Hello World  Http')
}).listen(3000, "127.0.0.1")

// 
console.log('Server running at http://127.0.0.1:3000/')