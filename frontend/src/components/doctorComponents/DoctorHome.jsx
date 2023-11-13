import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import {useEffect} from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'


function DoctorHome() {
    const [result,setResult]=useState(false);
    useEffect(()=>{check()},[]);
    async function check(){
        
        const res= await axios.get("http://localhost:3000/loggedIn",{ 
            withCredentials:true
        }).then((res)=>{
            
            if(res.data.type!="doctor" ){
              
                 window.location.href="/"
             }
             else{
                    setResult(true)
             }
         }
         ).catch((err)=>{
            if(err.response.status==401){
                window.location.href="/"
            }
         })
    }
    function handleInfo(){
        window.location.href="/doctor/edit"
    }
    function handlePatients(){
        window.location.href="/doctor/patients"
    }
    function handleAppointments
    (){
        window.location.href="/doctor/appointments"
    }
    return (
        <div>

            {result && <div>
                <button type="submit" id="infoButton" onClick={handleInfo}>
                    Edit My Info
                </button>
                <br />
                <button id="patientsButton" onClick={handlePatients}>
                    Show My Patients
                </button>
                <br />
                <button id="Allapp" onClick={handleAppointments}>
                    All Appointments
                </button>
                <br />
                <button id="time">
                    Time Slots
                </button>
            </div>}
        </div>
    );
}

export default DoctorHome;
