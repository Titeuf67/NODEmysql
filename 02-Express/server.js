const express = require('express')
const app = express()
const port = 3000

// Première route
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Port d'écoute de l'application
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
