import "./config/db.js";

import express from "express";
import cors from "cors";

import UserRouter from "./api/User.js";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "https://clearq-frontend.onrender.com" })); // Adjust as needed
app.use(express.json()); // For accepting JSON post data

// Attach routers
app.use("/user", UserRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
