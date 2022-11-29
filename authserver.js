require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 80;

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

const uri = 'mongodb://localhost:27017';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("connection established successfully");
});

const userRouter = require("./routes/user");
const testRouter = require("./routes/test");
app.use("/api/user", userRouter);
app.use("/api/test", testRouter);

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.use(express.static("client/build"));

  app.all("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
  console.log('production ready!')
}

app.listen(port,"0.0.0.0", console.log(`listis at port ${port}`));
