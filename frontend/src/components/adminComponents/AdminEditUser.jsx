import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { motion } from 'framer-motion';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import MuiAlert from '@mui/material/Alert';
import Navbar from './Navbar';
import { Paper } from '@mui/material';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AdminDeleteUser() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messageCreate, setMessageCreate] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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

        const editBreadcrumb = { label: "Edit A User", href: "/admin/deleteUser" };
        const hasEditBreadcrumb = savedBreadcrumbs.some(
          (item) => item.label == editBreadcrumb.label
        );
          console.log(hasEditBreadcrumb)
        // If not, add it to the breadcrumbs
        if (!hasEditBreadcrumb) {
          const updatedBreadcrumbs = [editBreadcrumb];
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
        localStorage.removeItem('breadcrumbs');
    } catch (err) {
        setError(err.message);
    }
}

  function toggleFilter() {
    setIsOpen(!isOpen);
  }

  async function deleteUser() {
    let username = document.getElementById("usernameToBeDeleted").value;
    const res = await axios.post("http://localhost:3000/admin/deleteUser",
        {
          username: username,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.message == "User deleted successfully"){
        document.getElementById("usernameToBeDeleted").value= "";
        }
        setMessage(res.data.message);
      });
  }

  async function createAdmin(){
    let username = document.getElementById("usernameToBeCreated").value;
    let password = document.getElementById("password").value;
    let email = document.getElementById("email").value;
    const res = await axios.post("http://localhost:3000/admin/register",
        {
          username: username,
          password: password,
          email: email,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.message == "Admin created successfully"){
        document.getElementById("usernameToBeCreated").value= "";
        document.getElementById("password").value= "";
        document.getElementById("email").value= "";
        }
        setMessageCreate(res.data.message);
      });
  }


  return (
    (result && <div>
     <div>
     <Navbar goHome={goHome} goEdit={editUserButton} goDoctor={uploadedInfoButton} goHealth={healthPackagesButton} goPass={changePasswordButton}/>
            <div style={{display:'flex'}}>
      
      <div style={{display:'grid', marginLeft:50, marginTop:50}}>
      
     <div style={{display:'flex', marginLeft:50, flexDirection:'column'}}>
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
      <div style={{display:'flex',marginLeft:200}}>
      <Paper style={{marginTop: '50px',marginRight:100 ,display:'flex', flexDirection:'column', alignItems:'center'}}>
            {<div style ={{display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'20px',height:'450px', width:'650px'}}>
                <Typography style ={{justifyContent:'center', marginBottom:'20px'}} variant='h4'>Remove User</Typography>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px', width: '300px' }}>
             <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px',marginTop:10 }}>
                  <Typography style={{ marginRight: '10px', width: '100px' }}>Username:</Typography>
                   <TextField id="usernameToBeDeleted" name="usernameToBeDeleted" label="Enter Username" />
             </div>
                
                </div>

                <Button style={{marginTop:'150px', marginBottom:'20px'}} variant="contained" onClick={deleteUser} >Delete</Button>
                {(message=="User deleted successfully" && <Alert severity="success">{message}</Alert>) || (message && <Alert severity="error">{message}</Alert>)}

            </div>}
       </Paper>
       <Paper style={{marginTop: '50px',marginRight:0 ,display:'flex', flexDirection:'column', alignItems:'center'}}>
            {<div style ={{display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'20px',height:'450px', width:'650px'}}>
                <Typography style ={{justifyContent:'center', marginBottom:'20px'}} variant='h4'>Create Admin</Typography>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px', width: '300px' }}>
             <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                  <Typography style={{ marginRight: '10px', width: '100px' }}>Username:</Typography>
                   <TextField id="usernameToBeCreated" name="usernameToBeCreated" label="Enter Username" />
             </div>
            <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                   <Typography style={{ marginRight: '10px', width: '100px' }}>Password:</Typography>
                  <TextField type='password' id="password" name="password" label="Enter Password" />
              </div>
             <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                  <Typography style={{ marginRight: '10px', width: '100px' }}>Email:</Typography>
                  <TextField id="email" name="email" label="Enter Email" />
                 </div>

                </div>

                <Button style={{marginTop:'30px', marginBottom:'20px'}} variant="contained" onClick={createAdmin}>Create</Button>
                {(messageCreate=="Admin created successfully" && <Alert severity="success">{messageCreate}</Alert>) || (messageCreate && <Alert severity="error">{messageCreate}</Alert>)}
        </div>
            }
            </Paper>
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
