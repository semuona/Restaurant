const express = require("express");
const User = require("../models/User");
const router = express.Router();

const multer = require("multer");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/users/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile._json.email;

      // check if there is such a user in db
      const user = await User.findOne({ email });

      // if there is such user then return it
      if (user) return done(null, user);

      // create a new user to insert to the db
      const newUser = new User({
        username: profile.id,
        email,
        pass: email,
      });

      const savedUser = await newUser.save();

      return done(null, savedUser);
    }
  )
);
//CLOUDINARY

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storageCloudinary = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "NextIn",
    format: async (req, file) => {
      let extension = "";

      if (file.mimetype.includes("image")) {
        extension = file.mimetype.slice(6);

        if (extension === "jpeg") extension = "jpg";
      }

      return extension;
    },
    public_id: (req, file) =>
      `${req.body._id}-${Date.now()}-${file.originalname}`,
  },
});

const uploadCloudinary = multer({ storage: storageCloudinary });

const sendEmail = require("../utils/mail/mail");

router.post("/register", async (req, res) => {
  try {

    const { email, pass } = req.body;

    if (!email || !pass) return res.send({ success: false, errorId: 200 });

    const newUser = new User(req.body);

    const user = await newUser.save();

    const token = await user.generateToken("1d");
    // send an email to the user that just got registered
    sendEmail(user.email, token, "welcome");


    res.send({ success: true });
  } catch (error) {
    console.log("Register ERROR:", error.message);
    res.send(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {

    const { email, pass } = req.body;

    // need to check if pass is missing or one of username and email
    // if email and password are missing then email || username = false.
    // then the opposite of false is true. if it's true then send that success = false
    if (!email || !pass) return res.send({ success: false, errorId: 1 });

    // if (!email && !username) //send success false
    // if (!pass) send success false

    // const user = User.findOne({email: email, pass: pass})
    let user = await User.findOne({ email: email }).select("-__v");

    if (!user) return res.send({ success: false, errorId: 2 });

    const passMatch = await user.comparePassword(pass, user.pass);

    if (!passMatch) return res.send({ success: false, errorId: 3 }); // passwords don't match

    const token = await user.generateToken("1d");

    user = user.toObject();
    delete user.pass;
    delete user.token;

    res.cookie("cookiename", token).send({ success: true, user });
  } catch (error) {
    console.log("Login ERROR:", error.message);
    res.send(error.message);
  }
});

router.get("/logout", async (req, res) => {
  try {
    res.clearCookie("cookiename").send({ success: true });
  } catch (error) {
    console.log("Logout ERROR:", error.message);
    res.send(error.message);
  }
});

// PROFILE
router.patch("/profile", uploadCloudinary.single("image"), async (req, res) => {
  try {
    const { email, _id } = req.body;

    if (!email) return res.send({ success: false, errorId: 1 });

    // req.body.image = req.file.filename
    if (req.file) req.body.image = req.file.path;

    const user = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
    }).select("-__v -pass");
    if (!user) return res.send({ success: false, errorId: 2 });

    res.send({ success: true, user });
  } catch (error) {
    console.log("Update Profile ERROR:", error.message);
    res.send(error.message);
  }
});

router.patch(
  "/profilecloudinary",
  uploadCloudinary.single("image"),
  async (req, res) => {
    try {
      const { email, username, _id } = req.body;

      if (!(email || username)) return res.send({ success: false, errorId: 1 });

      // const foundUser = await User.findById({_id})
      //
      // update users (field1, field2) set field1 = email and field2 = username

      req.body.image = req.file.path;

      const user = await User.findByIdAndUpdate(_id, req.body, {
        new: true,
      }).select("-__v -pass");
      if (!user) return res.send({ success: false, errorId: 2 });

      res.send({ success: true, user });
    } catch (error) {
      console.log("Register CLOUDINARY ERROR:", error.message);
      res.send(error.message);
    }
  }
);

router.get("/emailconfirm/:token", async (req, res) => {
  try {
    const token = req.params.token;
    // find the user with provided id (id is contained inside JWT)
    // update the user and set emailverified to true

    const payload = await User.getPayload(token);

    const id = payload.id;

    const updatedUser = User.findByIdAndUpdate(
      id,
      { emailVerified: true },
      { new: true }
    );

    if (!updatedUser) return res.send({ success: false });

    res.send({ success: true });
  } catch (error) {
    console.log("email confirm ERROR:", error.message);
    res.send(error.message);
  }
});

/**
 * NOTES ON FORGOT PASS AND CHANGE PASS
 *
 * 1. user has forgotten his pass and visits the /forgotpass page at the client
 * 2. user types his email and presses the submit button
 * 3. server is getting a post request which includes user's email
 * 4. server is checking if the email exists in DB
 * 5. if email exists server generates a token for reseting the pass
 * 6. server is sending an email to that email address containing a link for the user to change his password
 * 7. user receives an email with that link and clicks the link
 * 8. user is directed to the page /changepass
 * 9. user is typing his new pass and presses the submit button
 * 10. server is receiving his token and his new password
 * 11. server is verifying the token
 * 12. server is searching for the user with the user id that it's in the token
 * 13. server is updating the pass of the user
 */

// Client sends an email and we need to find this email in DB
// and generate and send an email with instruction to that email address
router.post("/forgotpass", async (req, res) => {
  try {
    const email = req.body.email;

    // find user in db
    const user = await User.findOne({ email: email });
    if (!user) return send({ success: false, errorId: 1 });

    const userWithToken = await user.generateToken("1d", "resetToken");

    if (!userWithToken.resetToken) return send({ success: false, errorId: 2 });

    sendEmail(user.email, userWithToken.resetToken, "forgotPass");

    res.send({ success: true });
  } catch (error) {
    console.log("forgot pass ERROR:", error.message);
    res.send(error.message);
  }
});

/**
 * this route accepts a token and a password
 * 1. find the user based on the token
 * 2. update his password
 */
router.post("/changepass", async (req, res) => {
  try {
    const { pass, token } = req.body;
    // 1. verify the token
    const verifiedToken = await User.getPayload(token);

    const user = await User.findByIdAndUpdate(verifiedToken.id);

    if (user) {
      user.pass = pass;
      user.resetToken = "";

      const userSaved = await user.save();
    }

    res.send({ success: true });
  } catch (error) {
    console.log("change pass ERROR:", error.message);
    res.send(error.message);
  }
});

// GOOGLE LOGIN PATHS

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/users/google/failure",
    session: false,
  }),
  async (req, res) => {
    // User is the class. req.user is a new User
    const token = await req.user.generateToken("1d");

    res.cookie("cookieStore", token);

    res.redirect((process.env.NODE_ENV === "production" ? "https://nextin.works/glogin/" : "http://localhost:3000/glogin/") + req.user._id);
  }
);

router.get("/glogin/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-__v -pass");

  res.send({ success: true, user });
});

// ADD PERSONAL TODO
router.post("/addpersonaltodo/:id", async (req, res) => {
  const userid = req.params.id;
  try {
    const newUser = await User.findByIdAndUpdate(
      userid,
      { $push: { personalToDos: req.body } },
      { new: true }
    );
    res.send({ success: true, newUser });
  } catch (error) {
    res.send("add personal todo error", error);
  }
});

// DELETE PERSONAL TODO
router.patch("/deletepersonaltodo/:userid/:todoid", async (req, res) => {
  const userid = req.params.userid;
  const todoid = req.params.todoid;
  try {
    const newUser = await User.findByIdAndUpdate(
      userid,
      {
        $pull: { personalToDos: { _id: todoid } },
      },
      { new: true }
    );
    if (newUser) {
      res.send({ success: true, newUser });
    }
  } catch (error) {
    console.log("delete arror : ", error.message);
    res.send("delete personal todo error", error.message);
  }
});

// UPDATE PERSONLTODO //TOGGLE CHECKED

router.patch("/updatepersonaltodo/:userid", async (req, res) => {
  const userid = req.params.userid;
  try {
    console.log("UPDATE PERSONLTODO body is: ", req.body);

    const newUser = await User.findByIdAndUpdate(
      userid,
      { personalToDos: req.body },
      { new: true }
    );
    if (newUser) {
      res.send({ success: true, newUser });
    }
  } catch (error) {
    res.send("UPDATE PERSONLTODO error", error);
  }
});

module.exports = router;
