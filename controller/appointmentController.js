const mongoose = require('mongoose');
const {appointment,validateAppointments} = require('../model/appointments.js');
let id;


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
    id=req.user._id;
    if(req.query.name){
         result = await appointment.find({doctorID:id}).populate("patientID",'name').select(["patientID","-_id","date"])
         result=result.filter((c)=>{
            
            return c.patientID.name.substring(0,req.query.name.length)==req.query.name
         }
         )
    }
    else{
        
         result = await appointment.find({doctorID:id}).populate("patientID",'name').select(["patientID","-_id","date"])
        
    }
    for(i in result){
        for(let j=0;j<result.length;j++){
            if(i!=j){
                if(result[i]&& result[j])
                if(result[i].patientID._id==result[j].patientID._id){
                    result.splice(j,1)
                    j--;
                }
            }
        } 
    }


    res.status(200).json({result:result});
}
// async function showMyPatientInfo(req,res){
//     id=req.user._id;
//     try{
//         const result = await appointment.find({doctorID:id,patientID:req.params.id}).populate("patientID","name DOB gender mobile emergency healthPackage healthRecords.name").select(["patientID","-_id"])
//         res.status(200).json({result:result});
//     }
//     catch(error){
//         res.send("Patient doesnt exist")
//     }
    
// }
async function showMyPatientInfo(req,res){
    id=req.user._id;
    try{
        const result = await appointment.find({doctorID:id,patientID:req.params.id}).populate("patientID","name DOB gender mobile emergency healthPackage healthRecords.name").select(["patientID","-_id"])
        res.status(200).json({result:result[0]})
    }
    catch(error){
        res.send("Patient doesnt exist")
    }
    
}
async function showUpcomingAppointments(req, res) {
    const id = req.user._id;
    
    try {
        const result = await appointment
            .find({ doctorID: id, date: { $gt: Date.now() } })
            .populate("patientID", "name")
            .select(["patientID", "-_id", "date"])
            .sort({ date: 1 }); // Sort by date in ascending order
        

        res.status(200).json({ result: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

   async function PatientShowAppointments(req,res){
    id=req.user._id;
    
    const result = await appointment.find({patientID:id}).populate("doctorID").select(["doctorID","date","status","paid"]);
    // let appointmentrows ='<tr><th>name</th>  <th>date</th>  <th>status</th> <th>Pay By Credit</th> <th>Pay By Wallet</th> </tr>';
    
    // for(appointmentl in result){
    //     appointmentrows=appointmentrows + `<tr><td id="${result[appointmentl]._id}"> ${result[appointmentl].doctorID.name} </td>\
    //     <td id="${result[appointmentl]._id}"> ${result[appointmentl].date.toISOString().split('T')[0]} </td>\
    //     <td id="${result[appointmentl]._id}"> ${result[appointmentl].status} </td>`
    //     if(!result[appointmentl].paid&&result[appointmentl].status=='upcoming'){
    //         appointmentrows+=  `<td> <button onClick="reserveTHIS(this)" id="${result[appointmentl]._id}"> Pay By Credit </button></td> `
    //         appointmentrows+=  `<td> <button onClick="kimo(this)" id="${result[appointmentl]._id}"> Pay By Wallet </button></td> `
    //       }
    //       appointmentrows+= `</tr>`

    // }
    // res.render("patient/Appointments",{appointmentrows:appointmentrows,onepatient:true});
    res.status(200).json({result:result});
}
async function DocShowAppointments(req,res){
    id=req.user._id;
    const result = await appointment.find({doctorID:id}).populate("patientID","name").select(["patientID","date","status"]);
    // let appointmentrows ='<tr><th>name</th>  <th>date</th>  <th>status</th></tr>';
    
    // for(appointmentl in result){
    //     appointmentrows=appointmentrows + `<tr><td id="${result[appointmentl]._id}"> ${result[appointmentl].patientID.name} </td>\
    //     <td id="${result[appointmentl]._id}"> ${result[appointmentl].date.toISOString().split('T')[0]} </td>\
    //     <td id="${result[appointmentl]._id}"> ${result[appointmentl].status} </td><td> <button id=${result[appointmentl].patientID._id} onClick="schedFollow(this)">Schedule follow up</button></td> </tr>`
    // }
    // res.render("doctor/Appointments",{appointmentrows:appointmentrows,onepatient:true});
    res.status(200).json({result:result});
}
async function PatientFilterAppointments(req,res){
    id=req.user._id;
    try{
        let result 
        if(req.query.filter=="Status" && req.query.searchvalue!=""){
            result =  await appointment.find({patientID:id,status:req.query.searchvalue}).populate("doctorID").select(["doctorID","date","status","paid"]);
        }
        else if(req.query.filter=="Status"){
            result =  await appointment.find({patientID:id}).populate("doctorID").select(["doctorID","date","status","paid"]);
        }
        if(req.query.filter=="Date"){
            
            let date = new Date(req.query.searchvalue);
            result= await appointment.find({patientID:id}).populate("doctorID").select(["doctorID","date","status","paid"]);
            if(req.query.searchvalue!=""){
            result = result.filter((x) => {
                if (x.date.getFullYear() == date.getFullYear() && x.date.getMonth() == date.getMonth() && x.date.getDate() == date.getDate())
                    return true;
                return false;
            })
        }
    }
    
        
        
        if(req.query.filters=="upcoming"){ 
            result= result.filter((c)=>{
                return c.date > new Date();
            })
        }
        else if(req.query.filters=="past"){
            result= result.filter((c)=>{
                return c.date < new Date();
            })
        }
        // let appointmentrows ='<tr><th>name</th>  <th>date</th>  <th>status</th> <th>Pay By Credit</th> <th>Pay By Wallet</th> </tr>';
        
        // for(appointmentl in result){
        //     appointmentrows=appointmentrows + `<tr><td id="${result[appointmentl]._id}"> ${result[appointmentl].doctorID.name} </td>\
        //     <td id="${result[appointmentl]._id}"> ${result[appointmentl].date.toISOString().split('T')[0]} </td>\
        //     <td id="${result[appointmentl]._id}"> ${result[appointmentl].status} </td>`
            
        //     if(!result[appointmentl].paid&&result[appointmentl].status=='upcoming'){
        //         appointmentrows+=  `<td> <button onClick="reserveTHIS(this)" id="${result[appointmentl]._id}"> Pay By Credit </button></td> `
        //         appointmentrows+=  `<td> <button onClick="kimo(this)" id="${result[appointmentl]._id}"> Pay By Wallet </button></td> `
                
        //       }
        //       appointmentrows+= `</tr>`
    
    
        // }
        // res.render("patient/Appointments",{appointmentrows:appointmentrows,onepatient:true});
        res.status(200).json({result:result});
        }catch(error){
            console.log(req.query.filter);
            console.log(error);
        }
}
async function DocFilterAppointments(req,res){
    id=req.user._id;
    try{
     
        let result 
        result =  await appointment.find({doctorID:id}).populate("patientID","name").select(["patientID","date","status"]);
        
        if(req.query.date!='undefined'&& req.query.date!='null'){

            let date = new Date(req.query.date);
            result = result.filter((x) => {
                if (x.date.getFullYear() == date.getFullYear() && x.date.getMonth() == date.getMonth() && x.date.getDate() == date.getDate())
                    return true;
                return false;
            })
        }
        if(req.query.searchvalue!=""){
            result = result.filter((x) => {
                if (x.patientID.name.substring(0,req.query.searchvalue.length) == req.query.searchvalue)
                    return true;
                return false;
            })
        }

        if(req.query.filters=="upcoming"){ 
            result= result.filter((c)=>{
                return c.date > new Date();
            })
        }
        else if(req.query.filters=="past"){
            result= result.filter((c)=>{
                return c.date < new Date();
            })
        }
        // let appointmentrows ='<tr><th>name</th>  <th>date</th>  <th>status</th></tr>';
        
        // for(appointmentl in result){
        //     appointmentrows=appointmentrows + `<tr><td id="${result[appointmentl]._id}"> ${result[appointmentl].patientID.name} </td>\
        //     <td id="${result[appointmentl]._id}"> ${result[appointmentl].date.toISOString().split('T')[0]} </td>\
        //     <td id="${result[appointmentl]._id}"> ${result[appointmentl].status} </td> </tr>`
            

        // }
        // res.render("doctor/Appointments",{appointmentrows:appointmentrows,onepatient:true});
        res.status(200).json({result:result});
    }
    catch(error){
        console.log(error);
    }
}

module.exports={createAppointment,showMyPatients,showMyPatientInfo,showUpcomingAppointments,PatientFilterAppointments,DocFilterAppointments,PatientShowAppointments,DocShowAppointments};  