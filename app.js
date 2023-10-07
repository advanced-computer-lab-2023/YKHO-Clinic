const mongoose = require('mongoose')
const express = require('express');
const createDoctor = require('./controller/doctorController');
const {createAppointment,showMyPatients} = require('./controller/appointmentController');

const app= express();
const port = 3000;
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

mongoose
  .connect("mongodb://127.0.0.1/clinic")
  .then(() => console.log("connected to clinicDB"))
  .catch((err) => console.log(err.message));

const id ="1"

app.use(express.json());
app.post("/addDoctor",createDoctor);
app.post("/addAppointment",createAppointment)
app.get("/Doctor/patients",showMyPatients)