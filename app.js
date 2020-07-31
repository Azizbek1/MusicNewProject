const express = require('express');
const path = require('path') // node js o'zini moduli
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport')

// yangi 4 ta moduli qo'shamiz
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const session = require('express-session');


const app = express();
// mongoose o'rnatamiz 

// bodyParser INIT 
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())



const db2 = require('./cf/db')
mongoose.connect(db2.db, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
const db  = mongoose.connection;
db.on('error', (err) => {
    console.error(err, 'connection error:')
} );
db.on('open', function() {
  console.log('MongoDB ga OFLAYN  Tarizda ulandik');
});


// PUG ustanovka qilgandan keyin; static folder qildik STATIC FOLDERS PUG
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug');


// Static folders INDEX.HTML va boshqa malumotlar uchun
app.use(express.static(path.join(__dirname, 'public')))



//For navigation messages  : 
// 
//  express-messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// EXPRESS_SESSIONS 
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))

// Express Validator
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        let namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}));

// Passport CF
require('./cf/passport')(passport);
// Passport use
app.use(passport.initialize());
app.use(passport.session());

// User Init 
app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next()
})


// PAPAKA YARATIM ROUTES U SHA YERGA JOYLASHTIRAMIZ  

const musics = require('./routes/music');
const registr = require('./routes/users');

app.use('/', musics)
app.use('/', registr)


app.listen(3000, () => {
    console.log(`3000 portda server oyoqa turdi`);
})
