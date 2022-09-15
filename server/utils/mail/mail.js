const mailer = require("nodemailer");
require("dotenv").config();

const htmlBuilder = (template, token) => {
  const URL = process.env.PRODUCTION
    ? process.env.URL_PRODUCTION
    : process.env.URL_DEV;

  switch (template) {
    case "welcome":
      return `
      
          <div
            style="
              width: 100%;
              display: flex;
              justify-content: center;
              flex-direction: column;
              align-items: center;
            "
          >
            <img src="http://localhost:5000/logo.jpg" alt="logo" />
            <div
              style="
                background-image: url("logo.jpg");
                height: 400px;
                width: 700px;
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
              "
            >
              <h1
                style="
                  color: rgb(199, 199, 199);
                  font-size: 60px;
                  font-weight: bolder;
                  font-family: sans-serif;
                "
              >
                Time to get
                <span style="font-style: italic; color: rgb(206, 35, 35)"
                  >Creative!</span
                >
              </h1>
            </div>
            <h4>Hi Name,</h4>
            <p>
              If you didn't know that the sky has no limit, your'e about to find out! :)
            </p>
            <p>
              To start exploring the SeatToSky app please confirm your email address
            </p>
            <a  href="${URL}/emailconfirm/${token}"
              ><button
                style="
                  background-color: tomato;
                  border-radius: 20px;
                  border: none;
                  width: 120px;
                  height: 30px;
                  color: whitesmoke;
                "
              >
                Verify Now
              </button>
              
           
              </a
            >
            <p>
              Warmest welcome from
              <span style="font-style: italic">Sea To Sky team!</span>
            </p>
          </div>
       
            `;
    case "forgotPass":
      return `
     
        <div
          style="
            width: 100%;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
          "
        >
          <div
            style="
              background-image: url("logo.jpg");
              height: 400px;
              width: 700px;
              background-repeat: no-repeat;
              background-size: cover;
              background-position: center;
              display: flex;
              justify-content: center;
              flex-direction: column;
              align-items: center;
            "
          >
            <h1
              style="
                color: rgb(199, 199, 199);
                font-size: 60px;
                font-weight: bolder;
                font-family: sans-serif;
              "
            >
              Time to get
              <span style="font-style: italic; color: rgb(206, 35, 35)"
                >Creative!</span
              >
            </h1>
          </div>
          <h4>Hi there,</h4>
          <img src="cid:logo" alt="logo" />
          <p>Forgot your pass?</p>
          <p>Kindly click the following link to change your password</p>
          <a href="${URL}/changepassword/${token}"
            ><button
              style="
                background-color: tomato;
                border-radius: 20px;
                border: none;
                width: 120px;
                height: 30px;
                color: whitesmoke;
              "
            >
              Reset Password
            </button>
          </a>
          <p>
            <span style="font-style: italic">Sea To Sky team!</span>
          </p>
        </div>
      
      
            `;
  }
};

// Function to build the data object depending on the template
const dataBuilder = (to, template, token) => {
  const data = {};

  data.from = process.env.SMTP_FROM;
  data.to = to;

  switch (template) {
    case "welcome":
      data.subject = "Welcome to our site!";
      data.html = htmlBuilder(template, token);
      data.attachment = [
        {
          filename: "logo.jpg",
          path: __dirname + "./images/logo.jpg",
          cid: "logo", // cid means content id
        },
      ];
      break;

    case "forgotPass":
      data.subject = "Sea To Sky - Reset your Password";
      data.html = htmlBuilder(template, token);
      data.attachment = [
        {
          filename: "logo.jpg",
          path: __dirname + "/images/logo.jpg",
          cid: "logo", // cid means content id
        },
      ];
      break;
    default:
      data.subject = "Sea To Sky - Default test";
      data.html = htmlBuilder(template, token);
      data.attachment = [
        {
          filename: "logo.jpg",
          path: __dirname + "/images/logo.jpg",
          cid: "logo", // cid means content id
        },
      ];
  }

  return data;
};
module.exports = (to, token, template) => {
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

  const data = dataBuilder(to, template, token);

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
