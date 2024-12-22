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

// path for static verified page
import path from "path";

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
router.get("/verify/:userId/:uniqueString", (req, res) => {
  let { userId, uniqueString } = req.params;
  console.log("userId : " + userId);
  console.log("uniqueString : " + uniqueString);

  UserVerification.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        // user verification record exists so we proceed

        // check if record is not expired
        const { expireAt } = result[0];
        const hashedUniqueString = result[0].uniqueString;

        if (expireAt < Date.now()) {
          // record is expired so we delete it
          UserVerification.deleteOne({ userId })
            .then((result) => {
              User.deleteOne({ _id: userId })
                .then(() => {
                  let message =
                    "Link has expired. Please request a new verification link.";
                  res.redirect(`/user/verified/error=true&messages=${message}`);
                })
                .catch((error) => {
                  let message =
                    "Clearing user with expired unique string failed!";
                  res.redirect(`/user/verified/error=true&messages=${message}`);
                });
            })
            .catch((result) => {
              console.log(result);
              let message = "Failed to delete expired verification record!";
              res.redirect(`/user/verified/error=true&messages=${message}`);
            });
        } else {
          // record is not expired so we proceed with verification

          // First compare the hasehed unique string
          bcrypt
            .compare(uniqueString, hashedUniqueString)
            .then((result) => {
              //
              if (result) {
                // string match
                // update user document with verified status

                User.updateOne({ _id: userId }, { verified: true })
                  .then(() => {
                    UserVerification.deleteOne({ userId })
                      .then(() => {
                        res.sendFile(
                          path.join(__dirname, "./../views/verified.html")
                        );
                      })
                      .catch((error) => {
                        console.log("ye error hai - " + error);
                      });
                  })
                  .catch((error) => {
                    let message =
                      "An Error occurred while updating user record to show verified";
                    res.redirect(
                      `/user/verified/error=true&messages=${message}`
                    );
                  });
              } else {
                // existing record but incorrect verification detail passed
                let message =
                  "Invalid Verification detials, Please check your inbox";
                res.redirect(`/user/verified/error=true&messages=${message}`);
              }
            })
            .catch((error) => {
              let message = "An error occurred while comparing unique strings.";
              res.redirect(`/user/verified/error=true&messages=${message}`);
            });
        }
      } else {
        // user verification record doesn't exist
        let message =
          "Account record doesn't exist or has been already verified. Please signup or login";
        res.redirect(`/user/verified/error=true&messages=${message}`);
      }
    })
    .catch((error) => {
      console.log(error);
      let message = "An error occurred while fetching user verification data!";
      res.redirect(`/user/verified/error=true&messages=${message}`);
    });
});

// Verified Page Route
router.get("/Verified", (req, res) => {
  res.sendFile(path.join(__dirname, "./../views /verified.html"));
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

          // check verification status of the user
          if (!data[0].verified) {
            res.json({
              status: "FAILED",
              message:
                "Your account is not verified yet! Please verify your account first!",
            });
          } else {
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
          }
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
