import React from 'react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import Joi from 'joi';
const DoctorTimeSlots = () => {
    const days=["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [result, setResult] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);
    const [message, setMessage] = useState("");
    useEffect(() => {check() , getTimeSlots()}, []);

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
    async function getTimeSlots() {
        try {
            const res = await axios.get("http://localhost:3000/doctor/timeSlots", {
                withCredentials: true
            });
            setTimeSlots(res.data.result);
        } catch (err) {
            console.log(err);
        }
    }
   

    



    async function createNewTimeSlot() {
        try {
            const day = document.getElementById("dayOfWeek").value;
            const from = document.getElementById("startTime").value;
            const to = document.getElementById("endTime").value;

            const schema = Joi.object({
                day: Joi.string().required().min(5).max(20),
                "Start Time": Joi.string().required(),
                "End Time": Joi.string().required(),
              });
            const {error,result}=schema.validate({day:day,"Start Time":from,"End Time":to});
            if (error) {
                return setMessage(error.details[0].message);
            }
            const res = await axios.post("http://localhost:3000/doctor/addTimeSlot", {
                day: day,
                from: from,
                to: to
            }, {
                withCredentials: true
            });
            setMessage(res.data.message);
            if(res.data.message=="Timeslot created successfully."){
                setTimeSlots(res.data.times)
            }
        } catch (err) {
            console.log(err);
        }
    }
    async function deleteTimeSlot(e) {
            const id=e.target.id;
            const res = await axios.get(`http://localhost:3000/doctor/deleteTimeSlot/${id}`, {
                withCredentials: true
            });
            setTimeSlots(res.data.result);  
    }
    return (
        <div>
            {result&&<div>
                <h1>Doctor Time Slots</h1>
            <h2>
                Current time slots
            </h2>
            <table >
                <tr >
                    {
                        days.map((day) => 
                            <tr style={{"border": "1px solid black","border-collapse": "collapse","padding": "5px"}}>
                                <th style={{"border": "1px solid black","border-collapse": "collapse","padding": "5px"}}>
                                    {day}</th> {
                                timeSlots.map((timeSlot) => 
                                    timeSlot.day.toLowerCase() == day.toLowerCase() && <td className="tableRow" onClick={deleteTimeSlot} id={timeSlot._id} style={{"border": "1px solid black",
                                    "border-collapse": "collapse",
                                    "padding": "5px","cursor":"pointer"}}>{timeSlot.from} - {timeSlot.to}</td>
                                )
                            } </tr>
                        )
                    }
                </tr>
            </table>
            <h2>
                Insert new time slot
            </h2>

            <label for="day">Day of Week:</label>
            <select name="day" id="dayOfWeek">
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
            </select>
            <br />
            <label for="form">Start Time:</label>
            <input type="time" name="from" id="startTime" min="0" max="24"  />
            <br />
            <label for="to">End Time:</label>
            <input type="time" name="to" id="endTime" min="0" max="24" />
            <br />
            <input onClick={createNewTimeSlot} type="submit" value="Submit" />
            <p>{message}</p>
            </div>}
        </div>
    );
};

export default DoctorTimeSlots;
