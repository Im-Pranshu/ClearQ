// connecting mongodb by importing
import "./config/db.js";

import express from "express";
import cors from "cors";

import { json as bodyParser } from "express";

// router
import UserRouter from "./api/User.js";

const app = express();
const port = 3000;

// Enable CORS for requests from your frontend origin
app.use(
  cors({
    origin: "https://clear-q.vercel.app", // Frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies/authorization headers
  })
);

// Middleware to handle preflight requests explicitly
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://clear-q.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-requested-with"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).send();
  }

  next();
});

// for accepting post form data
app.use(bodyParser());

// Attach the UserRouter
app.use("/user", UserRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
