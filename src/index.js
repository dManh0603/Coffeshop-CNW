const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const sortMiddleware = require('./app/middlewares/sort');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');

const route = require('./routes');
const db = require('./config/db');

// Generate a random UUID to use as the secret key
const secret = uuidv4();
const app = express();
const port = 3030;



// Load evironment variables in .env file
require('dotenv').config();

// Connect to db
db.connect();

// Custom middleware
app.use(sortMiddleware);

// Serve static file in public folder
app.use(express.static(path.join(__dirname, 'public')));

// Express's middleware
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Express's method override for form's put/patch method
app.use(methodOverride('_method'));

// Set up session middleware
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
}));

// // HTTP logger
// if (process.env.NODE_ENV === 'DEV') {
//     app.use(morgan('combined'));
// }

// Template engine
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    helpers: require('./helpers/HbsHelper'),
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));


// Catch requests
route(app);

// Handle 404 error
app.use(function (req, res, next) {
    res.status(404);
    // respond with html page
    if (process.env.NODE_ENV === 'PROD') {
        res.render('_404', { url: req.url });
        return;
    }

    // respond with json
    if (process.env.NODE_ENV === 'DEV') {
        res.json({ error: 'Not found', url: req.url });
        return;
    }
});

app.listen(port, () => {
    console.log(`App listening at port ${port}`)
})

