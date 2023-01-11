require("dotenv").config();
const express = require('express')
const app = express()
const { PORT, CLIENT_URL } = require('./constants')
const router = require("./router/router");
const cookieParser = require('cookie-parser')
const passport = require('passport')
const cors = require('cors')
const jwt = require('jsonwebtoken');

//import passport middleware
require('./middlewares/passport-middleware')

//initialize middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(passport.initialize())

app.use(router)

//import routes
const authRoutes = require('./router/auth')
const routers = require('./router/router')

//initialize routes
app.use('/api', authRoutes)
app.use('/api', routers)




// app.get('/verify/:token', (req, res)=>{
// 	const {token} = req.params;

// 	// Verifying the JWT token
// 	jwt.verify(token, 'ourSecretKey', function(err, decoded) {
// 		if (err) {
// 			console.log(err);
// 			res.send("Email verification failed, possibly the link is invalid or expired");
// 		}
// 		else {
// 			res.send("Email verifified successfully");
// 		}
// 	});
// });


//app start
const appStart = () => {
  try {
    app.listen(PORT, () => {
      console.log(`The app is running at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
}

appStart()