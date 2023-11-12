import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import {useEffect} from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'


function DoctorHome() {
    const [result,setResult]=useState(false);
    useEffect(()=>{check()},[]);
    async function check(){
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
        const res= await axios.get("http://localhost:3000/loggedIn",{
            withCredentials:true
        }).then((res)=>{
            
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
    function handleAppointments(){
        window.location.href="/doctor/appointments"
    }
    function handleTimeSlots(){
        window.location.href="/doctor/timeslots"
    }
    async function Logout(){
        await axios.get("http://localhost:3000/logout",{withCredentials:true}).then((res)=>{
            window.location.href="/"
        }).catch((err)=>{
            console.log(err);
        })
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
                <button id="time" onClick={handleTimeSlots}>
                    Time Slots
                </button>
                <br />
                <button id="logout" onClick={Logout}>
                    Logout
                </button>
            </div>}
        </div>
    );
}

export default DoctorHome;
