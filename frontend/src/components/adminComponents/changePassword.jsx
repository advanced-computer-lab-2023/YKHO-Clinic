import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAlert from '@mui/material/Alert';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { motion } from 'framer-motion';
import { Container, duration } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Navbar from './Navbar'
import Paper from '@mui/material/Paper'
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ChangePassword() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [result,setResult]=useState(false);
  useEffect(()=>{check()},[]);
  const [breadcrumbs, setBreadcrumbs] = useState([{}]);
  async function check() {
    try {
      const res = await axios.get("http://localhost:3000/loggedIn", {
        withCredentials: true
      });
  
      if (res.data.type === "admin") {
        setResult(true);

        // Check if breadcrumbs contain the "Home" breadcrumb
        let savedBreadcrumbs = JSON.parse(localStorage.getItem('breadcrumbs'));
        setBreadcrumbs(savedBreadcrumbs);

        const changePasswordBreadcrumb = { label: "Change Password", href: "/admin/changePassword" };
        const hasChangePasswordBreadcrumb = savedBreadcrumbs.some(
          (item) => item.label == changePasswordBreadcrumb.label
        );
          console.log(hasChangePasswordBreadcrumb)
        // If not, add it to the breadcrumbs
        if (!hasChangePasswordBreadcrumb) {
          const updatedBreadcrumbs = [changePasswordBreadcrumb];
          setBreadcrumbs(updatedBreadcrumbs);
          localStorage.setItem('breadcrumbs', JSON.stringify(updatedBreadcrumbs));
        }
      } else if (res.data.type === "patient") {
        window.location.href = "/patient/home";
      } else if (res.data.type === "doctor") {
        window.location.href = "/doctor/home";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        window.location.href = "/";
      } else {
        setError(err.message);
      }
    }
  }

  const [isOpen, setIsOpen] = useState(false);
  function createAdminButton() {
    window.location.href = "/admin/register";
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

  function goHome() {
    const breadcrumb = { label: "Home", href: "/admin/home" };
    handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
  }
  
  function editUserButton() {
    const breadcrumb = { label: "Edit A User", href: "/admin/deleteUser" };
    handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
  }
  
  function uploadedInfoButton() {
    const breadcrumb = { label: "View Doctors Uploaded Info", href: "/admin/uploadedInfo" };
    handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
  }
  
  function healthPackagesButton() {
    const breadcrumb = { label: "Health Packages", href: "/admin/healthPackages" };
    handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
  }
  
  function changePasswordButton() {
    const breadcrumb = { label: "Change Password", href: "/admin/changePassword" };
    handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
  }


  async function LogoutButton() {
    try {
        const res = await axios.get("http://localhost:3000/logout", {
            withCredentials: true
        });
        window.location.href = "/";
        
    } catch (err) {
        setError(err.message);
    }
}
  function changePasswordButton(){
    window.location.href='/admin/changePassword';
  }
  function toggleFilter() {
    setIsOpen(!isOpen);
  }
  async function deleteUserButton() {

    await axios
      .put(
        "http://localhost:3000/admin/changePassword",
        {
          oldPassword: document.getElementById("oldPassword").value,
          newPassword: document.getElementById("newPassword").value,
          confirmationPassword: document.getElementById("confirmationPassword").value,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.message == "Password changed successfully"){
          document.getElementById("oldPassword").value = "";
          document.getElementById("newPassword").value = "";
          document.getElementById("confirmationPassword").value = "";
        }
        setMessage(res.data.message);
      });
  }

  return (
    (result && <div>
     <div>
     <Navbar goHome={goHome} goEdit={editUserButton} goDoctor={uploadedInfoButton} goHealth={healthPackagesButton} goPass={changePasswordButton}/>
            <div style={{display:'flex'}}>
          
      <div style={{display:'grid', marginLeft:50, marginTop:50}}>
      
     <div style={{display:'flex', marginLeft:50}}>
      
      <div style={{marginRight:100 ,display:'flex', flexDirection:'column'}}>
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
        
            {<Paper style ={{display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'20px',height:'400px', width:'650px',marginLeft:"550px",marginTop:"50px"}}>
                <Typography style ={{justifyContent:'center', marginBottom:'20px'}} variant='h4'>Change Password</Typography>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px', width: '300px' }}>
             <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px',marginTop:10 }}>
                  <Typography style={{ marginRight: '10px', width: '100px' }}>Old Password:</Typography>
                   <TextField id="oldPassword" name="oldPassword" label="Enter Old Password" />
             </div>
             <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px',marginTop:10 }}>
                  <Typography style={{ marginRight: '10px', width: '100px' }}>New Password:</Typography>
                   <TextField id="newPassword" name="newPassword" label="Enter New Password" />
             </div>
             <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px',marginTop:10 }}>
                  <Typography style={{ marginRight: '10px', width: '100px' }}>Confirm Password:</Typography>
                   <TextField id="confirmationPassword" name="confirmationPassword" label="Enter Confirm Password" />
             </div>
                </div>

                <Button style={{marginTop:'30px', marginBottom:'20px'}} variant="contained" onClick={deleteUserButton} >Change</Button>
                {(message=="Password changed successfully" && <Alert severity="success">{message}</Alert>) || (message && <Alert severity="error">{message}</Alert>)}

            </Paper>}
        
       </div>
       
       </div>
        </div>
        </div>
        
        </div>
    <div>
      
    </div>
    </div>
  ));
}
