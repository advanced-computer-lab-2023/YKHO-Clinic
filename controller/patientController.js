const patientModel = require('../model/patient');
const doctorModel = require('../model/doctor').doctor;
const healthPackageModel = require('../model/healthPackage').healthPackage;
//const { date } = require('joi');
const appointmentModel = require('../model/appointments').appointment;
const { prescription } = require('../model/prescription');
const test={
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

let patient;
(async function () {
    patient = await patientModel.findOne();
    console.log(patient)
})();

let doctors;

const createPatient = async (req, res) => {
    // joi validation
    const { username, password, name, DOB, gender, email, mobile, emergencyName, emergencyMobile } = req.body;

    const emergency = {
        name: emergencyName,
        mobile: emergencyMobile
    }

    patient = new patientModel({
        username, password, name, DOB, gender, email, mobile, emergency
    });

    patient = await patient.save();
    doctors = await doctorModel.find().sort({ name: 1 });
    let results = await helper(doctors);
    res.status(201).render('patient/home', {results});
}

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
    res.status(201).render('patient/family', {results} );
};

const readFamilyMembers = async (req, res) => {
    let results = patient.familyMembers;
    res.status(201).render('patient/family', {results} );
}

// helper
async function helper(doctors) {
    let discount = 1;
    console.log(patient);
    if(patient.healthPackage != "none"){
        let healthPackage = await healthPackageModel.findOne({ packageName: patient.healthPackage });
        discount = healthPackage.doctorDiscount;
        discount = (100 - discount)/100;
    }
    let results = doctors.map(({ _id, name, speciality, rate }) => ({_id, name, speciality, sessionPrice: rate * 1.1 * discount }));
    return results;
}

const readDoctors = async (req, res) => {
    doctors = await doctorModel.find().sort({ name: 1 });
    let results = await helper(doctors);
    res.status(201).render('patient/home', { results});
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
        searchedDoctors = req.query.doctors.split(/\s*[^a-z0-9]+\s*|\s+[^a-z0-9]*\s*/i);
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
    res.status(201).render('patient/home', { results});
}

const filterDoctors = async (req, res) => {
    let speciality = req.query.speciality
    if (speciality != 'any') {
        doctors = doctors.filter(doctor => {
            if (doctor.speciality == speciality)
                return true;
            return false;
        });
    }

    let date = req.query.date;
    if (date != "") {

        date = new Date(date);
        let appointments = await appointmentModel.find({ status: true });

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
        doctors = doctors.filter((doctor) => {
            return appointments.includes(doctor._id.toString());
        })

    }

    let results = await helper(doctors);
    res.status(201).render('patient/home', {results});
}


const ViewPrescriptions = async (req,res) => {
    let result = await prescription.find({patientID:test._id}).select(["prescriptionName","doctorName"]);
    let prescriptionrows ='<tr><th>name</th></tr>';
    
    for(prescriptions in result){
        prescriptionrows=prescriptionrows + `<tr><td id="${result[prescriptions]._id}" onclick="showThis(event)" style="cursor: pointer;"> ${result[prescriptions].prescriptionName} </td></tr>`

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
        result= await prescription.find({date:req.query.searchvalue,patientID:test._id});
    }
    if(req.query.filter=="Filled") {
        result= await prescription.find({filled:req.query.searchvalue,patientID:test._id});
    }
    let prescriptionrows ='<tr><th>name</th></tr>';
    for(prescriptions in result){
        prescriptionrows=prescriptionrows + `<tr><td id="${result[prescriptions]._id}" onclick="showThis(event)" style="cursor: pointer;"> ${result[prescriptions].prescriptionName} </td></tr>`

    }
    res.render("patient/Prescriptions",{prescriptionrows:prescriptionrows,onepatient:false});
    
}
async function patientHome(req,res){
    res.render("patient/patientHome");
}
module.exports = { createPatient, createFamilyMember, readFamilyMembers, readDoctors, searchDoctors, filterDoctors, ViewPrescriptions,FilterPrescriptions,patientHome,selectPrescription};