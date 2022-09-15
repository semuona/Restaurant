const mailer = require("nodemailer");
require("dotenv").config();

module.exports = (to, token) => {
  const URL = process.env.PRODUCTION
    ? process.env.URL_PRODUCTION
    : process.env.URL_DEV;

  // 1. setup smtp
  const smtpTransport = mailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // 2. send email

  const data = {
    from: process.env.SMTP_FROM,
    to: to,
    subject: "Reset your pass at our Social Media App",
    html: `
            <!DOCTYPE html>
            <html>
              <body style="margin: 0; padding: 0;background-color: #000000;color: #fff;min-height:70vh;width:100%;">
                <p>Forgot your pass?</p>
                <p>Kindly click the following link to change your password</p>
                <a href="${URL}/changepassword/${token}">Change your password</a>
              </body>
            </html>
          `,
  };

  smtpTransport.sendMail(data, function (err, response) {
    if (err) {
      console.log(err);
    } else {
      cb();
    }
  });

  // 3. close connection
  smtpTransport.close();
};
