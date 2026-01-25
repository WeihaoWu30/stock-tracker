const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
   userID: { type: mongoose.Schema.Types.ObjectId },
   // Stocks and Balance moved to Portfolio model
   email: {
      type: String,
      //required: true,
      //unique: true,
   },
   username: {
      type: String,
      //   required: true,
      //unique: true,
   },
   password: {
      type: String,
      //   required: true,
      //unique: true,
   },
});

userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();
   this.password = await bcrypt.hash(this.password, 10);
   next();
});

module.exports = mongoose.model("User", userSchema);