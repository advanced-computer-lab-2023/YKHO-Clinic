import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Joi from 'joi';
const DoctorPatients = () => {
    const [result, setResult] = useState(false);
    const [patients, setPatients] = useState([]);
    const [onePatient, setOnePatient] = useState([]);
    const [message, setMessage] = useState("");
    useEffect(() => {
        check();
    }, []);

    async function check() {
        await axios.get("http://localhost:3000/doctor/contract",{
        withCredentials:true
    }).then((res)=>{
        if(res.data.contract=="rej"){
            window.location.href="/doctor/contract"
        }
        else{
          setResult(true)
        }
    }).catch((err)=>{
        console.log(err);
    })
        try {
            const res = await axios.get("http://localhost:3000/loggedIn", {
                withCredentials: true
            });
            if(res.data.type!="doctor" ){
                if(res.data.type=="patient"){
                    window.location.href="/patient/home"
                }
                else if(res.data.type=="admin"){
                    window.location.href="/admin/home"
                }
                else{
                 window.location.href="/"
                }
             } 
        } catch (err) {
            if (err.response.status === 401) {
                window.location.href = "/";
            }
        }
    }

    useEffect(() => {
        getPatients();
    }, []);

    async function getPatients() {
        try {
            const res = await axios.get("http://localhost:3000/doctor/patients", {
                withCredentials: true
            });
          
            setPatients(res.data.result);
        } catch (err) {
            console.log(err);
        }
    }
    async function searchPatients() {
        try {
            const name = document.getElementById("name").value;
            const res = await axios.get(`http://localhost:3000/doctor/patients/?name=${name}`, {
                withCredentials: true
            });
            setPatients(res.data.result);
        } catch (err) {
            console.log(err);
        }
    }
    async function showPatientInfo(e) {
        try {
            const id = e.target.id;
            const res = await axios.get(`http://localhost:3000/doctor/patients/${id}`, {
                withCredentials: true
            });
            setOnePatient(res.data.result);
        } catch (err) {
            console.log(err);
        }
    }
    async function uploadFile() {
        try {
            const name = document.getElementById("healthName").value;
            const file = document.getElementById("healthFile").files[0];
            const uploadSchema = Joi.object({
                name: Joi.string().required(),
                file: Joi.required()
            });
            const { error, result } = uploadSchema.validate({name:name,file:file});
            if (error) {
                    return setMessage(error.details[0].message);
            }
            const id = onePatient.patientID._id;
            const formData = new FormData();
            formData.append("name", name);
            formData.append("healthRecords", file);
            const res = await axios.post(`http://localhost:3000/doctor/patients/${id}/upload-pdf`, formData, {
                withCredentials: true
            },{headers:{"Content-Type":"multipart/form-data"}});
            setOnePatient(res.data.result);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div>
            {result && (
                <div>
                    <h1>Your patients</h1>
                    {onePatient.length==0&&<div>
                        <input id="name" name="name" type="text" placeholder="Search patients by name...." />
                        <button type="submit" onClick={searchPatients}>Search</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient) => (
                                <tr >
                                    <td id={patient.patientID._id} onClick={showPatientInfo} >{patient.patientID.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>}
                    {
                       onePatient.length!=0&&<div>
                        <table>
                            <thead>
                               <tr>
                                    <th>Name</th>
                               
                               
                                    <th>Date of birth</th>
                                
                               
                                    <th>Gender</th>
                               
                               
                                    <th>Mobile Number</th>
                               
                               
                                    <th>Emergency contact name</th>
                                
                              
                                    <th>Emergency contact number</th>
                                
                              
                                    <th>Health package</th>
                                    </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{onePatient.patientID.name}</td>
                                
                                
                                    
                                    <td>{onePatient.patientID.DOB.split('T')[0]}</td>
                               
                               
                                    <td>{onePatient.patientID.gender}</td>
                              
                                
                                    <td>{onePatient.patientID.mobile}</td>
                              
                                
                                    <td>{onePatient.patientID.emergency.name}</td>
                                
                               
                                    <td>{onePatient.patientID.emergency.mobile}</td>
                                
                               
                                    <td>{onePatient.patientID.healthPackage}</td>
                                </tr>
                            </tbody>
                        </table>
                        <h3>Health Records</h3>
                        <label>Name</label>
                        <input type="text" id="healthName" />
                        <input type= "file" id="healthFile"/>
                        <br/>
                        <button onClick={uploadFile}>Upload</button>
                        <br/>
                        <p>{message}</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th>Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                {onePatient.patientID.healthRecords.map((record,index) => (
                                    <tr key={record.name}>
                                        <td>{record.name}</td>
                                        <td>
                                            <a href={`http://localhost:3000/doctor/patients/${onePatient.patientID._id}/${index}`} download>
                                                Download
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div> 
                    }
                </div>
            )}
        </div>
    );
};

export default DoctorPatients;
