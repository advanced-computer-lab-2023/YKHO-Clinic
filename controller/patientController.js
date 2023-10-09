const patientModel = require('../model/patient');
const doctorModel = require('../model/doctor').doctor;
const HealthPackageModel = require('../model/healthPackage');
//const { date } = require('joi');
const appointmentModel = require('../model/appointments').appointment;
const { prescription } = require('../model/prescription');


let patient;
(async function () {
    patient = await patientModel.findOne();
})();


const createPatient = async (req, res) => {
    // joi validation
    const { username, password, name, dob, gender, email, mobile, emergency } = req.body;

    patient = new patientModel({
        username, password, name, dob, gender, email, mobile, emergency
    });

    patient = await patient.save();
    res.status(201).send(patient);
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
    familyMember = patient.familyMembers[patient.familyMembers.length - 1];
    res.status(201).send(familyMember);
};

const readFamilyMembers = async (req, res) => {
    res.status(200).send(patient.familyMembers);
}

// helper
async function helper(doctors) {
    let healthPackage = await HealthPackageModel.findOne({ name: patient.healthPackage });
    let discount = healthPackage.doctorsDiscount;
    console.log(discount);
    let results = doctors.map(({ name, speciality, rate }) => ({ name, speciality, sessionPrice: rate * 1.1 * discount }));
    return results;
}

const readDoctors = async (req, res) => {
    doctors = await doctorModel.find().sort({ name: 1 });
    let results = await helper(doctors);
    res.status(200).send(results);
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
    res.status(201).send(results);
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

        let results = await helper(doctors);
        res.status(201).send(results);
    }

}


const ViewPrescriptions = async (req,res) => {
    let result = await prescription.find({patientID:req.body.id}.select(["prescriptionName"+"date"]));
    res.send(result);
}
//async function selectPrescription(req,res){
 //   const result = await prescription.find({patientID:req.body.id,_id:req.params.id})
 //   res.send(result);
//}
const FilterPrescriptions = async (req,res) => {
    let result
    if(req.body.filter=="DoctorName") {
        result= await prescription.find({doctorName:req.body.doctorName,patientID:req.body.id});
    }
    if(req.body.filter=="Date") {
        result= await prescription.find({date:req.body.date,patientID:req.body.id});
    }
    if(req.body.filter=="Filled") {
        result= await prescription.find({filled:req.body.filled,patientID:req.body.id});
    }
    res.send(result);
    
}
module.exports = { createPatient, createFamilyMember, readFamilyMembers, readDoctors, searchDoctors, filterDoctors, ViewPrescriptions,FilterPrescriptions};