const mongoose = require("mongoose");
const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const ejs = require("ejs");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { requireAuth } = require("./Middleware/authMiddleware");
const { home } = require("./controller/homePage");
const {
  docViewWallet,
  createDoctor,
  goToHome,
  updateMyInfo,
  updateThis,
  checkContract,
  uploadHealthRecord,
  createTimeSlot,
  showTimeSlots,deleteTimeSlot,showFollowUp,createFollowUp,
} = require("./controller/doctorController");
const {
  createAppointment,
  showMyPatients,
  showMyPatientInfo,
  showUpcomingAppointments,
  PatientFilterAppointments,
  DocFilterAppointments,
  PatientShowAppointments,
  DocShowAppointments,
} = require("./controller/appointmentController");
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
  logout,
  changePasswordAdmin,
  Login,
  acceptRequest,
  rejectRequest,
  sendOTP,
  forgetPassword,
  goToNewPassword,
} = require("./controller/adminController.js");
// request controller
const { createRequest } = require("./controller/requestController");
// patient controller
const {
  createPatient,
  createFamilyMember,
 PayByCredit,PayByWallet, readFamilyMembers,
  readDoctors,
  searchDoctors,
  filterDoctors,
  ViewPrescriptions,
  FilterPrescriptions,
  patientHome,
  selectPrescription,
  selectDoctor,
  viewHealthRecords,
  showMedicalHistory,
  addMedicalHistory,
  showFile,
  deleteMedicalHistory,
  LinkFamilyMemeber,
  LinkF,
  ViewWallet,
  fail,success,
  showSlots,
  reserveSlot,
  showSlotsFam,
  reserveSlotFam,
} = require("./controller/patientController.js");
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
app.use("/public", express.static("public"));
mongoose
  .connect(
    MONGO_URI
  )
  .then(() => console.log("connected to clinicDB at " + MONGO_URI))
  .catch((err) => console.log(err.message));

const id = "1";

app.get("/",  home);
app.post("/login", Login);
app.get("/home", logout);
app.post("/forgetPassword/enterUsername", (req, res) => {res.render("forgetPassword/enterUsername", { message: "" })});
app.get("/forgetPassword/enterOTP", sendOTP);//send otp to mail and pass otp to the function
app.get("/forgetPassword/enterNewPassword", goToNewPassword);
app.post("/forgetPassword/done", forgetPassword);

//Doctor
app.post("/addDoctor", createDoctor); 
app.post("/addAppointment", createAppointment);
app.get("/doctor/home", requireAuth, checkContract, goToHome);
app.get("/doctor/patients", requireAuth, checkContract, showMyPatients);
app.get("/doctor/patients/:id", requireAuth, checkContract, showMyPatientInfo);
app.get("/doctor/upcomingAppointments", requireAuth, checkContract, showUpcomingAppointments);
app.get("/doctor/updateInfo", requireAuth, checkContract, updateMyInfo);
app.post("/doctor/updateInfo", requireAuth, checkContract, updateThis);
app.get("/doctor/AppointmentsFilter", requireAuth, checkContract, DocFilterAppointments
);
app.get("/doctor/Appointments", requireAuth, checkContract, DocShowAppointments);
app.get("/doctor/contract", requireAuth, checkContract);
app.post("/doctor/patients/:id/upload-pdf", requireAuth, checkContract, upload.single("healthRecords"), uploadHealthRecord);
app.get("/doctor/timeSlots", requireAuth, checkContract, showTimeSlots);
app.post("/doctor/addTimeSlot", requireAuth, checkContract, createTimeSlot);
app.get("/doctor/deleteTimeSlot/:id",requireAuth,checkContract,deleteTimeSlot);
app.get("/doctor/schedFollowUp/:id",requireAuth,checkContract,showFollowUp);
app.get("/doctor/reserve/:id",requireAuth,checkContract,createFollowUp);
app.get("/doctor/Wallet",requireAuth,docViewWallet);
//Admin
app.put("/admin/changePassword", requireAuth, changePasswordAdmin);
app.get("/admin/uploadedInfo", requireAuth, goToUploadedInfo);
app.put("/admin/changePassword", requireAuth, changePasswordAdmin);
app.get("/admin/uploadedInfo", requireAuth, goToUploadedInfo);
app.get("/admin/acceptRequest", acceptRequest);
app.get("/admin/rejectRequest", rejectRequest);
app.get("/admin/register",  requireAuth, adminRegister);
app.post("/admin/register", requireAuth,  createAdmin);
app.get("/admin/deleteUser", requireAuth,  goToDeleteUser);
app.post("/admin/deleteUser", requireAuth,  deleteUser);
app.get("/admin/HealthPackages", requireAuth,  goToHealthPackages);
app.post("/admin/healthPackages",  requireAuth, addHealthPackages);
app.post("/admin/healthPackages/updated",  requireAuth, callUpdateHealthPackage);
app.post("/admin/healthPackages/deleted", requireAuth,  callDeleteHealthPackage);

//ahmed Patient
app.get("/patient/Prescriptions", requireAuth, ViewPrescriptions);
app.get("/Patient/PrescriptionsFiltered", requireAuth, FilterPrescriptions);
app.get("/patient/Prescriptions/:id", requireAuth, selectPrescription);
app.get("/Patient/Appointments", requireAuth, PatientShowAppointments);
app.get("/Patient/AppointmentsFilter", requireAuth, PatientFilterAppointments);
app.get("/patient/patientHome", requireAuth, patientHome);
app.get("/patient/HealthRecords", requireAuth, viewHealthRecords);
app.get("/patient/medicalHistory", showMedicalHistory);
app.post("/patient/addMedicalHistory", requireAuth, upload.single("files"), addMedicalHistory);
app.get("/files/:fileId", requireAuth, showFile);
app.post( "/patient/deleteMedicalHistory/:id", requireAuth, deleteMedicalHistory);
// register
app.get("/guest/patient", function (req, res) {
  res.render("patient/register")});
app.get("/patient/Prescriptions", requireAuth, ViewPrescriptions);
app.get("/Patient/PrescriptionsFiltered", requireAuth, FilterPrescriptions);
app.get("/patient/Prescriptions/:id", requireAuth, selectPrescription);
app.get("/Patient/Appointments", requireAuth, PatientShowAppointments);
app.get("/Patient/AppointmentsFilter", requireAuth, PatientFilterAppointments);
app.get("/patient/patientHome", requireAuth, patientHome);
app.get("/patient/HealthRecords", requireAuth, viewHealthRecords);
app.get("/patient/medicalHistory", showMedicalHistory);
app.post("/patient/addMedicalHistory", requireAuth, upload.single("files"), addMedicalHistory);
app.get("/files/:fileId", requireAuth, showFile);
app.post( "/patient/deleteMedicalHistory/:id", requireAuth, deleteMedicalHistory);
// register
app.get("/guest/patient", function (req, res) {
  res.render("patient/register"); 
});
app.get("/guest/doctor", function (req, res) { 
  res.render("doctor/register", { message: "" })});

app.post("/request/createRequest", upload.array("files"), createRequest);

// patient
app.get("/patient/createFamilyMember", function (req, res) {
  res.render("patient/addFamily")});


app.post("/patient/createPatient", createPatient);
app.post("/patient/createFamilyMember", requireAuth, createFamilyMember);
app.get("/patient/readFamilyMembers", requireAuth, readFamilyMembers);
app.get("/patient/LinkFamily", requireAuth, LinkF);
app.get("/patient/Linked",requireAuth, LinkFamilyMemeber);
app.get("/patient/home", requireAuth, readDoctors);
app.get("/patient/searchDoctors", requireAuth, searchDoctors);
app.get("/patient/filterDoctors", requireAuth, filterDoctors);
app.get("/patient/doctors/:id", requireAuth, selectDoctor);
app.get("/patient/paymentcredit/:id",requireAuth,PayByCredit);
app.get("/patient/paymentWallet/:id",requireAuth,PayByWallet);
app.get("/patient/Wallet",requireAuth,ViewWallet);
app.get("/success/:id",requireAuth,success);
app.get("/fail",requireAuth,fail);
app.get("/patient/doctors/:id/showSlots", requireAuth, showSlots);
app.get("/patient/doctors/:id/reserve", requireAuth, reserveSlot);
app.get("/patient/doctors/:id/showSlots/familyMember", requireAuth, showSlotsFam);
app.get("/patient/doctors/:id/familyMember/reserve", requireAuth, reserveSlotFam);


// elgharieb S2
const readSubscription = require("./controller/patientController").readSubscription;
app.get("/patient/readSubscription",requireAuth, readSubscription)
const readFamilyMembersSubscriptions = require("./controller/patientController").readFamilyMembersSubscriptions;
app.get("/patient/readFamilyMembersSubscriptions",requireAuth, readFamilyMembersSubscriptions)
const readHealthPackage = require("./controller/patientController").readHealthPackage;
app.get("/patient/readHealthPackage/:healthPackage",requireAuth, readHealthPackage)
const readHealthPackages = require("./controller/patientController").readHealthPackages;
app.get("/patient/readHealthPackages/:nationalID",requireAuth, readHealthPackages)
const subscribe = require("./controller/patientController").subscribe;
app.post("/patient/subscribe/:healthPackage",requireAuth, subscribe)
const subscribeFamilyMember  = require("./controller/patientController").subscribeFamilyMember;
app.post("/patient/subscribeFamilyMember/:healthPackage",requireAuth, subscribeFamilyMember)
const deleteSubscription = require("./controller/patientController").deleteSubscription;
app.get("/patient/deleteSubscription",requireAuth, deleteSubscription)
const deleteFamilyMemberSubscription = require("./controller/patientController").deleteFamilyMemberSubscription;
app.post("/patient/deleteFamilyMemberSubscription",requireAuth, deleteFamilyMemberSubscription)

const subscriptionSuccessful = require("./controller/patientController").subscriptionSuccessful;
app.get("/subscriptionSuccessful/:healthPackage/:i",requireAuth, subscriptionSuccessful)