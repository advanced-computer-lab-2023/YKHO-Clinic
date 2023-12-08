import axios from 'axios';
import React from 'react';
import { useState } from 'react'
import {useEffect} from 'react'
const DoctorInfo = () => {
    const [error,setError]= useState("")
    const updateDoctor= async()=>{
        const updateTerm=document.getElementById("updateTerm").value
        const updateValue=document.getElementById("updateValue").value
        await axios.post("http://localhost:3000/doctor/updateInfo",{
            updateTerm:updateTerm,
            updateValue:updateValue,
        },{withCredentials:true}).then((res)=>{
           setError(res.data.message);
        })
    }
    //checks if logged in and if not redirects to login page
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
  return (
    <div>
      {result && <div>
       <h1>Update my info</h1>
    
        <label htmlFor="updateTerm">i want</label>
        <select id="updateTerm" name="updateTerm">
            <option >email</option>
            <option >rate</option>
            <option >affiliation</option>
        </select>
        <label htmlFor="updateValue">to be updated to</label>
        <input id="updateValue" input="text" name="updateValue" />
        <button onClick={updateDoctor} type="submit" >Update</button>
        <p>{error}</p>
      </div>}
    </div>
  );
};

export default DoctorInfo;
