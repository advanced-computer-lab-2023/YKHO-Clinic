const mongoose = require("mongoose");
const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const ejs = require("ejs");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { requireAuthPatient,requireAuthAdmin,requireAuthDoctor,requireAuth } = require("./Middleware/authMiddleware");
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
  showHealthRecord,
  loggedIn,
  getName,
  ViewPrescriptionsDoc,

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
  showDoctorRecord,
  getRequests,
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
  readUserData,
  getPatientPlan,
  getFamilyMembersPlan,
  getMyAppointments,
  PayByCreditPresc,PayByWalletPresc,successPresc,failPresc,
  viewAllDataOfPrescriptions,
} = require("./controller/patientController.js");
const cors=require('cors')

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
app.use(cors( {origin:"http://localhost:5173",credentials: true}));
const id = "1";

app.get("/",  home);
app.post("/login", Login);
app.get("/home", logout);
app.get("/logout",requireAuth,logout);
app.get("/loggedIn",requireAuth,loggedIn);
app.post("/forgetPassword/enterUsername", (req, res) => {res.render("forgetPassword/enterUsername", { message: "" })});
app.get("/forgetPassword/enterOTP", sendOTP);//send otp to mail and pass otp to the function
app.get("/forgetPassword/enterNewPassword", goToNewPassword);
app.post("/forgetPassword/done", forgetPassword);

//Doctor
app.post("/addDoctor", createDoctor); 
app.post("/addAppointment", requireAuthDoctor , createAppointment);
app.get("/doctor/home", requireAuthDoctor, goToHome);
app.get("/doctor/patients", requireAuthDoctor, showMyPatients);
app.get("/doctor/patients/:id", requireAuthDoctor, showMyPatientInfo);
app.get("/doctor/upcomingAppointments", requireAuthDoctor, showUpcomingAppointments);
app.get("/doctor/updateInfo", requireAuthDoctor, updateMyInfo);
app.post("/doctor/updateInfo", requireAuthDoctor, updateThis);
app.get("/doctor/AppointmentsFilter", requireAuthDoctor, DocFilterAppointments);
app.get("/doctor/Appointments", requireAuthDoctor, DocShowAppointments);
app.get("/doctor/contract", requireAuthDoctor, checkContract);
app.post("/doctor/patients/:id/upload-pdf", requireAuthDoctor, upload.single("healthRecords"), uploadHealthRecord);
app.get("/doctor/timeSlots", requireAuthDoctor, showTimeSlots);
app.post("/doctor/addTimeSlot", requireAuthDoctor, createTimeSlot);
app.get("/doctor/deleteTimeSlot/:id",requireAuthDoctor, deleteTimeSlot);
app.get("/doctor/schedFollowUp/:id/:date",requireAuthDoctor,showFollowUp);
app.post("/doctor/reserve/:id",requireAuthDoctor, createFollowUp);
app.get("/doctor/patients/:id/:healthId", requireAuthDoctor, showHealthRecord);
app.get("/doctor/Wallet",requireAuthDoctor,docViewWallet);
app.get("/doctor/Prescriptions", requireAuthDoctor, ViewPrescriptionsDoc);
app.get("/loggedIn",requireAuth,loggedIn);
app.get("/doctor/name",requireAuthDoctor,getName);
//Admin
app.put("/admin/changePassword", requireAuthAdmin, changePasswordAdmin);
app.get("/admin/uploadedInfo", requireAuthAdmin, goToUploadedInfo);
app.get("/getRequests", requireAuthAdmin, getRequests);
app.put("/admin/changePassword", requireAuthAdmin, changePasswordAdmin);
app.get("/admin/uploadedInfo", requireAuthAdmin, goToUploadedInfo);
app.get("/admin/uploadedInfo/:id/:file", requireAuthAdmin, showDoctorRecord);
app.post("/admin/acceptRequest", requireAuthAdmin,acceptRequest);
app.post("/admin/rejectRequest", requireAuthAdmin,rejectRequest);
app.get("/admin/register",  requireAuthAdmin, adminRegister);
app.get("/admin/home",requireAuth,goToHome);
app.post("/admin/register", requireAuthAdmin,  createAdmin);
app.get("/admin/deleteUser", requireAuthAdmin,  goToDeleteUser);
app.post("/admin/deleteUser", requireAuthAdmin,  deleteUser);
app.get("/admin/HealthPackages", requireAuthAdmin,  goToHealthPackages);
app.post("/admin/healthPackages",  requireAuthAdmin, addHealthPackages);
app.post("/admin/healthPackages/updated",  requireAuthAdmin, callUpdateHealthPackage);
app.post("/admin/healthPackages/deleted", requireAuthAdmin,  callDeleteHealthPackage);

//ahmed Patient
app.get("/patient/Prescriptions", requireAuthPatient, ViewPrescriptions);
app.get("/Patient/PrescriptionsFiltered", requireAuthPatient, FilterPrescriptions);
app.get("/patient/Prescriptions/:id", requireAuthPatient, selectPrescription);
app.get("/Patient/Appointments", requireAuthPatient, PatientShowAppointments);
app.get("/Patient/AppointmentsFilter", requireAuthPatient, PatientFilterAppointments);
app.get("/patient/patientHome", requireAuthPatient, patientHome);
app.get("/patient/HealthRecords", requireAuthPatient, viewHealthRecords);
app.get("/patient/medicalHistory",requireAuthPatient, showMedicalHistory);
app.post("/patient/addMedicalHistory", requireAuthPatient, upload.single("files"), addMedicalHistory);
app.get("/files/:fileId", requireAuthPatient, showFile);
app.post( "/patient/deleteMedicalHistory/:id", requireAuthPatient, deleteMedicalHistory);
// register
app.get("/guest/patient", function (req, res) {
  res.render("patient/register", {message:""})});
app.get("/patient/Prescriptions", requireAuthPatient, ViewPrescriptions);
app.get("/Patient/PrescriptionsFiltered", requireAuthPatient, FilterPrescriptions);
app.get("/patient/Prescriptions/:id", requireAuthPatient, selectPrescription);
app.get("/Patient/Appointments", requireAuthPatient, PatientShowAppointments);
app.get("/Patient/AppointmentsFilter", requireAuthPatient, PatientFilterAppointments);
app.get("/patient/patientHome", requireAuthPatient, patientHome);
app.get("/patient/HealthRecords", requireAuthPatient, viewHealthRecords);
app.get("/patient/medicalHistory", requireAuthPatient,showMedicalHistory);
app.post("/patient/addMedicalHistory", requireAuthPatient, upload.single("files"), addMedicalHistory);
app.get("/files/:fileId", requireAuthPatient, showFile);
app.post( "/patient/deleteMedicalHistory/:id", requireAuthPatient, deleteMedicalHistory);
// register
app.get("/guest/patient", function (req, res) {
  res.render("patient/register"); 
});
app.get("/guest/doctor", function (req, res) { 
  res.render("doctor/register", { message: "" })});

app.post("/request/createRequest", upload.array("files"), createRequest);

// patient
app.get("/patient/createFamilyMember", requireAuthPatient,function (req, res) {
  res.render("patient/addFamily")});


app.post("/patient/createPatient", createPatient);
app.post("/patient/createFamilyMember", requireAuthPatient, createFamilyMember);
app.get("/patient/readFamilyMembers", requireAuthPatient, readFamilyMembers);
app.get("/patient/LinkFamily", requireAuthPatient, LinkF);
app.get("/patient/Linked",requireAuthPatient, LinkFamilyMemeber);
//app.get("/patient/home", requireAuthPatient, readDoctors);
app.get("/patient/home", requireAuthPatient, readUserData);
app.get("/patient/searchDoctors", requireAuthPatient, searchDoctors);
app.get("/patient/filterDoctors", requireAuthPatient, filterDoctors);
app.get("/patient/doctors/:id", requireAuthPatient, selectDoctor);
app.get("/patient/paymentcredit/:id",requireAuthPatient,PayByCredit);
app.get("/patient/paymentWallet/:id",requireAuthPatient,PayByWallet);
app.get("/patient/Wallet",requireAuthPatient,ViewWallet);
app.get("/success/:id",requireAuth,success);
app.get("/fail",requireAuth,fail);
app.get("/patient/doctors/:id/showSlots", requireAuthPatient, showSlots);
app.get("/patient/doctors/:id/reserve", requireAuthPatient, reserveSlot);
app.get("/patient/doctors/:id/showSlots/familyMember", requireAuthPatient, showSlotsFam);
app.get("/patient/doctors/:id/familyMember/reserve", requireAuthPatient, reserveSlotFam);
app.get("/patient/plan", requireAuthPatient, getPatientPlan);
app.get("/patient/familyMembersPlans", requireAuthPatient, getFamilyMembersPlan);
app.get("/patient/appointmentsCards", requireAuthPatient, getMyAppointments);
app.get("/patient/AllPresecrptionsInfo", requireAuthPatient, viewAllDataOfPrescriptions);
// elgharieb S2
const readSubscription = require("./controller/patientController").readSubscription;
app.get("/patient/readSubscription",requireAuthPatient, readSubscription)
const readFamilyMembersSubscriptions = require("./controller/patientController").readFamilyMembersSubscriptions;
app.get("/patient/readFamilyMembersSubscriptions",requireAuthPatient, readFamilyMembersSubscriptions)
const readHealthPackage = require("./controller/patientController").readHealthPackage;
app.get("/patient/readHealthPackage/:healthPackage",requireAuthPatient, readHealthPackage)
const readHealthPackages = require("./controller/patientController").readHealthPackages;
app.get("/patient/readHealthPackages/:nationalID",requireAuthPatient, readHealthPackages)
const subscribe = require("./controller/patientController").subscribe;
app.post("/patient/subscribe/:healthPackage",requireAuthPatient, subscribe)
const subscribeFamilyMember  = require("./controller/patientController").subscribeFamilyMember;
app.post("/patient/subscribeFamilyMember/:healthPackage",requireAuthPatient, subscribeFamilyMember)
const deleteSubscription = require("./controller/patientController").deleteSubscription;
app.get("/patient/deleteSubscription",requireAuthPatient, deleteSubscription)
const deleteFamilyMemberSubscription = require("./controller/patientController").deleteFamilyMemberSubscription;
app.post("/patient/deleteFamilyMemberSubscription",requireAuthPatient, deleteFamilyMemberSubscription)

app.get("/patient/paymentcreditpresc/:id",requireAuthPatient,PayByCreditPresc);
app.get("/patient/paymentWalletpresc/:id",requireAuthPatient,PayByWalletPresc);
app.get("/successPresc/:id",requireAuth,successPresc);
app.get("/failPresc",requireAuth,failPresc);

const subscriptionSuccessful = require("./controller/patientController").subscriptionSuccessful;
app.get("/subscriptionSuccessful/:healthPackage/:i",requireAuthPatient, subscriptionSuccessful)