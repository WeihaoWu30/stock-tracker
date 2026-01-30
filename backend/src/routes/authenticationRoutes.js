const express = require('express');
const passport = require('passport');
const { loginSuccess, loginFailure, getUserProfile } = require('../controllers/authentication');
const checkAuth = require('../middleware/authenticationMiddleware.js');
const user = require('../models/user.js');


const router = express.Router();

router.get("/google",
   passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
   passport.authenticate("google", { successRedirect: "/auth/success", failureRedirect: "/auth/failure" })
);

router.use(checkAuth);

router.get("/success", loginSuccess);
router.get("/failure", loginFailure);
router.get("/user", getUserProfile)



module.exports = router;