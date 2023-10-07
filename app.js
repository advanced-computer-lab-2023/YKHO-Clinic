const mongoose = require('mongoose')
const express = require('express');
const app= express();
const id ="1"
const port = 3000;
const createDoctor = require('./controller/doctorController');
const {createAppointment,showMyPatients} = require('./controller/appointmentController');
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
app.use(express.json());
mongoose
  .connect("mongodb://127.0.0.1/clinic")
  .then(() => console.log("connected to clinicDB"))
  .catch((err) => console.log(err.message));
app.post("/addDoctor",createDoctor);
app.post("/addAppointment",createAppointment)
app.get("/Doctor/patients",showMyPatients)