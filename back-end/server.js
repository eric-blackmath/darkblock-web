const cors = require("cors");
const express = require("express");
const app = express();

global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors());

const initRoutes = require("./routes");

//recognize the incoming Request Object as strings or arrays.
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

initRoutes(app);
const port = 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

console.log("Yay! we separated the back-end");
