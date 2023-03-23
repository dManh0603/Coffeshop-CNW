const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const sortMiddleware = require('./app/middlewares/sortMiddleware');

const app = express();
const port = 3030;

const route = require('./routes');
const db = require('./config/db');

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

// HTTP logger
if (process.env.NODE_ENV === 'DEV') {
    app.use(morgan('combined'));
}

// Template engine
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    helpers: require('./helpers/HbsHelpers'),
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Routes init
route(app);

app.listen(port, () => {
    console.log(`App listening at port ${port}`)
})