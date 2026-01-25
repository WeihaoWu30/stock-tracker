const express = require('express');
const passport = require('passport');
const { loginSuccess, loginFailure } = require('../controllers/authentication');
const checkAuth = require('../middleware/authenticationMiddleware.js');


const router = express.Router();

router.get("/google",
    passport.authenticate("google", {scope: ["profile", "email"]})
);

router.get("/google/callback",
    passport.authenticate("google", {successRedirect: "/auth/success", failureRedirect: "/auth/failure"})
);

router.get("/success", loginSuccess);
router.get("/failure", loginFailure);

// router.use(checkAuth);


module.exports = router;