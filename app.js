const mongoose = require("mongoose");
const express = require("express");
const app = express();

mongoose
  .connect("mongodb://127.0.0.1/Clinic")
  .then(() => console.log("connected to ClinicDB"))
  .catch((err) => console.log(err.message));

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
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
app.use(express.json());

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
