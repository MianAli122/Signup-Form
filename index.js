import express from 'express'
import nodemailer from "nodemailer";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const _dirname = dirname(fileURLToPath(import.meta.url));

const app = express()
const port = 3000
app.set("view engine", "ejs");
app.set("views", _dirname);
app.use(express.urlencoded({ extended: true }))
let otpTimestamp = null;
let submitForm = false;
let email = "";
let randomNumber = "";
let password = "";
let confirmpassword = "";
function form(req, res, next) {
  if (req.method === "POST") {
    email = req.body["email"];
    let name = req.body["name"];
    password = req.body["password"];
    confirmpassword = req.body["confirmpassword"];

    submitForm = true;
    console.log(email, name, password, confirmpassword)
  }
  next()
}

// app.use(form)

app.get('/', (req, res) => {
  res.sendFile(_dirname + "/signup.html")
})


app.post('/check', form, (req, res) => {
  if (submitForm) {
    res.sendFile(_dirname + "/otp.html")
    randomNumber = Math.floor(1000 + Math.random() * 9000);
    otpTimestamp = Date.now();
    console.log("your OTP is ", randomNumber);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "khanrohaan476@gmail.com",
        pass: "asxulyuvtqhymsze",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    async function main() {
      const info = await transporter.sendMail({
        to: email,
        subject: "For OTP verification ✔",
        html: `Your OTP is ${randomNumber}`,
      });
      console.log("Message sent: %s", info.messageId);
    }
    main().catch(console.error);
  } else {
    res.sendFile(_dirname + "/index.html")
  }
});

app.post('/submit', (req, res) => {
  let otpp = req.body["password"];
  let currentTime = Date.now();

  if (otpp == randomNumber && (currentTime - otpTimestamp) <= 30000) {
    res.sendFile(_dirname + "/signin.html");
  } else {
    res.send(`<h3>OTP expired or incorrect. Please try again.</h3><a href="/">Go back</a>`);
  }
});
app.post('/verify', (req, res) => {
  let signinpass = req.body["password"];
  let signinemail = req.body["email"];
  if (signinemail === email && signinpass === password) {
    // res.sendFile(_dirname + "/homepage.html");
    res.render("homepage", { userEmail: signinemail });
  }
  else {
    res.sendFile(_dirname + "/signin.html");
  }
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})





