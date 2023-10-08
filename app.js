const mongoose = require('mongoose')
const express = require('express');
const ejs = require('ejs');
const {createDoctor,goToHome,updateMyInfo,updateThis} = require('./controller/doctorController');
const {createAppointment,showMyPatients,showMyPatientInfo,showUpcomingAppointments} = require('./controller/appointmentController');
const {
  adminLogin,
  adminHome,
  adminRegister,
  createAdmin,
  deleteUser,
  goToDeleteUser,
  goToHealthPackages,
  addHealthPackages,
  updateHealthPackages,
  deleteHealthPackages,
} = require("./controller/adminController.js");

const port = 3000;
const app = express();
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use("/public", express.static('public'))
mongoose
  .connect("mongodb://127.0.0.1/clinic")
  .then(() => console.log("connected to clinicDB"))
  .catch((err) => console.log(err.message));``

const id = "1";

//Doctor

app.post("/addDoctor",createDoctor);
app.post("/addAppointment",createAppointment)
app.get("/doctor/home",goToHome)
app.get("/doctor/patients",showMyPatients);
app.get("/doctor/patients/:id",showMyPatientInfo)
app.get("/doctor/upcomingAppointments",showUpcomingAppointments)
app.get("/doctor/updateInfo",updateMyInfo)
app.post("/doctor/updateInfo",updateThis)

//Admin
app.get("/admin", adminLogin);
app.get("/admin/home", adminHome);
app.get("/admin/register", adminRegister);
app.post("/admin/register/done", createAdmin);
app.get("/admin/home/deleteUser", goToDeleteUser);
app.delete("/admin/home/deleteUser/done", deleteUser);
app.get("/admin/home/HealthPackages", goToHealthPackages);
app.post("/admin/home/healthPackages/done", addHealthPackages);
app.put("/admin/home/healthPackages/done", updateHealthPackages);
app.delete("/admin/home/healthPackages/done", deleteHealthPackages);

 
