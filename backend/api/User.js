import express from "express";

// mongoose user model
import User from "../models/User.js";

// mongoose user verification model
import UserVerification from "../models/UserVerification.js";

// mongoose password reset model
import PasswordReset from "../models/PasswordReset.js";

// mongoose Todo model
import Todo from "../models/Todo.js";

// password handler - encrypt and decrypt password
import bcrypt from "bcrypt";

// email handler
import nodemailer from "nodemailer";

// unique string
import { v4 as uuidv4 } from "uuid";

// env variables
import dotenv from "dotenv";

dotenv.config();

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
    subject: "Verify Your Email Address",
    html: `
    <p>Dear ${res.name || "User "},</p>
    <p>Thank you for signing up with ${
      process.env.APP_NAME
    }. To complete the registration process and access your account, please verify your email address by clicking on the link below.</p>
    <p><b>Verification Link:</b> <a href="${currentUrl}user/verify/${_id}/${uniqueString}">Click here to verify your email address</a></p>
      <p><b>Important:</b> This verification link will expire in 6 hours. If you have any issues or concerns, please contact our support team at ${
        process.env.SUPPORT_EMAIL
      }</p>
      <p>Best Regards,</p>
    <p>${process.env.APP_NAME} Team</p>
  `,
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

  UserVerification.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        // user verification record exists so we proceed

        // check if record is not expired
        const { expireAt } = result[0];
        const hashedUniqueString = result[0].uniqueString;
        // console.log(hashedUniqueString);

        // if value of current time< less than link expire time
        // link is expired
        if (expireAt < Date.now()) {
          // record is expired so we delete it
          UserVerification.deleteOne({ userId })
            .then(() => {
              // if link is expired then we need to delete the user id as well from the record
              User.deleteOne({ _id: userId })
                .then(() => {
                  let message =
                    "Link has expired. Please request a new verification link.";
                  res.redirect(
                    `http://localhost:5173/verified?error=true&message=${encodeURIComponent(
                      message
                    )}`
                  );
                })
                .catch((error) => {
                  console.log(error);
                  let message =
                    "Clearing user with expired unique string failed!";
                  res.redirect(
                    `http://localhost:5173/verified?error=true&message=${encodeURIComponent(
                      message
                    )}`
                  );
                });
            })
            .catch((result) => {
              console.log(result);
              let message = "Failed to delete expired verification record!";
              res.redirect(
                `http://localhost:5173/verified?error=true&message=${encodeURIComponent(
                  message
                )}`
              );
            });
        } else {
          // record is not expired so we proceed with verification

          // First compare the hasehed unique string
          bcrypt
            .compare(uniqueString, hashedUniqueString)
            .then((result) => {
              // here result is boolean value true or false
              // whether the string is matched or not
              if (result) {
                // string match

                // update user document with verified status
                User.updateOne({ _id: userId }, { verified: true })
                  .then(() => {
                    // user verified status updated now
                    // userVerification details are no longer needed
                    UserVerification.deleteOne({ userId })
                      .then(() => {
                        const message =
                          "Your account has been successfully created and verified. You can log in now.";
                        res.redirect(
                          `http://localhost:5173/verified?success=true&message=${encodeURIComponent(
                            message
                          )}`
                        );
                      })
                      .catch((error) => {
                        console.log(error);
                        let message =
                          "An Error occurred while finalizing successful verification";
                        res.redirect(
                          `http://localhost:5173/verified?error=true&message=${encodeURIComponent(
                            message
                          )}`
                        );
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    let message =
                      "An Error occurred while updating user record to show verified";
                    res.redirect(
                      `http://localhost:5173/verified?error=true&message=${encodeURIComponent(
                        message
                      )}`
                    );
                  });
              } else {
                // existing record but incorrect verification detail passed
                let message =
                  "Invalid Verification detials, Please check your inbox";
                res.redirect(
                  `http://localhost:5173/verified?error=true&message=${encodeURIComponent(
                    message
                  )}`
                );
              }
            })
            .catch((error) => {
              console.log(error);
              let message = "An error occurred while comparing unique strings.";
              res.redirect(
                `http://localhost:5173/verified?error=true&message=${encodeURIComponent(
                  message
                )}`
              );
            });
        }
      } else {
        // user verification record doesn't exist i.e. user has already verified or not created account
        let message =
          "Account record doesn't exist or has been already verified. Please signup or login";
        res.redirect(
          `http://localhost:5173/verified?error=true&message=${encodeURIComponent(
            message
          )}`
        );
      }
    })
    .catch((error) => {
      console.log(error);
      let message = "An error occurred while fetching user verification data!";
      res.redirect(
        `http://localhost:5173/verified?error=true&message=${encodeURIComponent(
          message
        )}`
      );
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

          // check verification status of the user
          if (!data[0].verified) {
            // not verified
            res.json({
              status: "FAILED",
              message:
                "Your account is not verified yet! Please verify your account first!",
            });
          } else {
            // verified
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
        console.log(err);
        res.json({
          status: "FAILED",
          message: "User Doesn't exist please SignUp!",
        });
      });
  }
});

// Request Password Reset
router.post("/requestPasswordReset", (req, res) => {
  const { email, redirectUrl } = req.body;

  User.find({ email })
    .then((result) => {
      if (result.length) {
        // User exists, send password reset link

        // check if user is verified
        if (!result[0].verified) {
          res.json({
            status: "FAILED",
            message:
              "Your account is not verified yet! Please verify your account first!",
          });
        } else {
          // proceed with password reset
          sendResetEmail(result[0], redirectUrl, res);
        }
      } else {
        res.json({
          status: "FAILED",
          message: "No user found with the email address!",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "An error occurred while checking for exisitng user!",
      });
    });
});

// send password reset email link
function sendResetEmail({ _id, email }, redirectUrl, res) {
  const resetString = uuidv4() + _id;

  PasswordReset.deleteMany({ userId: _id })
    .then(() => {
      // reset record deleted successfully

      // now send the reset email
      // mail options
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Reset Your Password",
        html: `
            <p>Dear ${res.name || "User "},</p>
            Thank you for requesting a password reset with ${
              process.env.APP_NAME
            }. To complete the password reset process, please click on the link below.</p>
            <p><b>Password Reset Link:</b> <a href="${redirectUrl}user/verify/${_id}/${resetString}">Click here to reset your password</a></p>
            <p><b>Important:</b> This password reset link will expire in 1 hour. If you have any issues or concerns, please contact our support team at ${
              process.env.SUPPORT_EMAIL
            }</p>
            <p>Best Regards,</p>
            <p>${process.env.APP_NAME} Team</p>
        `,
      };

      // hash the resetString
      const saltRounds = 10;
      bcrypt
        .hash(resetString, saltRounds)
        .then((hashedResetString) => {
          // hashed the reset string successfully

          // set values in passwordReset collection
          const newPasswordReset = new PasswordReset({
            userId: _id,
            resetString: hashedResetString,
            createdAt: Date.now(),
            expireAt: Date.now() + 3600000, // 1 hour from now
          });

          newPasswordReset
            .save()
            .then(() => {
              transporter
                .sendMail(mailOptions)
                .then(() => {
                  // reset email sent and password reset record saved
                  res.json({
                    status: "PENDING",
                    message: "Password reset email sent successfully",
                  });
                })
                .catch((error) => {
                  console.log(error);
                  res.json({
                    status: "FAILED",
                    message: "Password reset email failed to send.",
                  });
                });
            })
            .catch((error) => {
              console.error(error);
              res.json({
                status: "FAILED",
                message: "An Error occured while hashing password reset data!",
              });
            });
        })
        .catch((error) => {
          console.log(error);
          res.json({
            status: "FAILED",
            message: "An error occurred while hashing password reset data!",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "Clearing existing password reset data failed!",
      });
    });
}

// Reset Password using link sent in email.
router.post("/resetPassword", (req, res) => {
  let { userId, resetString, newPassword } = req.body;

  PasswordReset.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        // password reset record exists

        // check if record is expired or not
        const { expireAt } = result[0];
        // fetch the hashed reset string from database
        const hashedResetString = result[0].resetString;

        if (expireAt < Date.now()) {
          // password reset record is expired
          PasswordReset.deleteOne({ userId })
            .then(() => {
              // reset record deleted successfully
              res.json({
                status: "FAILED",
                message:
                  "Password reset link expired! Please request a new one.",
              });
            })
            .catch((error) => {
              // delete failed
              console.log(error);
              res.json({
                status: "FAILED",
                message: "Failed to delete expired password reset record!",
              });
            });
        } else {
          // password reset record is not expired
          // valid reset record exists so validate reset string

          // first compare the hashed reset string
          bcrypt
            .compare(resetString, hashedResetString)
            .then((result) => {
              // here result is boolean value true or false

              if (result) {
                // reset string matched

                // hash the new password
                const saltRounds = 10;
                bcrypt
                  .hash(newPassword, saltRounds)
                  .then((hashedNewPassword) => {
                    // update user document with new password

                    User.updateOne(
                      { _id: userId },
                      { password: hashedNewPassword }
                    )
                      .then(() => {
                        // user document updated successfully
                        // delete password reset record
                        PasswordReset.deleteOne({ userId })
                          .then(() => {
                            // both user record and reset record update
                            res.json({
                              status: "SUCCESS",
                              message:
                                "Your password has been reset successfully. You can Login now.",
                            });
                          })
                          .catch((error) => {
                            console.log(error);
                            res.json({
                              status: "FAILED",
                              message:
                                "An error occurred while finalizing the password reset by deleting reset record.",
                            });
                          });
                      })
                      .catch((error) => {
                        console.log(error);
                        res.json({
                          status: "FAILED",
                          message: "Updating user password failed.",
                        });
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    res.json({
                      status: "FAILED",
                      message: "Failed to hash new password!",
                    });
                  });
              } else {
                // record exist but incorrect reset string passed
                res.json({
                  status: "FAILED",
                  message: "Invalid old password!",
                });
              }
            })
            .catch((error) => {
              console.log(error);
              res.json({
                status: "FAILED",
                message: "An error occurred while comparing reset strings!",
              });
            });
        }
      } else {
        // password reset record doesn't exist
        res.json({
          status: "FAILED",
          message: "No password reset record found!",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "Checking for existing password reset record failed!",
      });
    });
});

// Create a new todo
router.post("/create", async (req, res) => {
  const { userId, title, description } = req.body;

  if (!userId || !title || !description) {
    return res
      .status(400)
      .json({ status: "FAILED", message: "All fields are required." });
  }

  try {
    const newTodo = new Todo({
      userId,
      title,
      description,
    });

    // Handle the completedOn field in the backend
    const now = new Date();
    let dd = String(now.getDate()).padStart(2, "0");
    let mm = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    let yyyy = now.getFullYear();
    let h = String(now.getHours()).padStart(2, "0");
    let m = String(now.getMinutes()).padStart(2, "0");
    let s = String(now.getSeconds()).padStart(2, "0");

    // Format the completedOn field as "dd/mm/yyyy at hh:mm:ss"
    newTodo.completedOn = `${dd}/${mm}/${yyyy} at ${h}:${m}:${s}`;

    const savedTodo = await newTodo.save();
    res.status(201).json({ status: "SUCCESS", data: savedTodo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "FAILED", message: "Error creating todo." });
  }
});

// Get all todos for a specific user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ status: "SUCCESS", data: todos });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: "FAILED", message: "Error fetching todos." });
  }
});

// Update a todo by ID
router.put("/update/:uniqueId", async (req, res) => {
  const { uniqueId } = req.params;
  const { title, description, completedOn } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      uniqueId,
      { title, description, completedOn },
      { new: true }
    );

    if (!updatedTodo) {
      return res
        .status(404)
        .json({ status: "FAILED", message: "Todo not found." });
    }

    res.status(200).json({ status: "SUCCESS", data: updatedTodo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "FAILED", message: "Error updating todo." });
  }
});

// Delete a todo by ID
router.delete("/delete/:uniqueId", async (req, res) => {
  const { uniqueId } = req.params;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(uniqueId);

    if (!deletedTodo) {
      return res
        .status(404)
        .json({ status: "FAILED", message: "Todo not found." });
    }

    res
      .status(200)
      .json({ status: "SUCCESS", message: "Todo deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "FAILED", message: "Error deleting todo." });
  }
});

export default router;
