const mongoose = require('mongoose')
const express = require('express');
const ejs = require('ejs');
const {home} = require("./controller/homePage");
const {createDoctor,goToHome,updateMyInfo,updateThis} = require('./controller/doctorController');
const {createAppointment,showMyPatients,showMyPatientInfo,showUpcomingAppointments
  ,PatientFilterAppointments,DocFilterAppointments,PatientShowAppointments,DocShowAppointments} = require('./controller/appointmentController');
const {
  goToAdminLogin,
  adminLogin,
  adminRegister,
  createAdmin,
  deleteUser,
  goToUploadedInfo,
  goToDeleteUser,
  goToHealthPackages,
  addHealthPackages,
  callUpdateHealthPackage,
  deleteHealthPackages,
} = require("./controller/adminController.js");
const {ViewPrescriptions,FilterPrescriptions}= require('./controller/patientController');
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

app.get("/",home);
//Doctor
app.post("/addDoctor",createDoctor);
app.post("/addAppointment",createAppointment)
app.get("/doctor/home",goToHome)
app.get("/doctor/patients",showMyPatients);
app.get("/doctor/patients/:id",showMyPatientInfo)
app.get("/doctor/upcomingAppointments",showUpcomingAppointments)
app.get("/doctor/updateInfo",updateMyInfo)
app.post("/doctor/updateInfo",updateThis)
app.get("/doctor/Appointments",DocShowAppointments);
app.get("/doctor/AppointmentsFilter",DocFilterAppointments);

//Admin
app.get("/admin/login", goToAdminLogin);
app.post("/admin/home", adminLogin);
app.get("/admin/uploadedInfo", goToUploadedInfo);
app.get("/admin/register", adminRegister);
app.post("/admin/register/done", createAdmin);
app.get("/admin/deleteUser", goToDeleteUser);
app.post("/admin/deleteUser/done", deleteUser);
app.get("/admin/HealthPackages", goToHealthPackages);
app.post("/admin/healthPackages", addHealthPackages);
app.post("/admin/healthPackages/done", callUpdateHealthPackage);
app.delete("/admin/healthPackages/done", deleteHealthPackages);


//ahmed Patient
app.get("/Patient/Prescriptions", ViewPrescriptions);
app.get("/Patient/PrescriptionsFiltered",FilterPrescriptions);
app.get("/Patient/Appointments",PatientShowAppointments);
app.get("/Patient/AppointmentsFilter",PatientFilterAppointments);

