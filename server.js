const cors = require("cors");
const express = require("express");
const app = express();

global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

const initRoutes = require("./src/routes");

app.use(express.urlencoded({ extended: true })); //recognize the incoming Request Object as strings or arrays. 
initRoutes(app);

// app.get('/api/transactions', cors(), (req, res) => {
//   const customers = [
//     {id: 1, firstName: 'John', lastName: 'Doe'},
//     {id: 2, firstName: 'Brad', lastName: 'Traversy'},
//     {id: 3, firstName: 'Mary', lastName: 'Swanson'},
//   ];

//   res.json(customers);
// });

// app.get('/api/sendmesomeresponse/', cors(), (req, res) => {
//   res.sendFile((__dirname + '/README.md'))
// });

// app.post('/api/transaction/', cors(), (req, res) => {
//   var {id, transactionId, contract } = req.params

// });



const port = 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));