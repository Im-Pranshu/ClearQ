// connecting mongodb by importing
import "./config/db.js";

import express from "express";
import cors from "cors";

import { json as bodyParser } from "express";

// router
import UserRouter from "./api/User.js";

const app = express();
const port = 3000;

// Enable CORS globally with credentials for a specific origin
app.use(
  cors({
    origin: "https://clear-q.vercel.app/", // Allow your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow methods
    credentials: true, // Allow cookies and credentials
  })
);

app.options("*", cors()); // Handle preflight requests globally

// for accepting post form data
app.use(bodyParser());

// Attach the UserRouter
app.use("/user", UserRouter);

app.get("/getData", (req, res) => {
  res.send("Hare Krishna");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
