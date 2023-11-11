const patientModel = require('../model/patient');
const doctorModel = require('../model/doctor').doctor;
const timeSlot = require('../model/timeSlots').timeSlot;
const {appointment} = require('../model/appointments');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { isStrongPassword } = require("./adminController.js");
const healthPackageModel = require('../model/healthPackage').healthPackage;
//const { date } = require('joi');
const appointmentModel = require('../model/appointments').appointment;
const { prescription } = require('../model/prescription');
const maxAge = 3 * 24 * 60 * 60;
const createToken = (name) => {
  return jwt.sign({ name }, process.env.SECRET, {
    expiresIn: maxAge,
  });
};
/*
const test = {
    "_id": "606aa80e929a618584d2758b",
    "name": "kika",
    "gender": "female",
    "mobileNumber": "01224764545",
    "dob": {
        "$date": "2001-09-30T22:00:00.000Z"
    },
    "emergency": {
        "name": "rawez",
        "mobileNumber": "01280730418"
    },
    "healthPackage": "kikamima"
};
*/
let decodedCookie;
let patient; 
let doctors;

const createPatient = async (req, res) => {
    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().required(),
        name: Joi.string().required(),
        DOB: Joi.date().iso().required(),
        gender: Joi.string().valid('male', 'female', 'other').required(),
        email: Joi.string().email().required(),
        mobile: Joi.string().pattern(new RegExp("^\\d{11}$")).required(),
        emergencyName: Joi.string().required(),
        emergencyMobile: Joi.string().required()
    });
    // joi validation
    const { username, password, name, DOB, gender, email, mobile, emergencyName, emergencyMobile } = req.body;

    const { error, value } = schema.validate(req.body);

    if (error) { 
        // If validation fails, send a response with the validation error
        return res.status(400).json({ error: error.details[0].message });
    }

    if(isStrongPassword(req.body.password) === false){
        console.log("WEAK PASSWORD");
        return res.render("patient/register", {message:"password is weak"});
    }
    const emergency = {
        name: emergencyName,
        mobile: emergencyMobile
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    let entry = new patientModel({
        username, password:hashedPassword, name, DOB, gender, email, mobile, emergency
    });

    entry = await entry.save();
    doctors = await doctorModel.find().sort({ name: 1 });
    const token = createToken(entry);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });
    let results = await helper(doctors);
    res.status(201).render('patient/home', {results,one:true});
}

const patientLogout = (req, res) => {
    res.clearCookie('jwt').send(200,"Logged out successfully");
    res.render("/");
}

const changePasswordPatient = async (req, res) => {

    if ( req.body.oldPassword === "" || req.body.newPassword === "" || req.body.confirmationPassword === "") {
      res.status(404).json({ message: "Fill the empty fields" });
    }
  
    const user = await patientModel.findOne({
      username: req.user.username,
    });

    if (user && (await bcrypt.compare(req.body.oldPassword, user.password))) {
      if (req.body.newPassword != req.body.confirmationPassword) {
        return res.status(404).json({ message: "Passwords dont not match" });
      }
  
      if (isStrongPassword(req.body.newPassword) === false) {
        return res.status(404).json({ message: "Password is weak" });
      }
  
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
      await patientModel.findOneAndUpdate(
        { username: decodedCookie.name },
        { password: hashedPassword }
      );
      return res.status(200).json({ message: "Password changed successfully" });
    } else {
      return res
        .status(404)
        .json({ message: "Password not changed successfully" });
    }
};

const createFamilyMember = async (req, res) => {
    // joi validation
    const { name, nationalID, age, gender, relation } = req.body;

    let familyMember = {
        name,
        nationalID,
        age,
        gender,
        relation,
    };

    patient.familyMembers.push(familyMember);
    patient = await patient.save();
    results = patient.familyMembers
    res.status(201).render('patient/family', {results});
};

const readFamilyMembers = async (req, res) => {
    patient=patientModel.findOne({_id:req.user._id});
    let results = patient.familyMembers;
    if(results==null){
        results=[];
    }
    res.status(201).render('patient/family', {results});
}

// helper
async function helper(doctors, req) {
    patient = req.user;
    
    let discount = 1;
    if (patient.healthPackage && patient.healthPackage != "none") {
        let healthPackage = await healthPackageModel.findOne({ packageName: patient.healthPackage });
        discount = healthPackage.doctorDiscount;
        discount = (100 - discount) / 100;
    }
    let results = doctors.map(({ _id, name, speciality, rate }) => ({ _id, name, speciality, sessionPrice: rate * 1.1 * discount }));
    return results;
}

const readDoctors = async (req, res) => {
    doctors = await doctorModel.find().sort({ name: 1 });
    let results = await helper(doctors,req);
    res.status(201).render('patient/home', { results, one: true });
}

// helper
function isEmpty(input) {
    return !/[a-z]/i.test(input);
}

const searchDoctors = async (req, res) => {
    //let presentSpecialities = doctorModel.schema.path('speciality').enumValues;
    doctors = await doctorModel.find().sort({ name: 1 });
    let searchedDoctors = req.query.doctors;
    // empty input fields
    if (!isEmpty(searchedDoctors)) {
        searchedDoctors = req.query.doctors.split(/\s*,+\s*|\s+,*\s*/i);
        doctors = doctors.filter(doctor => {
            for (let i = 0; i < searchedDoctors.length; i++) {
                if (doctor.name.includes(searchedDoctors[i]))
                    return true;
            }
            return false;
        });
    }

    let searchedSpecialities = req.query.specialities;
    if (!isEmpty(searchedSpecialities)) {
        searchedSpecialities = req.query.specialities.split(/\s*,+\s*|\s+,*\s*/);
        doctors = doctors.filter(doctor => {
            for (let i = 0; i < searchedSpecialities.length; i++) {
                if (doctor.speciality.includes(searchedSpecialities[i]))
                    return true;
            }
            return false;
        });
    }
    let results = await helper(doctors);
    res.status(201).render('patient/home', { results, one: true });
}

const filterDoctors = async (req, res) => {
    let speciality = req.query.speciality
    let results;
    if (speciality != 'any') {
        results = doctors.filter(doctor => {
            if (doctor.speciality == speciality)
                return true;
            return false;
        });
    }

    let date = req.query.date;
    if (date != "") {

        date = new Date(date);
        let appointments = await appointmentModel.find();

        // filter appointments by date
        appointments = appointments.filter((x) => {
            if (x.date.getDate() == date.getDate()) {
                let diff = date.getTime() - x.date.getTime();
                if (diff <= 1000 * 60 * 60 && diff >= 0)
                    return true
            }
            return false;
        });

        // map appointments to 
        appointments = appointments.map(({ doctorID }) => (doctorID.toString()));

        // filter doctors
        results = results.filter((doctor) => {
            return !appointments.includes(doctor._id.toString());
        })

    }

    results = await helper(results);
    res.status(201).render('patient/home', {results,one:true});
}
async function selectDoctor(req,res){
    try{
        const result = await doctorModel.find({_id:req.params.id})
        let doctorrows ='<tr><th>Name</th> <th>Speciality</th> \
         <th>Session Price</th> <th>Affiliation</th> <th>Education</th> </tr>';

        doctorrows=doctorrows + `<tr><td style="text-align: center;"> ${result[0].name} </td><td style="text-align: center;\
            "> ${result[0].speciality} </td>\
             <td style="text-align: center;"> ${result[0].rate} </td> <td style="text-align: center;">\
              ${result[0].affiliation} </td> <td style="text-align: center;">${result[0].education}</td> `
        let slotsrows = '<h3>Reserve Appointment with the doctor</h3>';
        
        slotsrows = slotsrows + `<br><button onclick="reserveForMyself()">Reserve for Myself</button>
        <button onclick="reserveForFamilyMember()">Reserve for Family Member</button>`;
       

        res.render("patient/home",{doctorrows:doctorrows, slotsrows ,one:false})
    }
    catch(error){
        res.send(error)
    }
}

async function showSlots(req, res) {
    const doctorID = req.params.id;
    const id = req.user._id;
    if (req.query.date) {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const date = new Date(req.query.date);
      const day = days[date.getDay()];
      const result = await timeSlot.find({ doctorID: doctorID, day: day });
      let html=""
      for( resu in result){
        html+=`<button onClick="reserveTHIS(this)">${result[resu].from},${result[resu].to}</button>`
      }
      res.render("patient/reserveSlot", { id: req.params.id, buttons: html ,date:req.query.date});
    } else {
      const result = await timeSlot.find({ doctorID: id });
      res.render("patient/reserveSlot", { id: req.params.id, buttons: "",date:"" });
    }
  }
  async function reserveSlot(req,res){
    const doctorID= req.params.id;
    const id= req.user._id;
    const date=new Date(req.query.date);
    const time=req.query.time;
    const startTime=time.split(",")[0];
    const endTime=time.split(",")[1];
    const startH = parseInt(startTime.split(":")[0]);
    const startM = parseInt(startTime.split(":")[1]);
    const endH = parseInt(endTime.split(":")[0]);
    const endM = parseInt(endTime.split(":")[1]);
    const doctor = await doctorModel.find({ _id: doctorID });
  let duration = (endH - startH) * 60 + (endM - startM);
  
  duration= duration/60;
    let price= duration*doctor[0].rate;
    // the startTime contains time in the format of 23:30 for example, so we need to split it to get the hours and minutes
    const startHour=startTime.split(":")[0];
    const startMinute=startTime.split(":")[1];
    date.setHours(startHour);
    date.setMinutes(startMinute);
  
    // Check if there is an existing appointment at the specified time
    const existingAppointment = await appointment.findOne({ doctorID: doctorID, date: date });
    if (existingAppointment) {
      return res.status(400).send("There is already an appointment at the specified time.");
    }
  
    const newAppointment=new appointment({doctorID:doctorID,patientID:id,date:date,status:"upcoming",duration:duration,price:price})
    await newAppointment.save();
    res.redirect(`/patient/doctors/${doctorID}`)
  }

  async function showSlotsFam(req, res) {
    const doctorID = req.params.id;
    const id = req.user._id;
    const familyMembers = await patientModel.find({_id:id}).select(["familyMembers"]);
    let dropdown=""
    for(fam in familyMembers[0].familyMembers){
    dropdown+= `<option value=${familyMembers[0].familyMembers[fam].patientID}>${familyMembers[0].familyMembers[fam].name}</option>`
    }
    if (req.query.date) {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const date = new Date(req.query.date);
      const day = days[date.getDay()];
      const result = await timeSlot.find({ doctorID: doctorID, day: day });
      let html=""
      for( resu in result){
        html+=`<button onClick="reserveTHIS(this)">${result[resu].from},${result[resu].to}</button>`
      }
      res.render("patient/reserveSlotFam", { id: req.params.id, buttons: html ,date:req.query.date,dropdown: dropdown});
    } else {
      const result = await timeSlot.find({ doctorID: id });
      res.render("patient/reserveSlotFam", { id: req.params.id, buttons: "",date:"",dropdown: dropdown});
    }
  }
  
  async function reserveSlotFam(req,res){
    const doctorID= req.params.id;
    const doctor = await doctorModel.find({ _id: doctorID });
    const date=new Date(req.query.date);
    const time=req.query.time;
    const startTime=time.split(",")[0];
    const endTime=time.split(",")[1];
    const startH = parseInt(startTime.split(":")[0]);
    const startM = parseInt(startTime.split(":")[1]);
    const endH = parseInt(endTime.split(":")[0]);
    const endM = parseInt(endTime.split(":")[1]);
    if(req.query.famID==undefined){
        res.status(400).send("Please select a family member that is already a patient of the clinic")
    }
    else{
        const familyMemberID=req.query.famID;
    
        let duration = (endH - startH) * 60 + (endM - startM);
    
        duration= duration/60;
        let price= duration*doctor[0].rate;
        // the startTime contains time in the format of 23:30 for example, so we need to split it to get the hours and minutes
        const startHour=startTime.split(":")[0];
        const startMinute=startTime.split(":")[1];
        date.setHours(startHour);
        date.setMinutes(startMinute);
    
        // Check if there is an existing appointment at the specified time
        const existingAppointment = await appointment.findOne({ doctorID: doctorID, date: date });
        if (existingAppointment) {
        return res.status(400).send("There is already an appointment at the specified time.");
        }
    
        const newAppointment=new appointment({doctorID:doctorID,patientID:familyMemberID,date:date,status:"upcoming",duration:duration,price:price})
        await newAppointment.save();
        res.redirect(`/patient/doctors/${doctorID}`)
    }
  }

const ViewPrescriptions = async (req,res) => {
    patient=patientModel.findOne({_id:req.user._id});
    let result = await prescription.find({patientID:patient._id}).select(["prescriptionName","doctorName"]);
    let prescriptionrows ='<tr><th>name</th></tr>';

    for(prescriptions in result){  
        prescriptionrows=prescriptionrows + `<tr><td id="${result[prescriptions]._id}" onclick="showThis(event)" style="cursor: pointer;"> ${result[prescriptions].prescriptionName} </td>\
        </tr>`

    }
    res.render("patient/Prescriptions",{prescriptionrows:prescriptionrows,onepatient:true});
}
async function selectPrescription(req,res){
    patient=patientModel.findOne({_id:req.user._id});
    try{
        const result = await prescription.find({patientID:patient._id,_id:req.params.id})
        let prescriptionrows ='<tr><th>Name</th> <th>Date</th> \
         <th>Doctor Name</th> <th>Filled</th> </tr>';
        var date=result[0].date;
        if(date){
            date=date.toISOString().split('T')[0]
        }
        prescriptionrows=prescriptionrows + `<tr><td style="text-align: center;"> ${result[0].prescriptionName} </td><td style="text-align: center;\
            "> ${date} </td>\
             <td style="text-align: center;"> ${result[0].doctorName} </td> <td style="text-align: center;">\
              ${result[0].filled} </td>`

        res.render("patient/Prescriptions",{prescriptionrows:prescriptionrows,onepatient:false})
    }
    catch(error){
        res.send("Patient doesnt exist")
    }
}

const FilterPrescriptions = async (req,res) => {
    let result
    patient=patientModel.findOne({_id:req.user._id});
    if(req.query.filter=="DoctorName") {
        result= await prescription.find({doctorName:req.query.searchvalue,patientID:patient._id});
    }
    if(req.query.filter=="Date") {
        let temp=new Date(req.query.searchvalue+"T22:00:00.000+00:00");
        result= await prescription.find({date:temp,patientID:patient._id});
    }
    if(req.query.filter=="Filled") {
        result= await prescription.find({filled:req.query.searchvalue,patientID:patient._id});
    }
    let prescriptionrows ='<tr><th>Name</th></tr>';
    for(prescriptions in result){
        prescriptionrows=prescriptionrows + `<tr><td id="${result[prescriptions]._id}" onclick="showThis(event)" style="cursor: pointer;"> ${result[prescriptions].prescriptionName} </td> </tr>`

    }
    res.render("patient/Prescriptions",{prescriptionrows:prescriptionrows,onepatient:false});

}
async function patientHome(req,res){
    res.render("patient/patientHome");
}
async function showMedicalHistory(req,res){
    patient=req.user;
    let result = await patientModel.find({_id:patient._id}).select(["medicalHistory"]);
    let medicalHistoryrows ='<tr><th>name</th> <th>document</th> <th>delete</th></tr>';
    for(medicalHistory in result[0].medicalHistory){
        medicalHistoryrows=medicalHistoryrows + `<tr id=${medicalHistory}><td> ${result[0].medicalHistory[medicalHistory].name} </td>\
        <td><a href="/files/${medicalHistory}" target="_blank">View</a></td><td><form method="post" action="/patient/deleteMedicalHistory/${medicalHistory}" ><button onClick="patientId()" >delete</button></form></td></tr>`
    }
    res.render("patient/medicalHistory",{medicalHistory:medicalHistoryrows});
}
async function addMedicalHistory(req,res){
    const  name  = req.body.docName;
    console.log(name)
    const document  = req.file.buffer;
    const mimeType = req.file.mimetype;
    const newRecord = { name, document,mimeType };
    patient=req.user;
    const patientId = patient._id;
    try {
        const updatedPatient = await patientModel.findByIdAndUpdate(
            patientId,
            { $push: { medicalHistory: newRecord } },
            { new: true }
        );
        res.redirect("/patient/medicalHistory");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function deleteMedicalHistory(req,res){
    patient=patientModel.findOne({_id:req.user._id});
    const patientId = patient._id;
    const recordId = req.params.id;
    
        const result = await patientModel.find({_id:patientId});
        result[0].medicalHistory.splice(recordId,1);
        const updatedPatient = await patientModel.findByIdAndUpdate(patientId,{ $set: { medicalHistory: result[0].medicalHistory } },{ new: true});
        res.redirect("/patient/medicalHistory");
  
}
const viewHealthRecords = async (req, res) => 
{
    patient=patientModel.findOne({_id:req.user._id});
        let healthRecords = [];
            if (patient.healthRecords && patient.healthRecords.length > 0) {
                healthRecords = patient.healthRecords.map((record) => ({
                    data: record.data,
                    contentType: record.contentType,
                }));
            }
            res.render("patient/HealthRecords",{healthRecords: healthRecords})
}
const LinkF= async(req,res)=>{
    patientid=req.user._id;
    
    let results1 =await patientModel.findOne({_id:patientid});
    let results= results1.familyMembers;
   
   
    res.render("patient/LinkFamily",{results});
}
const LinkFamilyMemeber = async(req,res) =>{
    
    patientid=req.user._id;
    
    let familymemberk;
    let i=0;
    let results  =await patientModel.find({_id:patientid}).select(["familyMembers"]);
    if(results[0].familyMembers.length==0){
        res.status(500).json("No Family Members to link");
    }
    for(familymem in results[0].familyMembers){
        if(results[0].familyMembers[familymem].name==req.query.filter){
            familymemberk=results[0].familyMembers[familymem];
            i=familymem;
        }
    }
    let relate;
    if(req.query.filter1=="Email"){
        relate = await patientModel.find({email:req.query.searchvalue})
    }
    if(req.query.filter1=="MobileNumber"){
        relate = await patientModel.find({mobile:req.query.searchvalue})
    }
    
    for(familymem in results[0].familyMembers){
        if(relate[0]._id.equals(results[0].familyMembers[familymem].patientID)&&familymem!=i){
            res.status(500).json("This user is already linked to another family member");
            
            return;
        }
    }
    const updatedPatient2= await patientModel.findByIdAndUpdate(relate[0]._id,{ $set: { agentID: patientid } },{ new: true});
    results[0].familyMembers[i].patientID=relate[0]._id;
    const updatedPatient = await patientModel.findByIdAndUpdate(patientid,{ $set: { familyMembers: results[0].familyMembers } },{ new: true});
    
    res.redirect("/patient/home");
    
}
async function showFile(req, res) {
    const fileId = req.params.fileId;
    patient=req.user;
    let result = await patientModel.find({_id:patient._id}).select(["medicalHistory"]);
    let file = result[0].medicalHistory[fileId].document;
    let type = result[0].medicalHistory[fileId].mimeType;
    res.contentType(type);
    res.send(file);
  }
const PayByCredit = async (req, res) => {
    
}
const PayByWallet = async (req, res) => {
    
}
module.exports = {PayByCredit,PayByWallet, createPatient, createFamilyMember, readFamilyMembers, readDoctors, searchDoctors, filterDoctors,
    ViewPrescriptions,FilterPrescriptions,patientHome,selectPrescription,selectDoctor,viewHealthRecords,showMedicalHistory,addMedicalHistory,LinkF,LinkFamilyMemeber,showFile,deleteMedicalHistory,showSlots,reserveSlot,showSlotsFam,reserveSlotFam,};