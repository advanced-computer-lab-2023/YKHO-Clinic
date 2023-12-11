import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
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

export default function AdminHome() {
    const [error, setError] = useState('');
    const [healthPackages, setHealthPackages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
  
    async function getPackages() {
        try {
          const res = await axios.get("http://localhost:3000/getHealthPackages", {
            withCredentials: true,
          });
    
          setHealthPackages(res.data.healthPackages);
        } catch (err) {
          setError(err.message);
        }
      }
      console.log({healthPackages});
  
    useEffect(() => {
      getPackages();
    }, []);
    function goHome(){
        window.location.href = "/admin/home";
        }
    function createAdminButton() {
        window.location.href = "/admin/register";
      }
    
      function deleteUserButton() {
        window.location.href = "/admin/deleteUser";
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
      return(
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
          
          <Button variant='contained' style={{ marginBottom:3,width:280  }} onClick={deleteUserButton}>
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
      <TableContainer component={Paper} style={{marginLeft:0, width:1500}} >
        <Table sx={{ minWidth: 0 }} aria-label="simple table">
          <TableHead bgcolor="secondary.main.light" style={{backgroundColor:'grey'}}>
            <TableRow>
              <TableCell align="left">Package Name</TableCell>
              <TableCell align="left">Price</TableCell>
              <TableCell align="left">Doctor Discount</TableCell>
              <TableCell align="left">Pharmacy Discount</TableCell>
              <TableCell align="left">Family Discount</TableCell>
              <TableCell align='left'>Is Deleted</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {healthPackages.map((packagesTable) => (
              <TableRow key={packagesTable.packageName}>
                <TableCell align="left">{packagesTable.packageName}</TableCell>
                <TableCell align="left">{packagesTable.price}</TableCell>
                <TableCell align="left">{packagesTable.doctorDiscount}</TableCell>
                <TableCell align="left">{packagesTable.pharmacyDiscount}</TableCell>
                <TableCell align="left">{packagesTable.familyDiscount}</TableCell>
                <TableCell align='left'>{`${packagesTable.deleted}`}</TableCell>
                
              </TableRow>
            ))} 
          </TableBody>
        </Table>
      </TableContainer>
     <div style={{display:'flex', marginLeft:50}}>
      <div style={{marginTop: '50px',marginRight:100 ,display:'flex', flexDirection:'column', alignItems:'center'}}>
            {<div style ={{display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'20px',height:'490px', width:'650px', border:'2px solid black'}}>
                <Typography style ={{justifyContent:'center', marginBottom:'20px'}} variant='h4'>Add a New Health Package</Typography>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px', width: '300px' }}>
             <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                  <Typography style={{ marginRight: '10px', width: '100px' }}>Package Name:</Typography>
                   <TextField id="packageName" name="packageName" label="Enter Package Name" />
             </div>
                <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                   <Typography style={{ marginRight: '10px', width: '100px' }}>Price:</Typography>
                  <TextField id="price" name="price" label="Enter Price" />
              </div>
             <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                  <Typography style={{ marginRight: '10px', width: '100px' }}>Doctor Discount:</Typography>
                  <TextField id="doctorDiscount" name="doctorDiscount" label="Enter Doctor Discount" />
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                <Typography style={{ marginRight: '10px', width: '100px' }}>Pharmacy Discount:</Typography>
                 <TextField id="pharmacyDiscount" name="pharmacyDiscount" label="Enter Pharmacy Discount" />
                </div>
                 <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                 <Typography style={{ marginRight: '10px', width: '100px' }}>Family Discount:</Typography>
                 <TextField id="familyDiscount" name="familyDiscount" label="Enter Family Discount" />
                </div>
                </div>

                <Button style={{marginTop:'20px', marginBottom:'20px'}} variant="contained" >Add</Button>
                
            </div>}
       </div>
       <div style={{marginTop: '50px',marginRight:0 ,display:'flex', flexDirection:'column', alignItems:'center'}}>
            {<div style ={{display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'20px',height:'490px', width:'650px', border:'2px solid black'}}>
                <Typography style ={{justifyContent:'center', marginBottom:'20px'}} variant='h4'>Edit a New Health Package</Typography>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px', width: '300px' }}>
             <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                  <Typography style={{ marginRight: '10px', width: '100px' }}>Package Name:</Typography>
                   <TextField id="packageName" name="packageName" label="Enter Package Name" />
             </div>
            <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                   <Typography style={{ marginRight: '10px', width: '100px' }}>Price:</Typography>
                  <TextField id="price" name="price" label="Enter Price" />
              </div>
             <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                  <Typography style={{ marginRight: '10px', width: '100px' }}>Doctor Discount:</Typography>
                  <TextField id="doctorDiscount" name="doctorDiscount" label="Enter Doctor Discount" />
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                <Typography style={{ marginRight: '10px', width: '100px' }}>Pharmacy Discount:</Typography>
                 <TextField id="pharmacyDiscount" name="pharmacyDiscount" label="Enter Pharmacy Discount" />
                </div>
                 <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                 <Typography style={{ marginRight: '10px', width: '100px' }}>Family Discount:</Typography>
                 <TextField id="familyDiscount" name="familyDiscount" label="Enter Family Discount" />
                </div>
                </div>

                <Button style={{marginTop:'20px', marginBottom:'20px'}} variant="contained" >Add</Button>
                
            </div>}
       </div>
       </div>
        </div>
        </div>
        
        </div>
    
        );
}
