// connecting mongodb by importing
import "./config/db.js";

import express from "express";
import cors from "cors";

import { json as bodyParser } from "express";

// router
import UserRouter from "./api/User.js";

const app = express();
const port = 3000;

// Enable CORS for requests from http://localhost:5173
app.use(
  cors({
    origin: "https://clear-q.vercel.app", // Allow requests from your frontend origin
    credentials: true, // Allow credentials (cookies/authorization headers)
  })
);

// Add middleware to handle preflight OPTIONS requests
app.options("*", cors()); // Handle preflight requests globally

// for accepting post form data
app.use(bodyParser());

// Attach the UserRouter
app.use("/user", UserRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
