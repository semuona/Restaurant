const express = require("express");
const router = express.Router();

const sendEmail = require("../utils/mail/mailMessage");

router.post("/send", (req, res) => {
  try {
    const { email, name, message } = req.body;

    if (!email || !name || !message)
      return res.send({ success: false, errorId: 1 });

    sendEmail(email, name, message);

    res.send({ success: true });
  } catch (error) {
    console.log("Message ERROR:", error.message);
    res.send(error.message);
  }
});
module.exports = router;
