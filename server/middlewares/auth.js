const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // examine if there is a token
  try {
    // ------CHECK LATER ----
    const token = req.cookies.cookiename;

    if (!token) return res.status(400).send({ success: false });

    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken) return res.status(400).send({ success: false });

    // check if token has expired
    // not useful since we are in try catch block and verify method will catch the case
    if (Date.now() > decodedToken.exp * 1000)
      return res.status(403).send({ success: false });

    next();
  } catch (error) {
    console.log("AUTH error:", error.message);
    res.status(400).send(error.message);
  }
};
