const mongoose = require('mongoose')
const express = require('express');
const multer= require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const ejs = require('ejs');
require('dotenv').config()
const cookieParser = require('cookie-parser');
const { requireAuth } = require('./Middleware/authMiddleware');
const {home} = require("./controller/homePage");
const { createDoctor, goToHome, updateMyInfo, updateThis,checkContract, doctorLogin } = require('./controller/doctorController');
const { createAppointment, showMyPatients, showMyPatientInfo, showUpcomingAppointments
  , PatientFilterAppointments, DocFilterAppointments, PatientShowAppointments, DocShowAppointments } = require('./controller/appointmentController');
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
const { createRequest } = require('./controller/requestController');
// patient controller
const { createPatient, createFamilyMember, readFamilyMembers, readDoctors, searchDoctors, filterDoctors, ViewPrescriptions, FilterPrescriptions,patientHome,selectPrescription, selectDoctor,showMedicalHistory,addMedicalHistory } = require('./controller/patientController.js')
const port = 3000;
const MONGO_URI = process.env.MONGO_URI;
const app = express();
app.use(cookieParser());
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use("/public", express.static('public'))
mongoose  
  .connect(MONGO_URI)
  .then(() => console.log("connected to clinicDB"))
  .catch((err) => console.log(err.message));

const id = "1"; 

app.get("/",home);
//Doctor
app.post("/addDoctor",createDoctor);
app.post("/addAppointment",createAppointment)
app.get("/doctor/login", doctorLogin);
app.get("/doctor/home",checkContract,goToHome)
app.get("/doctor/patients",checkContract,showMyPatients);
app.get("/doctor/patients/:id",checkContract,showMyPatientInfo)
app.get("/doctor/upcomingAppointments",checkContract,showUpcomingAppointments)
app.get("/doctor/updateInfo",checkContract,updateMyInfo)
app.post("/doctor/updateInfo",checkContract,updateThis)
app.get("/doctor/AppointmentsFilter",checkContract,DocFilterAppointments);
app.get("/doctor/Appointments",checkContract,DocShowAppointments);
app.get("/doctor/contract",checkContract); 

//Admin
app.get("/admin/login", goToAdminLogin);
app.get("/admin/home", adminLogin);
app.get("/admin/uploadedInfo", goToUploadedInfo);
app.get("/admin/register", adminRegister);
app.post("/admin/register", createAdmin);
app.get("/admin/deleteUser", goToDeleteUser);
app.post("/admin/deleteUser", deleteUser);
app.get("/admin/HealthPackages", goToHealthPackages);
app.post("/admin/healthPackages", addHealthPackages);
app.post("/admin/healthPackages/updated", callUpdateHealthPackage);
app.post("/admin/healthPackages/deleted", callDeleteHealthPackage);

//ahmed Patient
app.get("/patient/Prescriptions", ViewPrescriptions);
app.get("/Patient/PrescriptionsFiltered", FilterPrescriptions);
app.get("/patient/Prescriptions/:id",selectPrescription)
app.get("/Patient/Appointments", PatientShowAppointments);
app.get("/Patient/AppointmentsFilter", PatientFilterAppointments);
app.get("/patient/patientHome",patientHome);
app.get("/patient/medicalHistory",showMedicalHistory);
app.post("/patient/addMedicalHistory",upload.single("files"),addMedicalHistory);

// register 
app.get('/guest/patient', function (req,res)  { 
  res.render('patient/register')
});
app.get('/guest/doctor', function (req,res)  {
  res.render('doctor/register')
});
app.post('/request/createRequest',upload.array("files"), createRequest );
// patient
app.get('/patient/createFamilyMember', function (req,res)  {
  res.render('patient/addFamily');
});

app.post("/patient/createPatient", createPatient);
app.post("/patient/createFamilyMember", createFamilyMember);
app.get("/patient/readFamilyMembers", readFamilyMembers);
//app.get("/patient/readDoctors", readDoctors);
app.get('/patient/home', readDoctors );
app.get("/patient/searchDoctors", searchDoctors);
app.get("/patient/filterDoctors", filterDoctors);
app.get("/patient/doctors/:id",selectDoctor)