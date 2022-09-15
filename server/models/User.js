const mongoose = require("mongoose");
const { Schema } = mongoose;

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailVerified: Boolean,
  emailVerificationToken: String,
  pass: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    // required: true,
  },
  lastName: {
    type: String,
    // required: true,
    //required: true,
  },
  image: {
    type: String,
  },
  resetToken: String, // token to change your password
  token: {
    // access token - generated when user is logging in
    type: String,
  },
  contacts: [],
  phone: { type: Number },
  birthDate: { type: String },
  address: {
    street: String,
    houseNumber: String,
    zipcode: String,
    city: String,
    country: String,
  },
  personalToDos: [
    {
      completed: Boolean,
      text: String,
      date: {
        type: Date,
        default: Date.now(),
      },
    }
  ],
});

// Mongoose middleware 'pre':
// before save
// needs a callback function
userSchema.pre("save", function (next) {

  const user = this;

  if (user.isModified("pass")) {
    // check if password is about to be changed
    bcrypt.genSalt(saltRounds, function (err, salt) {
      // $2b$10$yAUMtaN7uIFWGTVc2mmzne
      if (err) return next(err);

      bcrypt.hash(user.pass, salt, function (err, hash) {
        // $2b$10$yAUMtaN7uIFWGTVc2mmzne -> salt
        // $2b$10$yhEXcHdY6meFoFyoeZnIAuhO8OFkiLnwwzj6KiXIQEse0s3zW8mwS -> hash

        if (err) return next(err);

        user.pass = hash;

        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async (providedPass, dbPass) => {
  return await bcrypt.compare(providedPass, dbPass);
};

userSchema.methods.generateToken = async function (expiration, dbField) {
  const user = this;
  const token = jwt.sign({ id: user._id.toHexString() }, process.env.SECRET, {
    expiresIn: expiration,
  });

  if (dbField) {
    user[dbField] = token;
    await user.save();
    return user;
  } else {
    // just return the token
    return token;
  }
};

userSchema.statics.getPayload = async (token) => {
  try {
    return jwt.verify(token, process.env.SECRET);
  } catch (error) {
    return error.message;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
