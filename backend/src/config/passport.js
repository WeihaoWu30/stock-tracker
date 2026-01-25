const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const User = require('../models/user.js');
dotenv.config();

passport.use(
   new GoogleStrategy(
      {
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: process.env.GOOGLE_CALLBACK_URL,
         passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
         try {
            let user = await User.findOne({ googleId: profile.id });

            if (!user) {
               user = await User.create({
                  googleId: profile.id,
                  displayName: profile.displayName,
                  email: profile.emails[0].value,
                  photo: profile.photos[0].value,
               });
            }
            return done(null, user)
         } catch (err) {
            return done(err, null);
         }
      }
   )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
   try {
      const user = await User.findById(id);
      done(null, user);
   } catch (err) {
      done(err, null);
   }
});