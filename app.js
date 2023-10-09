const mongoose = require('mongoose')
const express = require('express');
const ejs = require('ejs');
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
  updateHealthPackages,
  deleteHealthPackages,
} = require("./controller/adminController.js");
// request controller
const{createRequest} = require('./controller/requestController');
// patient controller
const{ createPatient, createFamilyMember, readFamilyMembers, readDoctors ,searchDoctors ,filterDoctors,ViewPrescriptions,FilterPrescriptions} = require('./controller/patientController.js')
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
app.post("/admin/healthPackages/done", addHealthPackages);
app.put("/admin/healthPackages/done", updateHealthPackages);
app.delete("/admin/healthPackages/done", deleteHealthPackages);


//ahmed Patient
app.get("/Patient/Prescriptions", ViewPrescriptions);
app.get("/Patient/PrescriptionsFiltered",FilterPrescriptions);
app.get("/Patient/Appointments",PatientShowAppointments);
app.get("/Patient/AppointmentsFilter",PatientFilterAppointments);

// patient
app.post("/guestDoctor",createRequest);
app.post("/guestPatient/createPatient", createPatient);
app.post("patient/readFamilyMembers", createFamilyMember);
app.get("patient/readFamilyMembers", readFamilyMembers);
app.get("/patient/readDoctors", readDoctors);
app.get("/patient/searchDoctors", searchDoctors);
app.get("/patient/filterDoctors", filterDoctors);