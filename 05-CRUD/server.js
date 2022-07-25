require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// Déstructuration de process.env
const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER, PORT_NODE } = process.env;

// Import des middlewares
const { isAdmin } = require('./middleware');
const app = express();

/*

* Configuration Handlebars 
***************************/

// Import des helpers
const { limit } = require('./helper');

app.engine('hbs', engine({
  helpers: {
    limit
  },
  extname: 'hbs',
  defaultLayout: 'main'
}));

app.set('view engine', 'hbs');
app.set('views', './views');

/*
* Config mysql
***************/
let configDB = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE
};

// Création de la connection avec les paramètres donner
db = mysql.createConnection(configDB);

// Connexion de la db mysql
db.connect((err) => {
  if (err) console.error('error connecting: ', err.stack);
  console.log('connected as id ', db.threadId);
});

/*
 * Config method override 
 *************************/
app.use(methodOverride('_method'));

/*
 * Config Body-parser
 *********************/

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/*
 * Configuration de la route vers notre dossier static
 ******************************************************/
app.use("/assets", express.static('public'));

/*
 * Route de l'application
 *************************/

// Home page
/*
app.get('/', (req, res) => {

  // Récupération de tout les articles
  db.query(`SELECT * FROM articles`, function (err, data) {
    if (err) throw err;
    // Rendu de la page home avec les data de la requête précédente
    res.render('home', {
      db:data
    });
  });

});
*/

app.get('/', (req, res) => {
  console.log('Homepage')

  // Récupération de tout les articles
  db.query(`SELECT * FROM pantoufle`, function (err, data) {
    if (err) throw err;
    // Rendu de la page home avec les data de la requête précédente
    res.render('home', {
      db: data
    });
  });

});


/*
 *  CRUD ARTICLES
 *****************/
app

  // POST ARTICLE 
  .post('/article', (req, res) => {
    const { title, price } = req.body;

    // Ajout d'un article
    db.query(`INSERT INTO articles (title, price) VALUES ('${title}', '${price}');`, function (err, data) {
      if (err) throw err;

      // Redirection vers la page Admin
      res.redirect('/admin');
    })
  })

  // EDIT ARTICLE ID
  .put('/article/:id', (req, res) => {
    const { id } = req.params;
    const { title, price } = req.body;

    // Edition de l'article par rapport a son id
    db.query(`UPDATE articles SET title="${title}", price="${price}" WHERE id=${id};`, function (err, data) {
      if (err) throw err;

      // Redirection vers la page admin
      res.redirect('/admin');
    })
  })

  // DELETE ARTICLE ID
  .delete('/article/:id', (req, res) => {
    const { id } = req.params;

    // Supression de l'article par rapport a son id
    db.query(`DELETE FROM articles WHERE id=${id}`, function (err, data) {
      if (err) throw err;

      // Redirection vers la page admin
      res.redirect('/admin');
    })
  });

// Contact page
app.get('/contact', (req, res) => {
  res.render('contact');
});

/*
 *  CRUD pantoufles
 *****************/
app

  // POST pantoufles 
  .post('/pantoufle', (req, res) => {
    const { name, taille } = req.body;
    console.log('create pantoufle', req.body)

    // Ajout d'un pantoufle
    db.query(`INSERT INTO pantoufle (name, taille) VALUES ('${name}', '${taille}');`, function (err, data) {
      if (err) throw err;
      console.log('data pantoufle', data)

      // Redirection vers la page Admin
      res.redirect('/admin');
    })
  })

  // EDIT pantoufle ID
  .put('/pantoufle/:id', (req, res) => {
    console.log('edit:id pantoufle', req.body, req.params)
    const { id } = req.params;
    const { name, taille } = req.body;

    // Edition de l'pantoufle par rapport a son id
    db.query(`UPDATE pantoufle SET name="${name}", taille="${taille}" WHERE id=${id};`, function (err, data) {
      if (err) throw err;

      console.log('data pantoufle', data)
      // Redirection vers la page admin
      res.redirect('/admin');
    })
  })

  // DELETE ARTICLE ID
  .delete('/pantoufle/:id', (req, res) => {
    const { id } = req.params;
    console.log('delete:id pantoufle', req.params)

    // Supression de l'article par rapport a son id
    db.query(`DELETE FROM pantoufle WHERE id=${id}`, function (err, data) {
      if (err) throw err;

      console.log('data pantoufle', data)
      // Redirection vers la page admin
      res.redirect('/admin');
    })
  });





// Utilisation du middleware pour toute les routes suivante
app.use(isAdmin);

// Admin page
app.get('/admin', (req, res) => {

  // Récupération de tout les articles
  db.query(`SELECT * FROM articles`, function (err, art) {
    if (err) throw err;
    db.query(`SELECT * FROM pantoufle`, function (err, pan) {
      // Rendu de la page admin avec les data de la requête précédente
      res.render('admin', {
        layout: "admin",
        db: art,
        pantoufles: pan
      });

    })
  })

});

// Port d'écoute de l'application
app.listen(PORT_NODE, () => console.log(`Server start on localhost:${PORT_NODE} 🚀`));