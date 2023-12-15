import { CardContent, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useState } from 'react'
import {useEffect} from 'react'
import { Card } from '@mui/material';
import {InputLabel,MenuItem,Select,FormControl} from '@mui/material'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Navbar from './Navbar';
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
    const [breadcrumbs, setBreadcrumbs] = useState([{}]);
    async function check() {
      await axios
        .get("http://localhost:3000/doctor/contract", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.contract == "rej") {
            window.location.href = "/doctor/contract";
          } else {
            setResult(true);
            // Check if breadcrumbs contain the "Home" breadcrumb
            let savedBreadcrumbs = JSON.parse(localStorage.getItem('breadcrumbs'));
            setBreadcrumbs(savedBreadcrumbs);
  
            const homeBreadcrumb = { label: "editInfo", href: "/doctor/edit" };
            const hasHomeBreadcrumb = savedBreadcrumbs.some(
              (item) => item.label == homeBreadcrumb.label
            );
            console.log(hasHomeBreadcrumb)
            // If not, add it to the breadcrumbs
            if (!hasHomeBreadcrumb) {
              const updatedBreadcrumbs = [homeBreadcrumb];
              setBreadcrumbs(updatedBreadcrumbs);
              localStorage.setItem('breadcrumbs', JSON.stringify(updatedBreadcrumbs));
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
      await axios
        .get("http://localhost:3000/loggedIn", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.type != "doctor") {
            if (res.data.type == "patient") {
              window.location.href = "/patient/home";
            } else if (res.data.type == "admin") {
              window.location.href = "/admin/home";
            } else {
              window.location.href = "/";
            }
          }
        })
        .catch((err) => {
          if (err.response.status == 401) {
            window.location.href = "/";
          }
        });
    }
  
    function handleBreadcrumbClick(event, breadcrumb) {
        event.preventDefault();
        // Find the index of the clicked breadcrumb in the array
        const index = breadcrumbs.findIndex((item) => item.label == breadcrumb.label);
        let updatedBreadcrumbs;
        if(index == -1){
          updatedBreadcrumbs = ([...breadcrumbs, breadcrumb]);
        }else{
        // Slice the array up to the clicked breadcrumb (inclusive)
          updatedBreadcrumbs = breadcrumbs.slice(0, index + 1);
        }
        console.log(index);
        // Set the updated breadcrumbs
        setBreadcrumbs(updatedBreadcrumbs);
    
        // Save updated breadcrumbs to localStorage
        localStorage.setItem('breadcrumbs', JSON.stringify(updatedBreadcrumbs));
    
        console.log(updatedBreadcrumbs)
        // Navigate to the new page
        window.location.href = breadcrumb.href;
      }
  
      function allAppointments() {
        const breadcrumb = { label: "appointments", href: "/doctor/appointments" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
    
      function toFollowUp() {
        const breadcrumb = { label: "followUp", href: "/doctor/followup" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
    
      function goHome(){
        const breadcrumb = { label: "home", href: "/doctor/home" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
    
      function goPatients(){
        const breadcrumb = { label: "patients", href: "/doctor/patients" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      
      function goTimeSlots(){
        const breadcrumb = { label: "timeSlots", href: "/doctor/timeslots"};
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      
      function editDoctorInfo(){
        const breadcrumb = { label: "editInfo", href: "/doctor/edit" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }

     function handleChange(event){
        setUpdateTerm(event.target.value);
    }
    const [updateTerm,setUpdateTerm]=useState("");
  return (
    <div>
      {result && <div>
        <Navbar goHome={goHome} goPatients={goPatients} goTimeSlots={goTimeSlots} editDoctorInfo={editDoctorInfo} goAppointments={allAppointments} goFollowUp={toFollowUp}/>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
                        {breadcrumbs.map((breadcrumb, index) => (
                        <Link
                            key={index}
                            underline="hover"
                            color="inherit"
                            href={breadcrumb.href}
                            onClick={(event) => handleBreadcrumbClick(event, breadcrumb)}
                        >
                            {breadcrumb.label}
                        </Link>
                        ))}
        </Breadcrumbs>
        <Card sx={{width:"70%",height:"60%"}}>
        <CardContent>
            <Typography variant="h4">Update your info</Typography>
            <Card sx={{display:"flex"}}>
                <Card>
                    <CardContent>
                        <Typography variant="h5">Update term</Typography>
                        <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Update term</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={updateTerm}
                            label="Age"
                            onChange={handleChange}
                        >
                            <MenuItem value={"email"}>email</MenuItem>
                            <MenuItem value={"rate"}>rate</MenuItem>
                            <MenuItem value={"affiliation"}>affiliation</MenuItem>
                        </Select>
                        </FormControl>
                    </CardContent>
                </Card>        
            </Card>
        </CardContent>
        </Card>
        

      </div>}
    </div>
  );
};

export default DoctorInfo;
