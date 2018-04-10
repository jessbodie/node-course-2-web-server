// Package to run web server
const express = require('express');
// Package to serve templated pages
const hbs = require('hbs');
const fs = require('fs');

var app = express();

// Way to show partials with HBS, arg is directory
hbs.registerPartials(__dirname + '/views/partials');
// Set  - Express related configurations
// Enables HBS
app.set('view engine', 'hbs');
// app.use is how to register middleware, arg is one fn
// Must call next() in order to move on from this middleware
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log.');
        }
    });
    console.log(log);
    // To exit this middleware, must call this fn
    next();
});

// Middleware that could be used for maintenance
// Intentionally shuts down access to rest of site
// app.use((req, res, next) => {
//     res.render('maintenance.hbs', {
//             pageTitle: 'Sorry!'
//         });
// });

// .use takes middleware function
// Static lets you server up a directory
app.use(express.static(__dirname + '/public'));


// Helper functions, 1st arg is helper fn name, 2nd is actual fn
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

// Get function takes URL and a function that takes 2 arguments: request and response
app.get('/', (req, res) => {
    // res.send('<h1>hello express!</h1>');
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to Jess\'s Website!'
    });
});

app.get('/about', (req,res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Oh no, this is a bad page!'
    });
})


// Listen sers up server
// First argument is port. 3000 is common port for developing
// Listen takes 2nd argument to handle error handling
app.listen(3000, () => {
    console.log('Server is up on port 3000');
} );

