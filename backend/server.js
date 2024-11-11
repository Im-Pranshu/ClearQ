import express from "express";
import { json as bodyParser } from "express";

const app = express();
const port = 3000;

// for accepting post form data
app.use(bodyParser());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
