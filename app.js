const mongoose = require("mongoose");
const express = require("express");
const MongoURI = "mongodb://127.0.0.1/clinic";
const {createPatient} = require('./controller/patientController');

// app variables
const app = express();
const port = 3000;

// database
mongoose.connect(MongoURI)
  .then(() => console.log("connected to ClinicDB"))
  .catch((err) => console.log(err.message));
  
// server
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });

app.use(express.json());
app.post("/createPatient", createPatient);