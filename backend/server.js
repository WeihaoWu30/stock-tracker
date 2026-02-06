const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');

const connectDB = require('./src/config/db.js');
const portfolioRoutes = require('./src/routes/portfolioRoutes');
const stockRoutes = require('./src/routes/stockRoutes');
//import authRoutes from './src/routes/authenticationRoutes.js'
const authRoutes = require('./src/routes/authenticationRoutes.js')
const passport = require("passport");
require("./src/config/passport");
const session = require("express-session");

//dotenv.config();
connectDB();

const app = express();
app.use(cors({
   origin: process.env.CLIENT_URL || "http://localhost:3000",
   credentials: true
}));
app.use(express.json());




app.set('trust proxy', 1);

const MongoStore = require('connect-mongo').default;

app.use(session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: false,
   store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions'
   }),
   cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
   }
}));

app.use(passport.initialize());
app.use(passport.session());

// Request logger middleware for debugging
app.use((req, res, next) => {
   const isAuth = typeof req.isAuthenticated === 'function' ? req.isAuthenticated() : false;
   console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Auth: ${isAuth} - SessionID: ${req.sessionID}`);
   next();
});


app.get('/', (req, res) => {
   res.send('<h1>Backend is running...</h1>');
});

app.use('/api/portfolio', portfolioRoutes);
app.use('/api/stock', stockRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
   console.log(`Backend running on port ${PORT}`);
   console.log(`Environment: ${process.env.NODE_ENV}`);
   console.log(`Client URL: ${process.env.CLIENT_URL}`);
   console.log(`Google Callback: ${process.env.GOOGLE_CALLBACK_URL}`);
});

