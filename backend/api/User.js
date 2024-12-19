import express from "express";

// mongoose user model
import User from "../models/User.js";

// mongoose user verification model
import UserVerification from "../models/UserVerification.js";

// email handler
import nodemailer from "nodemailer";

// unique string
import { v4 as uuidv4 } from "uuid";

// env variables
import dotenv from "dotenv";

dotenv.config();

// password handler - encrypt and decrypt password
import bcrypt from "bcrypt";

// nodemailer stuff
let transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

// testing succes of nodemailer
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for messages");
    console.log(success);
  }
});

const router = express.Router();

// SignUp
router.post("/signup", (req, res) => {
  let { name, email, password } = req.body;

  // trim the variables of any whitespaces
  name = name.trim();
  email = email.trim();
  password = password.trim();

  //   check if variables are empty
  if (name == "" || email == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Empty Credentials Provided!",
    });
  }
  // checking the format of name contains alphates only using regular expression
  else if (!/^[a-zA-Z ]*$/.test(name)) {
    res.json({
      status: "FAILED",
      message: "Enter a valid name!",
    });
  }
  // check format of email using reg expression
  else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) {
    res.json({
      status: "FAILED",
      message: "Enter a valid Email ID!",
    });
  }
  // checking lenght of the password
  else if (password.length < 6) {
    res.json({
      status: "FAILED",
      message: "Lenght of password must be atleast 6 characters!",
    });
  }
  // check if user is already created
  else {
    User.find({ email })
      .then((result) => {
        if (result.length) {
          // user alredy exist
          res.json({
            status: "FAILED",
            message: "User with the email already exists!",
          });
        }
        // user doesn't exist
        else {
          // Trying to create a new user

          // password handling
          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then((hashedPassword) => {
              // after hashing the password create new user
              const newUser = new User({
                name,
                email,
                password: hashedPassword,
                verified: false,
              });

              newUser
                .save()
                .then((result) => {
                  // Handling account verification
                  sendVerificationEmail(result, res);
                })
                .catch((err) => {
                  res.json({
                    status: "FAILED",
                    message: "AN error occured while saving  user account!",
                  });
                });
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "AN error occured while hashing user password!",
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: "An error encountered while checking for existing user!",
        });
      });
  }
});

// sending verification link by email
const sendVerificationEmail = ({ _id, email }, res) => {
  // url to be used in the email
  const currentUrl = "http://localhost:5000/";

  // combining user id from db and uid package value to get unique string
  const uniqueString = uuidv4() + _id;

  // mail options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Verify your email address to complete the signup process. After Verification you can login to your acccount. <br>
    Thank You. </p> <p><b>The Link will expire in 6 hours</b> </p> <p>Press <a href=${
      currentUrl + "user/verify" + _id + "/" + uniqueString
    } + unique> here<a/> to proceed.</p>`,
  };

  // hash the uniqeString
  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
      // set values in userVerification collection
      const newVerification = new UserVerification({
        userId: _id,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
        expireAt: Date.now() + 21600000, // 6 hours from now
      });

      newVerification
        .save()
        // finally sending mail to the user
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              // email sent and verification record also saved
              res.json({
                status: "PENDING",
                message: "Verification mail sent please check and verify!",
              });
            })
            .catch((err) => {
              console.log(err);
              res.json({
                status: "FAILED",
                message: "Email Verification Failed!",
              });
            });
        })
        .catch((error) => {
          console.log(error);
          res.json({
            status: "FAILED",
            message: "Failed to save verification email data!",
          });
        });
    })
    .catch(() => {
      res.json({
        status: "FAILED",
        message: "An error occurred while hashing email data!",
      });
    });
};

// handling verification of sent link - Verify Email
router.get("/verify/:userId/:uniqueString", () => {
  let { userId, uniqueString } = req.params;

  UserVerification.find({ userId })
    .then()
    .catch((error) => {
      console.log(error);
      // start from here
    });
});

// SignIn
router.post("/signin", (req, res) => {
  let { email, password } = req.body;

  // trim the variables of any whitespaces
  email = email.trim();
  password = password.trim();

  //   check if variables are empty
  if (email == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Empty Credentials Provided!",
    });
  }
  // check format of email using reg expression
  else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "Enter a valid Email ID!",
    });
  }
  // checking lenght of the password
  else if (password.length < 6) {
    res.json({
      status: "FAILED",
      message: "Lenght of password must be atleast 6 characters!",
    });
  }
  // check if user exists
  else {
    User.find({ email })
      .then((data) => {
        if (data.length) {
          // user exists

          const hashedPassword = data[0].password;
          bcrypt
            .compare(password, hashedPassword)
            .then((result) => {
              if (result) {
                // password matched
                res.json({
                  status: "SUCCESS",
                  message: "SignIn Successful",
                  data: data,
                });
              } else {
                // password not matched
                res.json({
                  status: "FAILED",
                  message: "Please enter a valid password!",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "An Error occured while comparing passwords!",
              });
            });
        } else {
          res.json({
            status: "FAILED",
            message: "Invalid credentials entered!",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "FAILED",
          message: "User Doesn't exist please SignUp!",
        });
      });
  }
});

export default router;
