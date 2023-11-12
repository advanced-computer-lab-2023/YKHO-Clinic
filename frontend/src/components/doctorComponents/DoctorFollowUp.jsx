import React from 'react';
import { useParams } from 'react-router-dom';
import { useRef,useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
const DoctorFollowUp = () => {
    const dateRef = useRef(null);
    let {id} = useParams();
    const [result,setResult]=useState(false);
    const [buttons,setButtons]=useState([]);
    const [message,setMessage]=useState("");
    useEffect(() => {
        check();
    }, []);
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
    useEffect(()=>{
        setDateMin();
    },[result])
    function setDateMin(){
        const date =dateRef.current;
        if(dateRef.current){
            const tomorrow = new Date();
            tomorrow.setDate(new Date().getDate() + 1);
            date.min = tomorrow.toISOString().split('T')[0];
        }
    }
    async function changeWeb(){
        const date = document.getElementById('date').value;
        await axios.get(`http://localhost:3000/doctor/schedFollowUp/${id}/${date}`,{withCredentials:true}).then((res)=>{
            console.log(res.data.result);
            setButtons(res.data.result);
        }).catch((err)=>{
            
        })
    }
    
    async function scheduleThis(e){
        const date = document.getElementById('date').value;
        await axios.post(`http://localhost:3000/doctor/reserve/${id}`,{date:date,time:e.target.innerHTML},{withCredentials:true}).then((res)=>{
            if(res.data.message=="There is already an appointment at the specified time."){
                setMessage(res.data.message);
            }
            else{
                window.location.href="/doctor/appointments"
            }
            
        }).catch((err)=>{
            
        })
    }
    return (
        <div>
            { result&&<div>
                <h1>Doctor Follow Up</h1>
                <input name="date" type="date" ref={dateRef} id="date" onInput={changeWeb} />
                {buttons.map((button)=>
                <button key={button.id} onClick={scheduleThis}>{button.from},{button.to}</button>)}
                {message&&<p>{message}</p>}
            </div>}
        </div>
    );
};

export default DoctorFollowUp;
