// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 5000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var db

// configuration ===============================================================
mongoose.connect(configDB.url, { useMongoClient: true }, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database



require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
  secret: 'rcbootcamp2018a', // session secret
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


//routes ======================================================================
require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport
// server.js
// var db
// //database and server in only 7 lines thanks to express!
// MongoClient.connect('mongodb://seniorsauce45th:santiago45th@ds055505.mlab.com:55505/jean-claude', (err, database) => {
//   if (err) return console.log(err)
//   db = database
//   app.listen(process.env.PORT || 5000, () => {
//     console.log('listening on 5000')
//   })
// })
//
// app.set('view engine', 'ejs')
// app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.json())
// app.use(express.static('public')) //serve up all files under public, instead of having to include unique endpoints for each file
//
// //server and db are set up, everything below is the api
// app.get('/', (req, res) => {
//   db.collection('orders').find().toArray((err, result) => {
//     if (err) return console.log(err)
//     res.render('index.ejs', {orders: result})
//   })
// })
//
// app.post('/orders', (req, res) => {
//   db.collection('orders').save({name: req.body.name, order: req.body.order, size: req.body.size, thumbUp: ""}, (err, result) => {
//     if (err) return console.log(err)
//     console.log('saved to database')
//     res.redirect('/')
//   })
// })
//
// app.put('/orders', (req, res) => {
//   db.collection('orders')
//   .findOneAndUpdate({name: req.body.name, order: req.body.order, thumbUp=""}, {
//     $set: {
//       order:" Order READY",
//       size: "",
//       thumbUp:""
//     }
//   }, {
//     sort: {_id: -1},
//     upsert: true,
//     returnNewDocument: true
//   }, (err, result) => {
//     if (err) throw err
//     res.redirect('/')
//     // res.send(result)
//   })
// })
//
//
// app.delete('/orders', (req, res) => {
//   db.collection('orders').findOneAndDelete({name: req.body.name}, {name: req.body.name}, (err, result) => {
//     if (err) return res.send(500, err)
//     res.send('Message deleted!')
//   })
// })
//
// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
