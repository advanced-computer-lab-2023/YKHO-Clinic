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
  callDeleteHealthPackage,
} = require("./controller/adminController.js");
// request controller
const{createRequest} = require('./controller/requestController');
// patient controller
const{ createPatient, createFamilyMember, readFamilyMembers, readDoctors ,searchDoctors ,filterDoctors,ViewPrescriptions,FilterPrescriptions,patientHome,selectPrescription} = require('./controller/patientController.js')
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
  .connect("mongodb+srv://fuji:Aaa12345@clinic.qyxz3je.mongodb.net/?retryWrites=true&w=majority")
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
app.get("/doctor/AppointmentsFilter",DocFilterAppointments);
app.get("/doctor/Appointments",DocShowAppointments);

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
app.post("/admin/healthPackages/updated", callUpdateHealthPackage);
app.post("/admin/healthPackages/deleted", callDeleteHealthPackage);


//ahmed Patient
app.get("/patient/Prescriptions", ViewPrescriptions);
app.get("/Patient/PrescriptionsFiltered",FilterPrescriptions);
app.get("/patient/Prescriptions/:id",selectPrescription)
app.get("/Patient/Appointments",PatientShowAppointments);
app.get("/Patient/AppointmentsFilter",PatientFilterAppointments);
app.get("/patient/patientHome",patientHome);
// patient
app.post("/guestDoctor",createRequest);
app.post("/guestPatient/createPatient", createPatient);
app.post("patient/readFamilyMembers", createFamilyMember);
app.get("patient/readFamilyMembers", readFamilyMembers);
app.get("/patient/readDoctors", readDoctors);
app.get("/patient/searchDoctors", searchDoctors);
app.get("/patient/filterDoctors", filterDoctors);