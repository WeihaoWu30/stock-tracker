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

app.use(session({
   secret: process.env.SESSION_SECRET, // change to a strong secret in production
   resave: false,             // don't save session if unmodified
   saveUninitialized: false   // don't create session until something stored
}));

app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
   res.send('<h1>Backend is running...</h1>');
});

app.use('/api/portfolio', portfolioRoutes);
app.use('/api/stock', stockRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
   console.log(`Backend running on port ${PORT}`);
});

