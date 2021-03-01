const express = require('express')
const path = require('path')
const passport = require('passport')
const dotenv = require('dotenv')
const favicon = require('serve-favicon')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const post = require('./routes/post')
const auth = require('./routes/auth')
const index = require('./routes/index')
const pay = require('./routes/pay')

const Post = require('./models/Item')
const connectDB = require('./config/db')

const ejs = require('ejs')
const paypal = require('paypal-rest-sdk')

var nodemailer = require('nodemailer');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Load config
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

// Express app
const app = express()

// Port number
const PORT1 = process.env.PORT || 3000

// Email
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: process.env.EMAIL,
	  pass: process.env.EMAIL_PASS
	}
});

// PayPal
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
  });

// Connect to MongoDB
connectDB()

// Register view engine
app.set('view engine', 'ejs')

app.use(express.static('public'))


// Sessions
app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
	})
)

// Passport and express middleware
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded())

// Favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.get('/sendmail', (req,res) => {  
	console.log(req.user)
	var mailOptions = {
		from: process.env.EMAIL,
		to: req.user.googleId,
		subject: 'Sending Email using Node.js',
		text: 'That was easy!'
	  };
	  
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
		  console.log(error);
		} else {
		  console.log('Email sent: ' + info.response);
		}
	});
})

// Routes
app.use('/posts', post)
app.use('/auth', auth)
app.use('/', index)

// 404
app.use((req, res) => {
	if(req.user === undefined) {
		res.status(404).render('404', { title: 'Page not found', user: "undefined", dev: false })
	}	else {
		res.status(404).render('404', { title: 'Page not found', user: req.user, dev: false })
	}
})



// Listen for requests
app.listen(PORT1, () => {
	console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT1}`)
})
