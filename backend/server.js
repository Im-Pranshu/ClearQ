import "./config/db.js";

import express from "express";
import cors from "cors";

import UserRouter from "./api/User.js";

const app = express();
const port = 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // Adjust as needed
app.use(express.json()); // For accepting JSON post data

// Attach routers
app.use("/user", UserRouter);

// 404 handler
// app.use((req, res, next) => {
//   res.status(404).json({ message: "Route not found" });
// });

// Error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Internal Server Error" });
// });

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
