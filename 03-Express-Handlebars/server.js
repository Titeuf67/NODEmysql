const express = require('express');
const { engine }= require('express-handlebars');

const app = express();

/*
 * Configuration Handlebars 
 ***************************/

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//Première route
app.get('/', (req, res) => {
    res.render('home');
});

// Port d'écoute de l'application
app.listen(3000, () => console.log(`Server start on localhost:${PORT_NODE} 🚀`));