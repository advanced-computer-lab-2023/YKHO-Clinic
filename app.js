const mongoose = require('mongoose')
const express = require('express');
const createDoctor = require('./controller/doctorController');
const {createAppointment,showMyPatients,showMyPatientInfo,showUpcomingAppointments} = require('./controller/appointmentController');
const {
  adminLogin,
  adminHome,
  adminRegister,
  createAdmin,
  deleteUser,
  goToDeletePatient,
  goToDeleteDoctor,
  goToHealthPackages,
  addHealthPackages,
  updateHealthPackages,
  deleteHealthPackages,
} = require("./controller/adminController.js");


const port = 3000;
const app= express();
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

mongoose
  .connect("mongodb://127.0.0.1/clinic")
  .then(() => console.log("connected to clinicDB"))
  .catch((err) => console.log(err.message));

const id ="1"

app.use(express.json());


//Doctor
app.post("/addDoctor",createDoctor);
app.post("/addAppointment",createAppointment)
app.get("/Doctor/patients",showMyPatients);
app.get("/Doctor/patients/:id",showMyPatientInfo)
app.get("/Doctor/upcomingAppointments",showUpcomingAppointments)

//Admin
app.get("view/admin", adminLogin);
app.get("view/admin/home", adminHome);
app.get("view/admin/register", adminRegister);
app.get("view/admin/home/deleteUser", goToDeleteUser);
app.get("view/admin/home/HealthPackages", goToHealthPackages);
app.post("view/admin/register/done", createAdmin);
app.post("view/admin/home/healthPackages/done", addHealthPackages);
app.put("view/admin/home/healthPackages/done", updateHealthPackages);
app.delete("view/admin/home/healthPackages/done", deleteHealthPackages);
app.delete("view/admin/home/deleteUser/done", deleteUser);

