const patientModel = require('../model/patient');
const doctorModel = require('../model/doctor').doctor;
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

let patient;
let test;
(async function () {
    patient = await patientModel.findOne();
    test = patient;
})();

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

const patientLogin = async (req, res) => {
    if (req.body.username === "" || req.body.password === "") {
    //   res.render("doctor/login", { message: "Fill the empty fields" });
    res.status(404).error("Fill the empty fields");
    }
    
    const user = await patientModel.findOne({ // Change find to findOne to get a single user
      username: req.body.username
    });
  
    if (user) {
        const found = await bcrypt.compare(req.body.password, user.password);
        if (found) {
        const token = createToken(user);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });

        const data = {
            name: user.username,
        };
        return res.render("patient/home", data);
        }
    }
    // return res.render("doctor/login", { message: "Username or password is wrong" });
    res.status(404).send("Username or password is wrong");
  };

const patientLogout = (req, res) => {
    res.clearCookie('jwt').send(200,"Logged out successfully");
    res.render("/");
}

const changePasswordPatient = async (req, res) => {
    if ( req.body.oldPassword === "" || req.body.newPassword === "" || req.body.confirmationPassword === "") {
      res.status(404).json({ message: "Fill the empty fields" });
    }
  
    const token = req.cookies.jwt;
    const decodedCookie = await promisify(jwt.verify)(token, process.env.SECRET);
    const user = await patientModel.findOne({
      username: decodedCookie.name,
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
    let results = patient.familyMembers;
    res.status(201).render('patient/family', {results});
}

// helper
async function helper(doctors) {
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
    let results = await helper(doctors);
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

        res.render("patient/home",{doctorrows:doctorrows,one:false})
    }
    catch(error){
        res.send(error)
    }
}

const ViewPrescriptions = async (req,res) => {
    let result = await prescription.find({patientID:test._id}).select(["prescriptionName","doctorName"]);
    let prescriptionrows ='<tr><th>name</th></tr>';

    for(prescriptions in result){
        prescriptionrows=prescriptionrows + `<tr><td id="${result[prescriptions]._id}" onclick="showThis(event)" style="cursor: pointer;"> ${result[prescriptions].prescriptionName} </td>\
        </tr>`

    }
    res.render("patient/Prescriptions",{prescriptionrows:prescriptionrows,onepatient:true});
}
async function selectPrescription(req,res){
    try{
        const result = await prescription.find({patientID:test._id,_id:req.params.id})
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
    if(req.query.filter=="DoctorName") {
        result= await prescription.find({doctorName:req.query.searchvalue,patientID:test._id});
    }
    if(req.query.filter=="Date") {
        let temp=new Date(req.query.searchvalue+"T22:00:00.000+00:00");
        result= await prescription.find({date:temp,patientID:test._id});
    }
    if(req.query.filter=="Filled") {
        result= await prescription.find({filled:req.query.searchvalue,patientID:test._id});
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
const viewHealthRecords = async (req, res) => 
{
        let healthRecords = [];
            if (test.healthRecords && test.healthRecords.length > 0) {
                healthRecords = test.healthRecords.map((record) => ({
                    data: record.data,
                    contentType: record.contentType,
                }));
            }
            res.render("patient/HealthRecords",{healthRecords: healthRecords})
}

module.exports = { createPatient, createFamilyMember, readFamilyMembers, readDoctors, searchDoctors, filterDoctors,
     ViewPrescriptions,FilterPrescriptions,patientHome,selectPrescription,selectDoctor,viewHealthRecords, patientLogin};