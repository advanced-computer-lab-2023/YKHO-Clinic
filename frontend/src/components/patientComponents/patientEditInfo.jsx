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
const PatientEditInfo = () => {
    const [error,setError]= useState("")
    const [passError,setPassError]= useState("")

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

    const changePassword=async()=>{
        const oldPassword=document.getElementById("oldPassword").value;
        const newPassword=document.getElementById("newPassword").value;
        const confirmationPassword=document.getElementById("confirmationPassword").value;

        await axios.post("http://localhost:3000/patient/changePassword",{
          oldPassword:oldPassword,
          newPassword:newPassword,
          confirmationPassword:confirmationPassword,
        },{withCredentials:true}).then((res)=>{
          setPassError(res.data.message);
        })
      }

    //checks if logged in and if not redirects to login page
    const [result,setResult]=useState(false);
    useEffect(()=>{check()},[]);
    const [breadcrumbs, setBreadcrumbs] = useState([{}]);
    async function check() {

        const res = await axios.get("http://localhost:3000/loggedIn", {
            withCredentials: true
        }).then((res) => {

            if (res.data.type != "patient") {

                window.location.href = "/"
            }
            else {
                setResult(true)

                let savedBreadcrumbs = JSON.parse(localStorage.getItem('breadcrumbs'));
                setBreadcrumbs(savedBreadcrumbs);

                const homeBreadcrumb = { label: "editInfo", href: "/patient/editInfo" };
                const hasHomeBreadcrumb = savedBreadcrumbs.some(
                  (item) => item.label == homeBreadcrumb.label
                );
                
                // If not, add it to the breadcrumbs
                if (!hasHomeBreadcrumb) {
                  const updatedBreadcrumbs = [homeBreadcrumb];
                  setBreadcrumbs(updatedBreadcrumbs);
                  localStorage.setItem('breadcrumbs', JSON.stringify(updatedBreadcrumbs));
                }
      
            }
        }
        ).catch((err) => {
            if (err.response.status == 401) {
                window.location.href = "/"
            }
        })
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
    
        // Navigate to the new page
        window.location.href = breadcrumb.href;
      }

      function goHome() {
        const breadcrumb = { label: "Home", href: "/patient/home" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      
      function handlePrescriptions() {
          //window.location.href = "/patient/Prescriptions"
          const breadcrumb = { label: "prescriptions", href: "/patient/Prescriptions" };
          handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      function handleAppointments() {
          //window.location.href = "/patient/Appointments"
          const breadcrumb = { label: "Appointments", href: "/patient/Appointments" };
          handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      function handleFamilyMembers() {
          //window.location.href = "/patient/LinkFamily"
          const breadcrumb = { label: "LinkFamily", href: "/patient/LinkFamily" };
          handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      function handleManageFamily() {
          //window.location.href = "/patient/readFamilyMembers"
          const breadcrumb = { label: "FamilyMembers", href: "/patient/readFamilyMembers" };
          handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      function viewAllDoctors() {
        const breadcrumb = { label: "allDoctors", href: "/patient/search" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      function toChats(){
        const breadcrumb = { label: "chats", href: "/chats" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      function goFiles(){
        const breadcrumb = { label: "files", href: "/patient/files" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      function goHealthPackages(){
        const breadcrumb = { label: "HealthPackages", href: "/patient/healthPackages/-1" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }

      function goEditInfo(){
        const breadcrumb = { label: "editInfo", href: "/patient/editInfo" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
        const handleSearch = (values) => {
            if(values != "" && values != null){
                const breadcrumb = { label: "allDoctors", href: `/patient/search/${values}` };
                handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
            }
        }
        const [isOpen, setIsOpen] = useState(false);
        function toggleFilter() {
            setIsOpen(!isOpen);
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
        <Navbar goEditInfo={goEditInfo} openHelp={toggleFilter} goHealthPackages={goHealthPackages} goHome={goHome} handleSearch={handleSearch} goFiles={goFiles} handlePrescriptions={handlePrescriptions} handleAppointments={handleAppointments} handleFamilyMembers={handleFamilyMembers} handleManageFamily={handleManageFamily} viewAllDoctors={viewAllDoctors} toChats={toChats} />
        <Breadcrumbs sx={{padding:'15px 0px 0px 15px'}} separator="›" aria-label="breadcrumb">
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

            <Button style={{marginTop:'30px', marginBottom:'20px'}} variant="contained" onClick={changePassword} >Change</Button>
            <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }} 
            open={passError != ""}
            autoHideDuration={2000}
            onClose={() => {
                setError("");
            }}
            message={passError}>
                <Alert severity="info">{passError}</Alert>
            </Snackbar>               
        </div>}
      </div></>}
    </div>
  );
};

export default PatientEditInfo;
