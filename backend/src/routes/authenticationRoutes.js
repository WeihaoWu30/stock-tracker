const express = require('express');
const passport = require('passport');
const { loginSuccess, loginFailure, getUserProfile, logout } = require('../controllers/authentication');
const checkAuth = require('../middleware/authenticationMiddleware.js');
const user = require('../models/user.js');


const router = express.Router();

router.get("/google",
   passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
   passport.authenticate("google", { failureRedirect: "/auth/failure" }),
   loginSuccess
);


router.use(checkAuth);

router.get("/success", loginSuccess);
router.get("/failure", loginFailure);
router.get("/user", getUserProfile);
router.post("/logout", logout)



module.exports = router;