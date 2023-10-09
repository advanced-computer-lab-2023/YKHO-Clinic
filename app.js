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
  goToDeleteUser,
  goToHealthPackages,
  addHealthPackages,
  updateHealthPackages,
  deleteHealthPackages,
} = require("./controller/adminController.js");
// request controller
const{createRequest} = require('./controller/requestController');
// patient controller
const{ createPatient, createFamilyMember, readFamilyMembers, readDoctors ,searchDoctors ,filterDoctors} = require('./controller/patientController.js')
const port = 3000;
const app = express();
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
app.use(express.json());


mongoose
  .connect("mongodb://127.0.0.1/clinic")
  .then(() => console.log("connected to clinicDB"))
  .catch((err) => console.log(err.message));``

const id = "1";

//Doctor

app.post("/addDoctor",createDoctor);
app.post("/addAppointment",createAppointment)
app.get("/Doctor/patients",showMyPatients);
app.get("/Doctor/patients/:id",showMyPatientInfo)
app.get("/Doctor/upcomingAppointments",showUpcomingAppointments)

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

// patient
app.post("/guestDoctor",createRequest);
app.post("/guestPatient/createPatient", createPatient);
app.get("patient/readFamilyMembers", readFamilyMembers);
app.get("/patient/readDoctors", readDoctors);
app.get("/patient/searchDoctors", searchDoctors);
app.get("/patient/filterDoctors", filterDoctors);