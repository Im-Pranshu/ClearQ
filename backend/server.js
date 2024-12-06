// connecting mongodb by importing
import "./config/db.js";

import express from "express";
import cors from "cors";

import { json as bodyParser } from "express";

// router
import UserRouter from "./api/User.js";

const app = express();
// const port = 3000;
const port = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));

// for accepting post form data
app.use(bodyParser());

// Attach the UserRouter
app.use("/user", UserRouter);

// app
//   .get("/user2", () => {})
//   .get("signin", (req, res) => {
//     console.log("signin post request");
//     res.json({ message: "signin post request" });
//   });

app.get("/getData", (req, res) => {
  res.send("Hare Krishna");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
