const mailer = require("nodemailer");
require("dotenv").config();
module.exports = (email, name, message) => {
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
    to: process.env.SMTP_TO,
    subject: "Message from NextIn graduation project",
    html: `
    <!DOCTYPE html>
    <html>
      <body>
      <h1>Message from NextIn graduation project</h1>
        <p>From: ${name}</p>
        <p>Senders email address: ${email}</p>
        <p>Message:${message}</p>
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
