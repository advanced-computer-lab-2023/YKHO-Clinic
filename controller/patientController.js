const patientModel = require("../model/patient");
const doctorModel = require("../model/doctor").doctor;
const appointmentModel = require("../model/appointments").appointment;
const notificationModel = require("../model/notification");
const timeSlot = require("../model/timeSlots").timeSlot;
const timeSlotModel = timeSlot;
const { appointment } = require("../model/appointments");
const { healthPackage } = require("../model/healthPackage");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const FollowUpRequest = require("../model/followUpRequests");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const admin = require("../model/admin.js");
const requestModel = require("../model/request.js");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
require("dotenv").config();
const zlib = require('zlib');
const { isStrongPassword } = require("./adminController.js");
const healthPackageModel = require("../model/healthPackage").healthPackage;
//const { date } = require('joi');
const { prescription } = require("../model/prescription");
const { send } = require("express/lib/response.js");
const maxAge = 3 * 24 * 60 * 60;
const fs = require('fs');
const doc = require("pdfkit");
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

const createPatient = async (req, res) => {
  const {
    username,
    password,
    name,
    DOB,
    gender,
    email,
    mobileNumber,
    emergencyName,
    emergencyMobile,
  } = req.body;
  const schema = Joi.object({
    username: Joi.string().max(30).required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    DOB: Joi.date().iso().required(),
    gender: Joi.string().valid("male", "female", "other").required(),
    email: Joi.string().email().required(),
    mobileNumber: Joi.string().pattern(new RegExp("^\\d{11}$")).required(),
    emergencyName: Joi.string().required(),
    emergencyMobile: Joi.string().pattern(new RegExp("^\\d{11}$")).required(),
  });
  const { error, value } = schema.validate(req.body);

  if (error) {
    // If validation fails, send a response with the validation error
    return res.status(201).json({ message: error.details[0].message });
  }
  if (isStrongPassword(req.body.password) === false) {
    return res.status(201).json({ message: "Password must be at least 8 characters, contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character" });
  }
  if (
    (await admin.find({ username: username })).length > 0 ||
    (await doctorModel.find({ username: username })).length > 0 ||
    (await patientModel.find({ username: username })).length > 0 ||
    (await requestModel.find({ username: username })).length > 0
  ) {
    return res.status(201).json({ message: "username already exists" });
  }
  if (
    (await admin.find({ mobile: mobileNumber })).length > 0 ||
    (await doctorModel.find({ mobile: mobileNumber })).length > 0 ||
    (await patientModel.find({ mobileNumber: mobileNumber })).length > 0 ||
    (await requestModel.find({ mobile: mobileNumber })).length > 0
  ) {
    return res.status(201).json({ message: "mobile already exists" });
  }
  if (
    (await admin.find({ email: email })).length > 0 ||
    (await doctorModel.find({ email: email })).length > 0 ||
    (await patientModel.find({ email: email })).length > 0 ||
    (await requestModel.find({ email: email })).length > 0
  ) {
    return res.status(201).json({ message: "email already exists" });
  }

  const emergency = {
    name: emergencyName,
    mobile: emergencyMobile,
    relation: "emergency",
  };

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  let entry = new patientModel({
    username,
    password: hashedPassword,
    name,
    DOB,
    gender,
    email,
    mobileNumber,
    emergency,
  });

  entry = await entry.save();

  res.status(201).json({ message: "request sent successfully" });
};

const patientLogout = (req, res) => {
  res.clearCookie("jwt").send(200, "Logged out successfully");
  res.render("/");
};

const changePasswordPatient = async (req, res) => {
  if (
    req.body.oldPassword === "" ||
    req.body.newPassword === "" ||
    req.body.confirmationPassword === ""
  ) {
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
      return res.status(201).json({ message: "Password must be at least 8 characters, contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character" });
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
  const { name, nationalID, age, relation } = req.body;
  let gender;
  if(relation=="husband"||relation=="son"){
    gender="male";
  }
  else{
    gender="female"
  }
  let familyMember = {
    name,
    nationalID,
    age,
    gender,
    relation,
  };
  patient=await patientModel.findOne({_id:req.user._id});
  patient.familyMembers.push(familyMember);
  patient = await patient.save();
  results = patient.familyMembers;
  res.status(201).json({ results:results });
};

const addFollowUpRequest = async (req, res) => {
  const { doctorID, date, time } = req.body;
  const patientID = req.body.id;
  let dates = new Date(date);
  const doc = await doctorModel.findById(doctorID,"-id -medicalLicense -medicalDegree");
  const pat = await patientModel.findById(patientID, "-healthRecords");


  startTimeHours = time.split("-")[0].split(":")[0];
  startTimeMinutes = time.split("-")[0].split(":")[1];
  endTimeHours = time.split("-")[1].split(":")[0];
  endTimeMinutes = time.split("-")[1].split(":")[1];
  const duration = (endTimeHours - startTimeHours);
  dates.setHours(startTimeHours);
  dates.setMinutes(startTimeMinutes);
  const newFollowUpRequest = new FollowUpRequest({
    doctorID: doctorID,
    patientID: patientID,
    date: dates,
    duration: duration,
    price: 0,
  })
  await newFollowUpRequest.save();
  res.status(201).json({ message: "Follow up request sent successfully" });
};
const readFamilyMembers = async (req, res) => {
  patient = await patientModel.findOne({ _id: req.user._id });
  let results = patient.familyMembers;
  if (results == null) {
    results = [];
  }
  res.status(200).json({ result: results });
  // res.status(201).render("patient/family", { results });
};

// helper
async function helper(doctors, id) {
  let patient = await patientModel.findById(id, "-healthRecords");

  let discount = 1;
  if (patient.subscription.healthPackage && patient.subscription.healthPackage != "none") {
    let healthPackage = await healthPackageModel.findOne({
      packageName: patient.subscription.healthPackage,
    });
    discount = healthPackage.doctorDiscount;
    discount = ((100 - discount) / 100);
  }
  let results = doctors.map(({ _id, name, speciality, rate, affiliation }) => ({
    _id,
    name,
    speciality,
    sessionPrice: Math.floor(rate * 1.1 * discount),
    sessionBeforeDiscount: Math.floor(rate * 1.1),
    affiliation,
  }));
  const timeSlotsPromises = doctors.map(async (doctor) => {
    return await timeSlotModel.find({ doctorID: doctor._id });
  });

  const doctorAppointmentsPromises = doctors.map(async (doctor) => {
    return await appointmentModel.find({ doctorID: doctor._id, status: { $in: ["upcoming", "rescheduled"] } });
  });

  const timeSlotsArray = await Promise.all(timeSlotsPromises);
  const doctorAppointmentsArray = await Promise.all(doctorAppointmentsPromises);
  const timeSlots = [].concat(...timeSlotsArray);
  const doctorAppointments = [].concat(...doctorAppointmentsArray);
  let all = {
    doctors: results,
    timeSlots: timeSlots,
    doctorAppointments: doctorAppointments,
  }
  return all;
}

const readDoctors = async (req, res) => {
  let doctors = await doctorModel.find().sort({ name: 1 });
  let results = await helper(doctors, req.user._id);
  res.status(201).render("patient/home", { results, one: true });
};

const readUserData = async (req, res) => {
  try {
    const patient = await patientModel.findById(req.user._id, "name");
    res.status(201).json({ result: patient });
  } catch (error) {
    res.status(401).send(error.message);
    consolw.log(error);
  }
}


// helper
function isEmpty(input) {
  return !/[a-z]/i.test(input);
}

const searchDoctors = async (req, res) => {
  //let presentSpecialities = doctorModel.schema.path('speciality').enumValues;
  let doctors = await doctorModel.find().sort({ name: 1 }).select('-id -medicalLicense -medicalDegree');
  let searchedDoctors = req.query.searchValues;
  const EnumSpecialities = await doctorModel.schema.path('speciality').enumValues;
  // empty input fields
  if (searchedDoctors != "undefined") {
    searchedDoctors = req.query.searchValues.split(/\s*,+\s*|\s+,*\s*/i);
    searchedDoctors = searchedDoctors.filter((speciality) => {
      for (let i = 0; i < EnumSpecialities.length; i++) {
        if (EnumSpecialities[i].includes(speciality)) return false;
      }
      return true;
    });
    if (searchedDoctors.length > 0)
      doctors = doctors.filter((doctor) => {
        for (let i = 0; i < searchedDoctors.length; i++) {
          if (doctor.name.includes(searchedDoctors[i])) return true;
        }
        return false;
      });
  }

  let searchedSpecialities = req.query.searchValues;
  if (!isEmpty(searchedSpecialities)) {
    searchedSpecialities = req.query.searchValues.split(/\s*,+\s*|\s+,*\s*/);
    searchedSpecialities = searchedSpecialities.filter((speciality) => {
      for (let i = 0; i < EnumSpecialities.length; i++) {
        if (EnumSpecialities[i].includes(speciality)) return true;
      }
    });
    if (searchedSpecialities.length > 0)
      doctors = doctors.filter((doctor) => {
        for (let i = 0; i < searchedSpecialities.length; i++) {
          if (doctor.speciality.includes(searchedSpecialities[i])) return true;
        }
        return false;
      });
  }
  let results = await helper(doctors, req.user._id);
  // res.status(201).render("patient/home", { results, one: true });
  res.status(201).json({ results: results });
};
const getDoctorSpeciality = async (req, res) => {
  const EnumSpecialities = await doctorModel.schema.path('speciality').enumValues;
  res.status(200).json({ results: EnumSpecialities });
}
const filterDoctors = async (req, res) => {
  // let doctors;
  let doctors = await doctorModel.find().sort({ name: 1 }).select('-id -medicalLicense -medicalDegree');
  let searchedDoctors = req.query.searchValues;
  const EnumSpecialities = await doctorModel.schema.path('speciality').enumValues;
  // empty input fields
  if (searchedDoctors != "undefined") {
    searchedDoctors = req.query.searchValues.split(/\s*,+\s*|\s+,*\s*/i);
    searchedDoctors = searchedDoctors.filter((speciality) => {
      for (let i = 0; i < EnumSpecialities.length; i++) {
        if (EnumSpecialities[i].includes(speciality)) return false;
      }
      return true;
    });
    if (searchedDoctors.length > 0)
      doctors = doctors.filter((doctor) => {
        for (let i = 0; i < searchedDoctors.length; i++) {
          if (doctor.name.includes(searchedDoctors[i])) return true;
        }
        return false;
      });
  }
  let searchedSpecialities = req.query.searchValues;
  if (!isEmpty(searchedSpecialities)) {
    searchedSpecialities = req.query.searchValues.split(/\s*,+\s*|\s+,*\s*/);
    searchedSpecialities = searchedSpecialities.filter((speciality) => {
      for (let i = 0; i < EnumSpecialities.length; i++) {
        if (EnumSpecialities[i].includes(speciality)) return true;
      }
    });
    if (searchedSpecialities.length > 0)
      doctors = doctors.filter((doctor) => {
        for (let i = 0; i < searchedSpecialities.length; i++) {
          if (doctor.speciality.includes(searchedSpecialities[i])) return true;
        }
        return false;
      });
  }
  if (req.query.speciality != "")
    doctors = doctors.filter((doctor) => doctor.speciality == req.query.speciality)
  // doctors = await doctorModel
  //   .find({ speciality: req.query.speciality })
  //   .sort({ name: 1 });
  // else doctors = await doctorModel.find().sort({ name: 1 });

  let date = req.query.date;
  if (date != "" && date != "null") {
    date = new Date(date);

    // filter doctors with appointments
    let appointments = await appointmentModel
      .find({ date: date })
      .select({ doctorID: 1, _id: 0 });
    let arr = appointments.map((appointment) => String(appointment.doctorID));
    doctors = doctors.filter((doctor) => !arr.includes(String(doctor._id)));

    // filter doctors with not available time slots
    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let timeSlots = await timeSlotModel.find({
      day: weekday[date.getDay()],
      from: `${date.getHours() > 10 ? date.getHours() : "0" + date.getHours()
        }:${date.getMinutes() > 10 ? date.getMinutes() : "0" + date.getMinutes()
        }`,
    });
    arr = timeSlots.map((timeSlot) => String(timeSlot.doctorID));
    doctors = doctors.filter((doctor) => arr.includes(String(doctor._id)));
  }

  let results = await helper(doctors, req.user._id);
  res.status(200).json({ results: results });
  // res.status(201).render("patient/home", { results, one: true });
};
async function selectDoctor(req, res) {
  try {
    const result = await doctorModel.find({ _id: req.params.id });
    let doctorrows =
      "<tr><th>Name</th> <th>Speciality</th> \
         <th>Session Price</th> <th>Affiliation</th> <th>Education</th> </tr>";

    doctorrows =
      doctorrows +
      `<tr><td style="text-align: center;"> ${result[0].name} </td><td style="text-align: center;\
            "> ${result[0].speciality} </td>\
             <td style="text-align: center;"> ${result[0].rate} </td> <td style="text-align: center;">\
              ${result[0].affiliation} </td> <td style="text-align: center;">${result[0].education}</td> `;
    let slotsrows = "<h3>Reserve Appointment with the doctor</h3>";

    slotsrows =
      slotsrows +
      `<br><button onclick="reserveForMyself()">Reserve for Myself</button>
        <button onclick="reserveForFamilyMember()">Reserve for Family Member</button>`;

    res.render("patient/home", {
      doctorrows: doctorrows,
      slotsrows,
      one: false,
    });
  } catch (error) {
    res.send(error);
  }
}

const readHealthPackage = async (req, res) => {
  let healthPackage = await healthPackageModel.findOne({
    packageName: req.params.healthPackage,
  });
  res.status(201).send(healthPackage);
};

const readHealthPackages = async (req, res) => {
  try {
    let patient = await patientModel.findById(req.user._id);

    // total
    let discount = 0;
    if (patient.agentID) {
      let referal = await patientModel.findById(patient.agentID);
      if (referal.subscription.state != "unsubscribed") {
        let healthPackage = await healthPackageModel.findOne({
          packageName: referal.subscription.healthPackage,
        });
        discount = healthPackage.familyDiscount;
      }
    }
    if (patient.subscription.endDate) {
      let healthPackage = await healthPackageModel.findOne({
        packageName: patient.subscription.healthPackage,
      });
      discount = healthPackage.familyDiscount;
    }

    let healthPackages = await healthPackageModel.find({ deleted: false });
    healthPackages = healthPackages.map(
      ({
        packageName,
        price,
        doctorDiscount,
        pharmacyDiscount,
        familyDiscount,
      }) => ({
        packageName,
        price,
        doctorDiscount,
        pharmacyDiscount,
        familyDiscount,
        total: price * ((100 - discount) / 100),
      })
    );
    
    //res.status(201).send(healthPackages);
    res
      .status(201)
      .render("patient/healthPackages", {
        healthPackages,
        nationalID: req.params.nationalID,
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const readSubscription = async (req, res) => {
  try {
    let patient = await patientModel.findById(req.user._id);
    let subscription = patient.subscription;
    res.status(201).render("patient/subscription", { subscription, one: true });
    //res.status(201).send(subscription);
  } catch (error) {
    res.status(401).send({ err: error });
  }
};
const readDetailsFamily= async(req,res)=>{
  let agent= await patientModel.findById(req.user._id,"-healthRecords -medicalHistory");
  let familymem;
  for(let i =0;i<agent.familyMembers.length;i++){
    if(agent.familyMembers[i].nationalID==req.params.nationalID){
      familymem=agent.familyMembers[i].patientID;
    }
  }
 
  let patient=await patientModel.findById(familymem,"-healthRecords -medicalHistory");
  let result= await healthPackageModel.findOne({packageName:patient.subscription.healthPackage});
  console.log(result);
  res.status(200).json({result:result});
}

const readFamilyMembersSubscriptions = async (req, res) => {
  let agent = await patientModel.findById(req.user._id).populate({
    path: "familyMembers",
    populate: "patient",
  });
  let familyMembers = agent.familyMembers;

  let familyMembersSubscriptions = [];
  for (let i = 0; i < familyMembers.length; i++) {
    if (familyMembers[i].patientID) {
      let patient = await patientModel.findById(familyMembers[i].patientID);
      familyMembersSubscriptions.push({
        name: familyMembers[i].name,
        relation: familyMembers[i].relation,
        healthPackage: patient.subscription.healthPackage,
        state: patient.subscription.state,
        endDate: patient.subscription.endDate
          ? patient.subscription.endDate
          : "",
        agent: true,
        nationalID: familyMembers[i].nationalID,
      });
    } else {
      familyMembersSubscriptions.push({
        name: familyMembers[i].name,
        relation: familyMembers[i].relation,
        healthPackage: "none",
        state: "unsubscribed",
        endDate: "",
        agent: false,
        nationalID: familyMembers[i].nationalID,
      });
    }
  }

  res.status(200).json(familyMembersSubscriptions);
};

// req.username, req.body.healthPackage, req.body.paymentMethod
const subscribe = async (req, res) => {
  try {
    let patient = await patientModel.findById(req.user._id);

    // total
    let familyDiscount = 0;
    if (patient.agentID) {
      let referal = await patientModel.findById(patient.agentID);
      if (referal.subscription.state == "subscribed") {
        let healthPackage = await healthPackageModel.findOne({
          packageName: referal.subscription.healthPackage,
        });
        familyDiscount = healthPackage.familyDiscount;
      }
    }

    let healthPackage = await healthPackageModel.findOne({
      packageName: req.params.healthPackage,
    });
    let total = healthPackage.price * ((100 - familyDiscount) / 100);

    if (req.body.paymentMethod == "wallet") {
      if (patient.wallet < total) {
        throw new Error("insuficient balance, try another payment method");
      } else {
        // update wallet
        patient.wallet -= total;
      }
    } else {
      // pay using card
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: req.params.healthPackage + "health Package",
                },
                unit_amount: total * 100,
              },
              quantity: 1,
            },
          ],
          success_url: `http://localhost:${process.env.PORT}/subscriptionSuccessful/${req.params.healthPackage}/-1`,
          cancel_url: `http://localhost:${process.env.PORT}/fail`,
        });
        res.redirect(session.url);
      } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
      }
    }
    if (req.body.paymentMethod == "wallet") {
      // end date
      let date = new Date();
      date.setSeconds(59);
      date.setMinutes(59);
      date.setHours(23);
      date.setFullYear(date.getFullYear() + 1);
      // update subscription
      patient.subscription = {
        healthPackage: req.params.healthPackage,
        state: "subscribed",
        endDate: date,
      };

      patient = await patient.save();
      res.status(201).send(patient);
    }
  } catch (error) {
    res.status(401).send(error.message);
  }
};

const subscribeFamilyMember = async (req, res) => {
  try {
    let agent = await patientModel.findById(req.user._id);
    let familyMember = agent.familyMembers.find(
      (familyMember) => familyMember.nationalID == req.body.nationalID
    );
    let i = agent.familyMembers.findIndex(
      (familyMember) => familyMember.nationalID == req.body.nationalID
    );
    let patient = await patientModel.findById(familyMember.patientID);

    let familyDiscount = 0;
    if (agent.subscription.state != "unsubscribed") {
      let healthPackage = await healthPackageModel.findOne({
        packageName: agent.subscription.healthPackage,
      });
      familyDiscount = healthPackage.familyDiscount;
    }

    let healthPackage = await healthPackageModel.findOne({
      packageName: req.params.healthPackage,
    });
    let total = healthPackage.price * ((100 - familyDiscount) / 100);

    if (req.body.paymentMethod == "wallet") {
      if (agent.wallet < total) {
        throw new Error("insuficient balance, try another payment method");
      } else {
        // update wallet
        agent.wallet -= total;
      }
    } else {
      // pay using card
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: req.params.healthPackage + "health Package",
                },
                unit_amount: total * 100,
              },
              quantity: 1,
            },
          ],
          success_url: `http://localhost:${process.env.PORT}/subscriptionSuccessful/${req.params.healthPackage}/${i}`,
          cancel_url: `http://localhost:${process.env.PORT}/fail`,
        });
        res.redirect(session.url);
      } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
      }
    }

    if (req.body.paymentMethod == "wallet") {
      // end date
      let date = new Date();
      date.setSeconds(59);
      date.setMinutes(59);
      date.setHours(23);
      date.setFullYear(date.getFullYear() + 1);
      // update subscription
      patient.subscription = {
        healthPackage: req.params.healthPackage,
        state: "subscribed",
        endDate: date,
        agent: true,
      };
      agent = await agent.save();
      patient = await patient.save();
      res.status(201).send(patient);
    }
  } catch (error) {
    res.status(401).send(error.message);
  }
};

const deleteSubscription = async (req, res) => {
  try {
    let patient = await patientModel.findById(req.user._id);
    patient.subscription.state = "cancelled";

    patient = await patient.save();
    res.status(201).send(patient);
  } catch (error) {
    res.status(401).send(error.message);
  }
};

const subscriptionSuccessful = async (req, res) => {

  let patient = await patientModel.findById(req.user._id);
  if (req.params.i != -1) {
    patient = await patientModel.findById(
      patient.familyMembers[req.params.i].patientID
    );
  }
  // end date
  let date = new Date();
  date.setSeconds(59);
  date.setMinutes(59);
  date.setHours(23);
  date.setFullYear(date.getFullYear() + 1);
  // update subscription
  patient.subscription = {
    healthPackage: req.params.healthPackage,
    state: "subscribed",
    endDate: date,
    agent: true,
  };
  patient = await patient.save();
  res.status(201).send(patient);
};

// req.body.nationalID
const deleteFamilyMemberSubscription = async (req, res) => {
  try {
    let agent = await patientModel.findById(req.user._id);
    let familyMember = agent.familyMembers.find(
      (familyMember) => familyMember.nationalID == req.body.nationalID
    );
    let patient = await patientModel.findById(familyMember.patientID);

    patient.subscription.state = "cancelled";

    patient = await patient.save();
    res.status(201).send(patient);
  } catch (error) {
    res.status(401).send(error.message);
  }
};

async function showSlots(req, res) {
  const doctorID = req.params.id;
  const id = req.user._id;
  if (req.query.date) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(req.query.date);
    const day = days[date.getDay()];
    const result = await timeSlot.find({ doctorID: doctorID, day: day });
    let html = "";
    for (resu in result) {
      html += `<button onClick="reserveTHIS(this)">${result[resu].from},${result[resu].to}</button>`;
    }
    res.render("patient/reserveSlot", {
      id: req.params.id,
      buttons: html,
      date: req.query.date,
    });
  } else {
    const result = await timeSlot.find({ doctorID: id });
    res.render("patient/reserveSlot", {
      id: req.params.id,
      buttons: "",
      date: "",
    });
  }
}
async function reserveSlot(req, res) {
  const doctorID = req.params.id;
  const id = req.user._id;
  let date = new Date(req.query.date);
  const time = req.query.time;
  const startTime = time.split(",")[0];
  const endTime = time.split(",")[1];
  const startH = parseInt(startTime.split(":")[0]) + 3;
  const startM = parseInt(startTime.split(":")[1]);
  const endH = parseInt(endTime.split(":")[0]) + 3;
  const endM = parseInt(endTime.split(":")[1]);
  const doctor = await doctorModel.find({ _id: doctorID }).select(["name", "rate"]);
  const patient = await patientModel.find({ _id: id }).select(["subscription", "email", "name"]);
  let duration = (endH - startH) * 60 + (endM - startM);
  //console.log(patient);
  duration = duration / 60;
  let price;
  if (patient[0].subscription.healthPackage != "none") {
    const healthPack = await healthPackage.find({
      packageName: patient[0].subscription.healthPackage,
    });
    price =
      doctor[0].rate * 1.1 -
      (doctor[0].rate * 1.1 * healthPack[0].doctorDiscount) / 100;
  } else {
    price = 1.1 * doctor[0].rate;
  }
  // the startTime contains time in the format of 23:30 for example, so we need to split it to get the hours and minutes
  const startHour = parseInt(startTime.split(":")[0]);
  const startMinute = startTime.split(":")[1];
  date.setHours(startHour);
  date.setMinutes(startMinute);
  let dateConverted = date.toISOString();
  let dateText = `${dateConverted.split("T")[0]} at ${parseInt(dateConverted.split("T")[1].split(".")[0].split(":")[0])+2}:${dateConverted.split("T")[1].split(".")[0].split(":")[1]}`
  // Check if there is an existing appointment at the specified time
  const existingAppointment = await appointment.findOne({
    doctorID: doctorID,
    date: date,
    status: { $in: ["upcoming", "rescheduled"] },
  });
  if (existingAppointment) {
    return res
      .status(200)
      .send("There is already an appointment at the specified time.");
  }
  const newAppointment = new appointment({
    doctorID: doctorID,
    patientID: id,
    date: date,
    status: "upcoming",
    duration: duration,
    price: price,
  });
  await newAppointment.save();

  let newNotification = new notificationModel({
    patientID: id,
    text: `You have a new appointment on ${dateText} with doctor ${doctor[0].name}`,
    read: false,
    date: Date.now(),
  });
  await newNotification.save();
  let newNotification2 = new notificationModel({
    doctorID: doctorID,
    text: `You have a new appointment on ${dateText} with ${patient[0].name}`,
    read: false,
    date: Date.now(),
  });
  await newNotification2.save();

  res.status(201).send("Appointment reserved successfully");
  await sendEmail(patient[0].email, `your appointment is confirmed on ${dateText} with doctor ${doctor[0].name}`);
  await sendEmail(doctor[0].email, `your appointment on ${dateText} with ${patient[0].name} is confirmed`);

}

async function getNotifications(req, res) {
  if(req.body.read){
    const updated = await notificationModel.updateMany({patientID:req.user._id},{$set:{read:true}});
  }
  const notifications = await notificationModel.find({patientID: req.user._id});
  const count = await notificationModel.countDocuments({patientID: req.user._id, read: false});
  return res.status(200).json({result: notifications, readCount: count});
}

async function deleteNotification(req, res) {
  const notificationID = req.body.id;
  const deleted = await notificationModel.findByIdAndDelete(notificationID);
  return res.status(200).json({ message: "Notification deleted successfully" });
}

async function sendEmail(email, message) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: "yousseftyoh@gmail.com",
    to: "aclclinictest@gmail.com",
    subject: "appointment confirmation",
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {

    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

//TODO: check if the dates' format in the new appointment are valid
async function cancelAppointmentPatient(req, res) {
  const appointmentID = req.body.id;
  const deletedAppointment = await appointmentModel.findByIdAndUpdate(appointmentID, { status: "cancelled" }, { new: 1 }).exec();
  const patient = await patientModel.findById(deletedAppointment.patientID, "wallet name email _id");
  const doctore = await doctorModel.findById(deletedAppointment.doctorID, "Wallet name email _id");
  const date = `${(deletedAppointment.date.toISOString()).split("T")[0]} at ${parseInt((deletedAppointment.date.toISOString()).split("T")[1].split(".")[0].split(":")[0]) + 2}:${(deletedAppointment.date.toISOString()).split("T")[1].split(".")[0].split(":")[1]}`
  let message = "";
  deletedAppointment.date.setHours(deletedAppointment.date.getHours() + 2);
  const dateNow = new Date();
  dateNow.setHours(dateNow.getHours() + 24);
  if(deletedAppointment.date > dateNow){ //if appointment is within 24 hours
    if(deletedAppointment.paid == true){
      let Wallet = patient.wallet + deletedAppointment.price;
      let doctorWallet = doctore.Wallet - deletedAppointment.price;
      await patientModel.findByIdAndUpdate(patient._id, {wallet: Wallet}).exec();
      await doctorModel.findByIdAndUpdate(doctore._id, {Wallet: doctorWallet}).exec();
      if(deletedAppointment.patientID != req.user._id){
        message = `Your family member appointment  on ${date} with ${doctore.name} has been cancelled and the amount has been refunded to your wallet`;
      }else{
        message = `Your appointment on ${date} with ${doctore.name} has been cancelled and the amount has been refunded to your wallet`;
      }
    }else{
      if(deletedAppointment.patientID != req.user._id){
        message = `Your family member appointment on ${date} with ${doctore.name} has been cancelled`;
      }else{
        message = `Your appointment on ${date} with ${doctore.name} has been cancelled`;
      }
    }
  }else{//usability: if appointment is cancelled more than 24 hours before
    if(deletedAppointment.patientID != req.user._id){
      message = `Your family member appointment on ${date} with ${doctore.name} has been cancelled`;
    }else{
      message = `Your appointment on ${date} with ${doctore.name} has been cancelled`;
    }
  }

  let newNotification = new notificationModel({
    patientID: patient._id,
    text: message,
    read: false,
    date: Date.now(),
  });
  await newNotification.save();

  let newNotification2 = new notificationModel({
    doctorID: deletedAppointment.doctorID,
    text: `Your appointment on ${date} with ${patient.name} is cancelled`,
    read: false,
    date: Date.now(),
  });
  await newNotification2.save();

  await sendEmail(patient.email, message);
  await sendEmail(doctore.email, `Your appointment on ${date} with ${patient.name} is cancelled`);
  res.status(200).send("Appointment cancelled successfully");
}

async function showSlotsFam(req, res) {
  const doctorID = req.params.id;
  const id = req.user._id;
  const familyMembers = await patientModel
    .find({ _id: id })
    .select(["familyMembers"]);
  let dropdown = "";
  for (fam in familyMembers[0].familyMembers) {
    dropdown += `<option value=${familyMembers[0].familyMembers[fam].patientID}>${familyMembers[0].familyMembers[fam].name}</option>`;
  }
  if (req.query.date) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(req.query.date);
    const day = days[date.getDay()];
    const result = await timeSlot.find({ doctorID: doctorID, day: day });
    let html = "";
    for (resu in result) {
      html += `<button onClick="reserveTHIS(this)">${result[resu].from},${result[resu].to}</button>`;
    }
    res.render("patient/reserveSlotFam", {
      id: req.params.id,
      buttons: html,
      date: req.query.date,
      dropdown: dropdown,
    });
  } else {
    const result = await timeSlot.find({ doctorID: id });
    res.render("patient/reserveSlotFam", {
      id: req.params.id,
      buttons: "",
      date: "",
      dropdown: dropdown,
    });
  }
}

async function reserveSlotFam(req, res) {
  const doctorID = req.params.id;
  const doctor = await doctorModel.find({ _id: doctorID });
  const date = new Date(req.query.date);
  const time = req.query.time;
  const startTime = time.split(",")[0];
  const endTime = time.split(",")[1];
  const startH = parseInt(startTime.split(":")[0]);
  const startM = parseInt(startTime.split(":")[1]);
  const endH = parseInt(endTime.split(":")[0]);
  const endM = parseInt(endTime.split(":")[1]);
  if (req.query.famID == "undefined") {
    res
      .status(400)
      .send(
        "Please select a family member that is already a patient of the clinic"
      );
  } else {
    const familyMemberID = req.query.famID;
    const familyPatient = await patientModel
      .find({ _id: familyMemberID })
      .select(["subscription"]);
    let duration = (endH - startH) * 60 + (endM - startM);

    duration = duration / 60;
    let price;
    if (familyPatient[0].subscription.healthPackage != "none") {
      const healthPack = await healthPackage.find({
        packageName: familyPatient[0].subscription.healthPackage,
      });
      price =
        doctor[0].rate * 1.1 -
        (doctor[0].rate * 1.1 * healthPack[0].doctorDiscount) / 100;
    } else {
      price = doctor[0].rate * 1.1;
    }
    // the startTime contains time in the format of 23:30 for example, so we need to split it to get the hours and minutes
    const startHour = startTime.split(":")[0];
    const startMinute = startTime.split(":")[1];
    date.setHours(startHour);
    date.setMinutes(startMinute);

    // Check if there is an existing appointment at the specified time
    const existingAppointment = await appointment.findOne({
      doctorID: doctorID,
      date: date,
    });
    if (existingAppointment) {
      return res
        .status(400)
        .send("There is already an appointment at the specified time.");
    }

    const newAppointment = new appointment({
      doctorID: doctorID,
      patientID: familyMemberID,
      date: date,
      status: "upcoming",
      duration: duration,
      price: price,
    });
    await newAppointment.save();
    res.redirect(`/patient/doctors/${doctorID}`);
  }
}

const ViewPrescriptions = async (req, res) => {
  patient = await patientModel.findOne({ _id: req.user._id });
  let result = await prescription
    .find({ patientID: patient._id })
    .select(["prescriptionName", "doctorName"]);
  // let prescriptionrows = "<tr><th>name</th></tr>";

  // for (prescriptions in result) {
  //   prescriptionrows =
  //     prescriptionrows +
  //     `<tr><td id="${result[prescriptions]._id}" onclick="showThis(event)" style="cursor: pointer;"> ${result[prescriptions].prescriptionName} </td>\
  //       </tr>`;
  // }
  // res.render("patient/Prescriptions", {
  //   prescriptionrows: prescriptionrows,
  //   onepatient: true,
  // });
  res.status(200).json({ result, onePatient: true });
};
async function selectPrescription(req, res) {
  patient = await patientModel.findOne({ _id: req.user._id });
  try {
    const result = await prescription.find({
      patientID: patient._id,
      _id: req.params.id,
    });
    // let prescriptionrows =
    //   "<tr><th>Name</th> <th>Date</th> \
    //      <th>Doctor Name</th> <th>Filled</th> </tr>";
    // var date = result[0].date;
    // if (date) {
    //   date = date.toISOString().split("T")[0];
    // }
    // prescriptionrows =
    //   prescriptionrows +
    //   `<tr><td style="text-align: center;"> ${result[0].prescriptionName} </td><td style="text-align: center;\
    //         "> ${date} </td>\
    //          <td style="text-align: center;"> ${result[0].doctorName} </td> <td style="text-align: center;">\
    //           ${result[0].filled} </td>`;

    // res.render("patient/Prescriptions", {
    //   prescriptionrows: prescriptionrows,
    //   onepatient: false,
    // });
    res.status(200).json({ result: result, onePatient: false });
  } catch (error) {
    res.send("Patient doesnt exist");
  }
}

const FilterPrescriptions = async (req, res) => {
  let result;
  patient = await patientModel.findOne({ _id: req.user._id }).select(["subscription"]);
  if (req.query.doctor != "null" && req.query.doctor != "") {
    const regex = new RegExp(req.query.doctor, 'i');
    result = await prescription.find({
      doctorName: regex,
      patientID: req.user._id,
    });
  } else {
    result = await prescription.find({
      patientID: req.user._id,
    });
  }
  if (req.query.date != "null") {
    let temp = new Date(req.query.date);
    temp.setDate(temp.getDate() + 1);
    result = result.filter((result) => result.date.toISOString().split("T")[0] == temp.toISOString().split("T")[0]);
  }
  if (req.query.filled != "null" && req.query.filled != "") {
    result = result.filter((prescription) => prescription.filled == (req.query.filled == "true" ? true : false));
  }

  // if (req.query.filter == "DoctorName") {
  //   result = await prescription.find({
  //     doctorName: req.query.searchvalue,
  //     patientID: patient._id,
  //   });
  // }
  // if (req.query.filter == "Date") {
  //   let temp = new Date(req.query.searchvalue + "T22:00:00.000+00:00");
  //   result = await prescription.find({ date: temp, patientID: patient._id });
  // }
  // if (req.query.filter == "Filled") {
  //   if (req.query.searchvalue == "true" || req.query.searchvalue == "false") {
  //     result = await prescription.find({
  //       filled: req.query.searchvalue,
  //       patientID: patient._id,
  //     });
  //   } else {
  //     res.status(500).json("Please enter true or false");
  //   }
  // }
  // let prescriptionrows = "<tr><th>Name</th></tr>";
  // for (prescriptions in result) {
  //   prescriptionrows =
  //     prescriptionrows +
  //     `<tr><td id="${result[prescriptions]._id}" onclick="showThis(event)" style="cursor: pointer;"> ${result[prescriptions].prescriptionName} </td> </tr>`;
  // }
  // res.render("patient/Prescriptions", {
  //   prescriptionrows: prescriptionrows,
  //   onepatient: false,
  // });
  if (patient.subscription.healthPackage != "none") {
    var totalPrice = [];
    const healthpackage = await healthPackage.findOne({ packageName: patient.subscription.healthPackage });
    const discount = healthpackage.pharmacyDiscount;
    result.map((prescription) => { totalPrice.push(prescription.price - (discount * prescription.price / 100)); });
    res.status(200).json({ result: result, totalPrice: totalPrice, hasHealthPackage: (patient.subscription.healthPackage != "none") });
  }
  else {
    var totalPrice = [];
    result.map((prescription) => { totalPrice.push(prescription.price); });
    res.status(200).json({ result: result, totalPrice: totalPrice, hasHealthPackage: (patient.subscription.healthPackage != "none") });
  }
};
async function patientHome(req, res) {
  res.render("patient/patientHome");
}
async function showMedicalHistory(req, res) {
  patient = req.user;
  const index = req.params.index;
  let result = await patientModel.findById({ _id: patient._id }).select({ medicalHistory: { $slice: [parseInt(index), 1] } });
  const compressedData = result.medicalHistory[0].document;
  const decompressedData = zlib.gunzipSync(compressedData);

    const type = result.medicalHistory[0].mimeType;
    const name = result.medicalHistory[0].name;

    res.set("Content-Type", "application/octet-stream");
    res.set(
      "Content-Disposition",
      `attachment; filename="${name}.${type.split("/")[1]}"`
    );
    
    res.send(decompressedData);
}
async function addMedicalHistory(req, res) {
  const name = req.body.docName;

  const document = req.file.buffer;
  const mimeType = req.file.mimetype;
  const compressedData = zlib.gzipSync(document);
  const newRecord = { name, document:compressedData, mimeType };
  patient = req.user;
  const patientId = patient._id;
  try {
    const updatedPatient = await patientModel.findByIdAndUpdate(
      patientId,
      { $push: { medicalHistory: newRecord } },
      { new: true },
      "-healthRecords.data -medicalHistory.document"
    );
    
    res.status(200).json({ result: updatedPatient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function deleteMedicalHistory(req, res) {
  patient = await patientModel.findOne({ _id: req.user._id });
  const patientId = patient._id;
  const id = req.body.index;
  const updatedPatient = await patientModel.findByIdAndUpdate(
    patientId,
    { $pull: { medicalHistory: { _id: id } } },
    { new: true },
    "-healthRecords.data -medicalHistory.document"
  ) 

  res.status(200).json({ result: updatedPatient });
}
const viewHealthRecords = async (req, res) => {
  patient = await patientModel.findOne({ _id: req.user._id });
  let healthRecords = [];
  if (patient.healthRecords && patient.healthRecords.length > 0) {
    healthRecords = patient.healthRecords.map((record) => ({
      data: record.data,
      contentType: record.contentType,
    }));
  }
  res.render("patient/HealthRecords", { healthRecords: healthRecords });
};
const LinkF = async (req, res) => {
  patientid = req.user._id;

  let results1 = await patientModel.findOne({ _id: patientid });
  let results = results1.familyMembers;

  res.render("patient/LinkFamily", { results });
};
const LinkFamilyMemeber = async (req, res) => {
  patientid = req.user._id;

  let familymemberk;
  let i = 0;
  let results = await patientModel
    .find({ _id: patientid })
    .select(["familyMembers"]);
  if (results[0].familyMembers.length == 0) {
    res.status(500).json("No Family Members to link");
  }
  for (familymem in results[0].familyMembers) {
    if (results[0].familyMembers[familymem].name == req.query.filter) {
      familymemberk = results[0].familyMembers[familymem];
      i = familymem;
    }
  }
  let relate;
  if (req.body.filter == "Email") {
    relate = await patientModel.find({ email: req.body.search });
  }
  if (req.query.filter == "MobileNumber") {
    relate = await patientModel.find({ mobileNumber: req.body.search });
  }
  if (relate.length != 0) {
    if (relate[0]._id.equals(patientid)) {
      res.status(500).json("You cant link yourself");
    }
  }
  if (relate.length != 0) {
    for (familymem in results[0].familyMembers) {
      if (
        relate[0]._id.equals(results[0].familyMembers[familymem].patientID) &&
        familymem != i
      ) {
        res
          .status(500)
          .json("This user is already linked to another family member");

        return;
      }
    }
  } else {
    return res.status(500).json("email or mobile number doesnt exist");
  }
  const updatedPatient2 = await patientModel.findByIdAndUpdate(
    relate[0]._id,
    { $set: { agentID: patientid } },
    { new: true }
  );
  results[0].familyMembers[i].patientID = relate[0]._id;
  const updatedPatient = await patientModel.findByIdAndUpdate(
    patientid,
    { $set: { familyMembers: results[0].familyMembers } },
    { new: true }
  );

  let familyMembers = results.familyMembers;
  res.status(200).json(familyMembers);

};

async function showFile(req, res) {
  const fileId = req.params.fileId;
  patient = req.user;
  let result = await patientModel
    .find({ _id: patient._id })
    .select(["medicalHistory"]);
  let file = result[0].medicalHistory[fileId].document;
  let type = result[0].medicalHistory[fileId].mimeType;
  res.contentType(type);
  res.send(file);
}
const PayByCredit = async (req, res) => {
  const appoitmentid = req.params.id;
  const appoitment = await appointmentModel
    .findOne({ _id: appoitmentid })
    .populate("doctorID");

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Appointment With Dr." + appoitment.doctorID.name,
            },
            unit_amount: appoitment.price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/success/${appoitmentid}`,
      cancel_url: `http://localhost:3000/fail`,
    });
    // res.redirect(session.url);
    res.status(200).json({ result: session.url});
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
};
const PayByWallet = async (req, res) => {
  const appoitmentid = req.params.id;
  const appoitment = await appointmentModel.findOne({ _id: appoitmentid });
  const appoitmentCost = appoitment.price;
  const doctor = await doctorModel.findOne({ _id: appoitment.doctorID });
  const patient = await patientModel.findOne({ _id: req.user._id });

  const Walletp = patient.wallet - appoitmentCost;

  const doctorw = doctor.Wallet + appoitmentCost;
  if (patient.wallet >= appoitmentCost) {
    const updatedPatient2 = await patientModel.findByIdAndUpdate(
      req.user._id,
      { $set: { wallet: Walletp } },
      { new: true }
    );
    const updatedoctor = await doctorModel.findByIdAndUpdate(
      appoitment.doctorID,
      { $set: { Wallet: doctorw } },
      { new: true }
    );
    const appointmentupdated = await appointmentModel.findByIdAndUpdate(
      appoitmentid,
      { $set: { paid: true } },
      { new: true }
    );
    res.redirect("/patient/home");
  } else {
    res.status(500).send("Insufficient funds");
  }
};
const ViewWallet = async (req, res) => {
  patientID = req.user._id;
  patient = await patientModel.findById(req.user._id, "wallet");
  const Wallet = patient.wallet;
  // console.log(Wallett);
  // res.render("patient/Wallet", { Wallett: Wallett });
  res.status(201).json({ result: Wallet });
};
const success = async (req, res) => {
  const appoitmentid = req.params.id;
  const appoitment = await appointmentModel.findOne({ _id: appoitmentid });
  const appoitmentCost = appoitment.price;
  const doctor = await doctorModel.findOne({ _id: appoitment.doctorID });
  const doctorw = doctor.Wallet + appoitmentCost;
  const updatedoctor = await doctorModel.findByIdAndUpdate(
    appoitment.doctorID,
    { $set: { Wallet: doctorw } },
    { new: true }
  );
  const appointmentupdated = await appointmentModel.findByIdAndUpdate(
    appoitmentid,
    { $set: { paid: true } },
    { new: true }
  );
  
  res.redirect("http://localhost:5173/patient/Appointments?success=true");
};
const fail = async (req, res) => {
  res.status(200).redirect("http://localhost:5173/patient/Appointments?success=false");
  //res.redirect("http://localhost:5173/patient/Appointments");
};
const PayPresc = async (req, res) => {
  let pres = await prescription.findOne({ _id: req.params.id });
  let patient = await patientModel.findOne({ _id: req.user._id });
  let temp;
  for (let i = 0; i < pres.MedicineNames.length; i++) {
    temp = {
      medicineName: pres.MedicineNames[i].name,
      quantity: 1,
      medicinePrice: pres.MedicineNames[i].price,
    }
    patient.shoppingCart.push(temp);


  }

  let updatepatient= await patientModel.findByIdAndUpdate(pres.patientID,{$set: {shoppingCart:patient.shoppingCart}},{new:1});
  pres= await prescription.findByIdAndUpdate(req.params.id,{$set:{filled:true}},{new:1});
  res.status(201).json({ result: process.env.PORTPHARMA });

}

const getPatientPlan = async (req, res) => {
  const patient = await patientModel.findById(req.user._id, "subscription");
  res.status(201).json({ result: patient.subscription.healthPackage });
}

const getFamilyMembersPlan = async (req, res) => {
  const familyMembers = await patientModel.findById(req.user._id, "familyMembers");
  var familyPlan = [];
  if (familyMembers.familyMembers)
    for (let i = 0; i < familyMembers.familyMembers.length; i++) {
      const member = await patientModel.findById(familyMembers.familyMembers[i].patientID, "subscription");
      if (member !== null)
        familyPlan.push({ name: familyMembers.familyMembers[i].name, relation: familyMembers.familyMembers[i].relation, healthPackage: member.subscription.healthPackage });
      else
        familyPlan.push({ name: familyMembers.familyMembers[i].name, relation: familyMembers.familyMembers[i].relation, healthPackage: "none" });
    }
  res.status(201).json({ result: familyPlan });
};

const getMyAppointments = async (req, res) => {
  const Appointment = await appointment.find({ patientID: req.user._id, date: { $gt: Date.now() } }).populate("doctorID", "name").select(["doctorID", "date"]);
  res.status(201).json({ result: Appointment });
}
const viewAllDataOfPrescriptions = async (req, res) => {
  patient = await patientModel.findOne({ _id: req.user._id }).select(["subscription"]);
  let result = await prescription
    .find({ patientID: req.user._id })
    .select(["prescriptionName", "doctorName", "date", "filled", "MedicineNames", "paid", "price", "_id"]);

  if (patient.subscription.healthPackage != "none") {
    var totalPrice = [];
    const healthpackage = await healthPackage.findOne({ packageName: patient.subscription.healthPackage });
    const discount = healthpackage.pharmacyDiscount;
    result.map((prescription) => { totalPrice.push(prescription.price - (discount * prescription.price / 100)); });
    res.status(200).json({ result: result, totalPrice: totalPrice, hasHealthPackage: (patient.subscription.healthPackage != "none") });
  }
  else {
    var totalPrice = [];
    result.map((prescription) => { totalPrice.push(prescription.price); });
    res.status(200).json({ result: result, totalPrice: totalPrice, hasHealthPackage: (patient.subscription.healthPackage != "none") });
  }
}
const viewPrescriptionPDF = async (req, res) => {
  try {
    const prescriptionId = req.params.id;
    const pres = await prescription.findById(prescriptionId).select("prescriptionPDF");

    if (!pres) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    const pdfBuffer = pres.prescriptionPDF.data;

    if (!Buffer.isBuffer(pdfBuffer)) {
      return res.status(500).json({ error: 'Invalid PDF data' });
    }

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${prescriptionId}.pdf`);

    // Send the PDF file as a downloadable attachment
    res.send(pdfBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
}

async function getTimeSlotOnDate(req, res) {
  const date = new Date(req.query.date);
  date.setHours(date.getHours() + 2);
  const day = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][req.query.day];
  const appointment = await appointmentModel.find({ doctorID: req.query.id, status: { $in: ["upcoming", "rescheduled"] } });
  let timeSlots = await timeSlot.find({ doctorID: req.query.id, day: day });
  timeSlots = timeSlots.filter((timeSlot) => {
    for (let i = 0; i < appointment.length; i++) {
      // console.log(date.toISOString().split("T")[0] == appointment[i].date.toISOString().split("T")[0])
      // console.log(timeSlot.from == ((appointment[i].date.getHours()) + ":" + appointment[i].date.getMinutes()))
      if (timeSlot.from == ((appointment[i].date.getHours()) + ":" + appointment[i].date.getMinutes()) && date.toISOString().split("T")[0] == appointment[i].date.toISOString().split("T")[0]) {
        return false;
      }
    }
    return true;
  });
  res.status(200).json({ result: timeSlots });
}

async function getMyID(req, res) {
  res.status(200).json({ result: req.user._id });
}
async function getPatient(req, res) {
  const patient = await patientModel.findById(req.user._id,"-healthRecords.data -medicalHistory.document");
  res.status(200).json({ result: patient });
}
module.exports = {
  showSlots,
  reserveSlot,
  showSlotsFam,
  reserveSlotFam,
  success,
  fail,
  ViewWallet,
  PayByCredit,
  PayByWallet,
  createPatient,
  createFamilyMember,
  readFamilyMembers,
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
  LinkF,
  LinkFamilyMemeber,
  showFile,
  deleteMedicalHistory,
  PayPresc,
  readUserData,
  getPatientPlan,
  getFamilyMembersPlan,
  getMyAppointments,
  viewAllDataOfPrescriptions,
  getNotifications,
  viewPrescriptionPDF,
  getDoctorSpeciality,
  cancelAppointmentPatient,
  deleteNotification,
  getTimeSlotOnDate,
  addFollowUpRequest,
  getMyID,
  getPatient,
  readDetailsFamily,
  changePasswordPatient,
};

module.exports.readSubscription = readSubscription;
module.exports.readFamilyMembersSubscriptions = readFamilyMembersSubscriptions;

module.exports.readHealthPackage = readHealthPackage;
module.exports.readHealthPackages = readHealthPackages;

module.exports.subscribe = subscribe;
module.exports.subscribeFamilyMember = subscribeFamilyMember;
module.exports.deleteSubscription = deleteSubscription;
module.exports.deleteFamilyMemberSubscription = deleteFamilyMemberSubscription;
module.exports.subscriptionSuccessful = subscriptionSuccessful;

