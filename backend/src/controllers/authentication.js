const User = require("../models/user");



const loginSuccess = (req, res) => {
   console.log("Login Success reached. User authenticated:", req.isAuthenticated());
   if (!req.user) {
      console.log("No user found in loginSuccess, redirecting to root");
      return res.redirect("/");
   }
   console.log("Redirecting user to:", process.env.CLIENT_URL);
   res.redirect(process.env.CLIENT_URL || "http://localhost:3000");
}

const loginFailure = (req, res) => {
   // Redirect to frontend login with error param
   res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/login?error=failed`);
}

const getUserProfile = (req, res) => {
   console.log("getUserProfile path reached. Authenticated:", req.isAuthenticated());
   if (!req.user) {
      console.log("Unauthorized profile request");
      return res.status(404).json({ message: "No user found" });
   }
   else {
      console.log("Returning profile for user:", req.user.username);
      res.json(req.user);
   }
}

const logout = (req, res) => {
   req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.json({ message: "Logout successful" });
   });
}

module.exports = { loginFailure, loginSuccess, getUserProfile, logout };