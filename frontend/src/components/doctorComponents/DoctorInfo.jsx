import { CardContent, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useState } from 'react'
import {useEffect} from 'react'
import { Card } from '@mui/material';
import {InputLabel,MenuItem,Select,FormControl} from '@mui/material'
import { TextField } from '@mui/material';
import Navbar from './Navbar';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
const DoctorInfo = () => {
    const [error,setError]= useState("")
    const updateDoctor= async()=>{
        console.log(updateTerm,newValue)
        const updateTerm2=updateTerm;
        const updateValue=newValue;
        await axios.post("http://localhost:3000/doctor/updateInfo",{
            updateTerm:updateTerm2,
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
    const [updateTerm,setUpdateTerm]=useState("email");
    const [newValue,setNewValue]=useState("");
    function handleValueChange(e){
        setNewValue(e.target.value);
    }
  return (
    <div>
      {result &&<>
        <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }} 
                open={error != ""}
                autoHideDuration={2000}
                onClose={() => {
                    setError("");
                }}
                message={error}>
                    <Alert severity="info">{error}</Alert>
                </Snackbar> 
                
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
        <div style={{display:"flex",justifyContent:"center",alignItems:"center", height:"90vh"}}>
        <Card sx={{width:"80%",height:"80%",padding:5}}>
        <Typography variant="h4">Update your information</Typography>
        <CardContent sx={{width:"100%",height:"80%",display:"flex",justifyContent:"center",alignItems:"center"}}>
                <Card sx={{width:"30%",height:"100%"}}>
                   
                    <CardContent sx={{display:"flex",height:"100%",justifyContent:"space-between",alignItems:"center",flexDirection:"column"}}>
                    <Typography variant="h5">Change Your background information</Typography>
                        <FormControl sx={{minWidth:300}}>
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
                        <TextField onChange={handleValueChange} id="updateValue" label="new value" variant="outlined" sx={{minWidth:300}} />
                        <Button onClick={updateDoctor} variant='contained'>Update</Button>
                    </CardContent>
                </Card>
                <Card style={{marginLeft:"5%",height:"100%",width:"50%"}}>
                    <CardContent >
                    {<div style ={{display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'20px',height:'400px', width:'650px'}}>
                <Typography style ={{justifyContent:'center', marginBottom:'20px'}} variant='h4'>Change Password</Typography>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px', width: '400px' }}>
             <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px',marginTop:10 }}>

                   <TextField type="password" id="oldPassword" name="oldPassword" label="Enter Old Password" />
             </div>
             <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px',marginTop:10 }}>

                   <TextField type="password" id="newPassword" name="newPassword" label="Enter New Password" />
             </div>
             <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px',marginTop:10 }}>

                   <TextField type="password" id="confirmationPassword" name="confirmationPassword" label="Enter Confirm Password" />
             </div>
                </div>

                <Button style={{marginTop:'30px', marginBottom:'20px'}} variant="contained"  >Change</Button>

            </div>}
                    </CardContent>    
                </Card>   
        </CardContent>
        </Card>
        

      </div></>}
    </div>
  );
};

export default DoctorInfo;
