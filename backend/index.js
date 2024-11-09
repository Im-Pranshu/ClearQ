import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/getData", (req, res) => {
  res.send("Clear Q");
});

const server = app.listen(5000, () => {
  console.log(`App is running on port ${server.address().port}`);
});
