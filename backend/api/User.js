import express from "express";

// mongoose user model
import User from "../models/User.js";

// password handler - encrypt and decrypt password
import bcrypt from "bcrypt";

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
              });

              newUser
                .save()
                .then((result) => {
                  res.json({
                    status: "SUCCESS",
                    message: "Account created successfully",
                    data: result,
                  });
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
