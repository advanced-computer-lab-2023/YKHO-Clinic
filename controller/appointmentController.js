const mongoose = require('mongoose');
const {appointment,validateAppointments} = require('../model/appointments.js');
const id="606aa80e929a618584d2758b";
async function createAppointment(req,res){
    const result=validateAppointments(req.body);
    if(result.error){
        res.send(result.error.message)
    }
    else{
        let newAppointment= new appointment({doctorID:req.body.doctorID,
            patientID:req.body.patientID,
            date:req.body.date,
            status:req.body.status})
            try{
                newAppointment = await newAppointment.save();
                res.status(200).send(newAppointment)
            }
            catch(err){
                res.status(400).send(err.message)
            }
    }
    
}
async function showMyPatients(req,res){
    let result
    
    if(req.query.name){
         result = await appointment.find({doctorID:id}).populate("patientID",'name').select(["patientID","-_id"])
         result=result.filter((c)=>{
            
            return c.patientID.name.substring(0,req.query.name.length)==req.query.name
         }
         
         
         )
       
         
    }
    else{
        
         result = await appointment.find({doctorID:id}).populate("patientID",'name').select(["patientID","-_id"])
        
    } 
    for(i in result){
        for(j in result){
            if(i!=j){
                if(result[i]&& result[j])
                if(result[i].patientID._id==result[j].patientID._id){
                    result.splice(j,1)
                }
            }
        } 
    } 
    let patientRows ='<tr><th>name</th></tr>';
    for(patients in result){
        patientRows=patientRows + `<tr><td id="${result[patients].patientID._id}" onclick="showThis(event)" style="cursor: pointer;"> ${result[patients].patientID.name} </td></tr>`

    }
    res.render("doctor/doctorPatients",{patientRows:patientRows,onepatient:true})
}
async function showMyPatientInfo(req,res){
    try{
        const result = await appointment.find({doctorID:id,patientID:req.params.id}).populate("patientID","-_id").select(["patientID","-_id"])
        let patientRows ='<tr><th>name</th> <th>Date of birth</th> <th>Gender</th>\
         <th>Mobile number</th> <th>Emergency contact name</th> <th>Emergency contact number</th>\
           <th>Health package</th> </tr>';
            var date=result[0].patientID.dob;
            if(date){
                date=date.toISOString().split('T')[0]
            }
            patientRows=patientRows + `<tr><td style="text-align: center;"> ${result[0].patientID.name} </td><td style="text-align: center;\
            "> ${date} </td>\
             <td style="text-align: center;"> ${result[0].patientID.gender} </td> <td style="text-align: center;">\
              ${result[0].patientID.mobileNumber} </td> \
             <td style="text-align: center;"> ${result[0].patientID.emergency.name} </td>\
             <td style="text-align: center;"> ${result[0].patientID.emergency.mobileNumber} \
             </td> <td style="text-align: center;">${result[0].patientID.healthPackage}</td>`
        
        res.render("doctor/doctorPatients",{patientRows:patientRows,onepatient:false})
    }
    catch(error){
        res.send("Patient doesnt exist")
    }
    
}
async function showUpcomingAppointments(req,res){
    
    const result = await appointment.find({doctorID:id,date:{$gt:Date.now()}}).populate("patientID").select(["patientID","-_id","date"])
    let patientRows ='<tr><th>name</th> <th>date</th></tr>';
    for(patients in result){
        
        patientRows=patientRows + `<tr><td id="${result[patients].patientID._id}" onclick="showThis(event)" style="cursor: pointer;"> ${result[patients].patientID.name} </td>\
        <td id="${result[patients].patientID._id}" onclick="showThis(event)" style="cursor: pointer;"> ${result[patients].date.toISOString().split('T')[0]} </td></tr>`

    }
    res.render("doctor/doctorAppointments",{patientRows:patientRows})
} 
   async function PatientShowAppointments(req,res){
    const result = await appointment.find({patientID:id}).populate("doctorID").select(["doctorID","date","status"]);
    let appointmentrows ='<tr><th>name</th>  <th>date</th>  <th>status</th></tr>';
    
    for(appointmentl in result){
        appointmentrows=appointmentrows + `<tr><td id="${result[appointmentl]._id}"> ${result[appointmentl].doctorID.name} </td>\
        <td id="${result[appointmentl]._id}"> ${result[appointmentl].date.toISOString().split('T')[0]} </td>\
        <td id="${result[appointmentl]._id}"> ${result[appointmentl].status} </td></tr>`

    }
    res.render("patient/Appointments",{appointmentrows:appointmentrows,onepatient:true});
}
async function DocShowAppointments(req,res){
    const result = await appointment.find({doctorID:id}).populate("patientID").select(["patientID","date","status"]);
    let appointmentrows ='<tr><th>name</th>  <th>date</th>  <th>status</th></tr>';
    
    for(appointmentl in result){
        appointmentrows=appointmentrows + `<tr><td id="${result[appointmentl]._id}"> ${result[appointmentl].patientID.name} </td>\
        <td id="${result[appointmentl]._id}"> ${result[appointmentl].date.toISOString().split('T')[0]} </td>\
        <td id="${result[appointmentl]._id}"> ${result[appointmentl].status} </td></tr>`

    }
    res.render("doctor/Appointments",{appointmentrows:appointmentrows,onepatient:true});
}
async function PatientFilterAppointments(req,res){
    try{
        let result 
        if(req.query.filter=="Status"){
            result =  await appointment.find({patientID:id,status:req.query.searchvalue}).populate("doctorID").select(["doctorID","date","status"]);
        }
        if(req.query.filter=="Date"){
            
            let temp=new Date(req.query.searchvalue+"T22:00:00.000+00:00");
            result= await appointment.find({patientID:id,date:temp}).populate("doctorID").select(["doctorID","date","status"]);
            
    
        }
        let appointmentrows ='<tr><th>name</th>  <th>date</th>  <th>status</th></tr>';
        
        for(appointmentl in result){
            appointmentrows=appointmentrows + `<tr><td id="${result[appointmentl]._id}"> ${result[appointmentl].doctorID.name} </td>\
            <td id="${result[appointmentl]._id}"> ${result[appointmentl].date.toISOString().split('T')[0]} </td>\
            <td id="${result[appointmentl]._id}"> ${result[appointmentl].status} </td></tr>`
    
        }
        res.render("patient/Appointments",{appointmentrows:appointmentrows,onepatient:true});}
        catch(error){
            console.log(req.query.filter);
            console.log(error);
        }
}
async function DocFilterAppointments(req,res){
    try{
    let result 
    if(req.query.filter=="Status"){
        result =  await appointment.find({doctorID:id,status:req.query.searchvalue}).populate("patientID").select(["patientID","date","status"]);
    }
    if(req.query.filter=="Date"){
        
        let temp=new Date(req.query.searchvalue+"T22:00:00.000+00:00");
        result= await appointment.find({doctorID:id,date:temp}).populate("patientID").select(["patientID","date","status"]);
        

    }
    let appointmentrows ='<tr><th>name</th>  <th>date</th>  <th>status</th></tr>';
    
    for(appointmentl in result){
        appointmentrows=appointmentrows + `<tr><td id="${result[appointmentl]._id}"> ${result[appointmentl].patientID.name} </td>\
        <td id="${result[appointmentl]._id}"> ${result[appointmentl].date.toISOString().split('T')[0]} </td>\
        <td id="${result[appointmentl]._id}"> ${result[appointmentl].status} </td></tr>`

    }
    res.render("doctor/Appointments",{appointmentrows:appointmentrows,onepatient:true});}
    catch(error){
        console.log(req.query.filter);
        console.log(error);
    }
}

module.exports={createAppointment,showMyPatients,showMyPatientInfo,showUpcomingAppointments,PatientFilterAppointments,DocFilterAppointments,PatientShowAppointments,DocShowAppointments};  