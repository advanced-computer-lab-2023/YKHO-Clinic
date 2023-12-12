import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAlert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { motion } from 'framer-motion';
import { Container, duration } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AdminDeleteUser() {
  const [error, setError] = useState("");
  const [healthPackages, setHealthPackages] = useState([]);
  const [message, setMessage] = useState("");
  const [messageCreate, setMessageCreate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  function createAdminButton() {
    window.location.href = "/admin/register";
  }
  function goHome(){
    window.location.href = "/admin/home";
  }

  function uploadedInfoButton() {
    window.location.href = "/admin/uploadedInfo";
  }

  function healthPackagesButton() {
    window.location.href = "/admin/healthPackages";
  }

  function LogoutButton() {
    window.location.href = "/";
  }

  function changePasswordButton(){
    window.location.href='/admin/changePassword';
  }

  function toggleFilter() {
    setIsOpen(!isOpen);
  }

  function editUserButton() {
    window.location.href = "/admin/deleteUser";
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
    <div>
     <div>
            <div style={{display:'flex'}}>
      <Box bgcolor="primary.main" style={{ position: 'sticky', top: 0, zIndex: 1, width: isOpen? 290:80, height: 925}}>
        <div style={{ marginLeft: 8 }}>
          <IconButton onClick={toggleFilter}>
            <MenuIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </div>
        <motion.div
          initial={{ width: 0, opacity:0 ,backgroundColor: 'transparent' }}
          animate={{ width: isOpen ? '310px' : 0, opacity: isOpen? 1:0 , backgroundColor: isOpen ? 'secondary' : 'transparent' }}
          transition={{ duration: 0.3 }}
          style={{overflow: 'hidden' }}
        >
          <Button variant ='contained' style={{marginBottom:3,width:280}} onClick={goHome}>Home</Button>
          
          <Button variant='contained' style={{ marginBottom:3,width:280  }} onClick={editUserButton}>
            Edit A User
          </Button>
          <Button variant='contained' style={{ marginBottom:3,width:280  }} onClick={uploadedInfoButton}>
            View Doctors Uploaded Info
          </Button>
          <Button variant='contained' style={{ marginBottom:3 ,width:280 }} onClick={healthPackagesButton}>
            Health Packages 
          </Button>
          <Button variant='contained' style={{ marginRight: '190px',marginTop:600,width:280,marginBottom:3  }} onClick={changePasswordButton}>
            Change Password
          </Button>
          <Button variant='contained' style={{ marginRight: '190px',marginBottom:3,width:280  }} onClick={LogoutButton}>
            LOGOUT
          </Button>
        </motion.div>
      </Box>
      <div style={{display:'grid', marginLeft:50, marginTop:50}}>
      
     <div style={{display:'flex', marginLeft:50}}>
      <div style={{marginTop: '50px',marginRight:100 ,display:'flex', flexDirection:'column', alignItems:'center'}}>
            {<div style ={{display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'20px',height:'450px', width:'650px', border:'2px solid black'}}>
                <Typography style ={{justifyContent:'center', marginBottom:'20px'}} variant='h4'>Remove User</Typography>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px', width: '300px' }}>
             <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px',marginTop:10 }}>
                  <Typography style={{ marginRight: '10px', width: '100px' }}>Username:</Typography>
                   <TextField id="usernameToBeDeleted" name="usernameToBeDeleted" label="Enter Username" />
             </div>
                
                </div>

                <Button style={{marginTop:'150px', marginBottom:'20px'}} variant="contained" onClick={deleteUser} >Delete</Button>
                {message && <Alert severity="error">{message}</Alert>}

            </div>}
       </div>
       <div style={{marginTop: '50px',marginRight:0 ,display:'flex', flexDirection:'column', alignItems:'center'}}>
            {<div style ={{display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'20px',height:'450px', width:'650px', border:'2px solid black'}}>
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
            </div>}
       </div>
       </div>
        </div>
        </div>
        
        </div>
    <div>
      
    </div>
    </div>
  );
}
