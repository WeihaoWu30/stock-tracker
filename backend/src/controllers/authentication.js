const User = require("../models/user");



const loginSuccess = (req, res) => {
   console.log("--- Login Success Handler ---");
   console.log("User authenticated:", req.isAuthenticated());
   if (!req.user) {
      console.log("No user found in loginSuccess, redirecting to root");
      return res.redirect("/");
   }

   // Explicitly save session before redirecting to ensure cookie is set in cross-site scenarios
   req.session.save((err) => {
      if (err) {
         console.error("Session save error:", err);
         return res.redirect((process.env.CLIENT_URL || "http://localhost:3000") + "/login?error=session_save_failed");
      }
      console.log("Session saved successfully. Redirecting to:", process.env.CLIENT_URL);
      res.redirect(process.env.CLIENT_URL || "http://localhost:3000");
   });
}

const loginFailure = (req, res) => {
   // Redirect to frontend login with error param
   res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/login?error=failed`);
}

const getUserProfile = (req, res) => {
   console.log("--- getUserProfile Request ---");
   console.log("Authenticated:", req.isAuthenticated());
   console.log("Session ID:", req.sessionID);
   if (!req.user) {
      console.log("Unauthorized profile request - No user in session");
      return res.status(401).json({ message: "Unauthorized: No session found" });
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