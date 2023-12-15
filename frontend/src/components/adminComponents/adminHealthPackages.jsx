import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAlert from '@mui/material/Alert';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { motion } from 'framer-motion';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AdminHome() {
    const [error, setError] = useState('');
    const [healthPackages, setHealthPackages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [messageAdd, setMessageAdd] = useState("");
    const [messageCreate, setMessageCreate] = useState("");

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

        const healthPackageBreadcrumb = { label: "Health Packages", href: "/admin/healthPackages" };
        const hasHealthPackageBreadcrumb = savedBreadcrumbs.some(
          (item) => item.label == healthPackageBreadcrumb.label
        );
          console.log(hasHealthPackageBreadcrumb)
        // If not, add it to the breadcrumbs
        if (!hasHealthPackageBreadcrumb) {
          const updatedBreadcrumbs = [healthPackageBreadcrumb];
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
  
    useEffect(() => {
      getPackages();
    }, []);
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
    function toggleFilter() {
      setIsOpen(!isOpen);
    }

    function deletePackage(){//MAKE IT WORK
    }

    async function addHealthPackage(){
      try {
        const res = await axios.post("http://localhost:3000/admin/healthPackages", {
          packageName: document.getElementById('packageNameToBeCreated').value,
          price: document.getElementById('priceToBeCreated').value,
          doctorDiscount: document.getElementById('doctorDiscountToBeCreated').value,
          pharmacyDiscount: document.getElementById('pharmacyDiscountToBeCreated').value,
          familyDiscount: document.getElementById('familyDiscountToBeCreated').value,
        }, {withCredentials: true,}).then((res) => {
          if (res.data.message == "package created successfully"){
            document.getElementById("packageNameToBeCreated").value= "";
            document.getElementById("priceToBeCreated").value= "";
            document.getElementById("doctorDiscountToBeCreated").value= "";
            document.getElementById("pharmacyDiscountToBeCreated").value= "";
            document.getElementById("familyDiscountToBeCreated").value= "";
          }
          setMessageAdd(res.data.message);
        });
  
      } catch (err) {
        setMessageAdd(err.message);
      }
    }

    async function editHealthPackage(){
      try {
        const res = await axios.post("http://localhost:3000/admin/healthPackages/updated", {
          packageName: document.getElementById('packageNameToBeEdited').value,
          price: document.getElementById('priceToBeEdited').value,
          doctorDiscount: document.getElementById('doctorDiscountToBeEdited').value,
          pharmacyDiscount: document.getElementById('pharmacyDiscountToBeEdited').value,
          familyDiscount: document.getElementById('familyDiscountToBeEdited').value,
        }, {withCredentials: true,}).then((res) => {
          if (res.data.message == "package Edited successfully"){
            window.location.reload();
          }
          setMessageCreate(res.data.message);
        });
  
      } catch (err) {
        setMessageCreate(err.message);
      }
    }

    return(result && <div>
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
    <TableContainer component={Paper} style={{marginLeft:0, width:1500}}>
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
      <Table sx={{ minWidth: 0 }} aria-label="simple table">
        <TableHead bgcolor="secondary.main.light" style={{backgroundColor:'grey'}}>
          <TableRow>
            <TableCell align="left">Package Name</TableCell>
            <TableCell align="left">Price</TableCell>
            <TableCell align="left">Doctor Discount</TableCell>
            <TableCell align="left">Pharmacy Discount</TableCell>
            <TableCell align="left">Family Discount</TableCell>
            <TableCell align='left'>Is Deleted</TableCell>
            <TableCell align='left'>Delete Package</TableCell>
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
              <TableCell align='left'><Button variant='contained' onClick={deletePackage}> Delete </Button></TableCell>
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
                  <TextField id="packageNameToBeCreated" name="packageName" label="Enter Package Name" />
            </div>
              <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                  <Typography style={{ marginRight: '10px', width: '100px' }}>Price:</Typography>
                <TextField id="priceToBeCreated" name="price" label="Enter Price" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                <Typography style={{ marginRight: '10px', width: '100px' }}>Doctor Discount:</Typography>
                <TextField id="doctorDiscountToBeCreated" name="doctorDiscount" label="Enter Doctor Discount" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
              <Typography style={{ marginRight: '10px', width: '100px' }}>Pharmacy Discount:</Typography>
                <TextField id="pharmacyDiscountToBeCreated" name="pharmacyDiscount" label="Enter Pharmacy Discount" />
              </div>
                <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                <Typography style={{ marginRight: '10px', width: '100px' }}>Family Discount:</Typography>
                <TextField id="familyDiscountToBeCreated" name="familyDiscount" label="Enter Family Discount" />
              </div>
          </div>
          
          <Button style={{marginTop:'20px', marginBottom:'20px'}} variant="contained" onClick={addHealthPackage} >Add</Button>
          {(messageAdd=="package created successfully" && <Alert severity="success">{messageAdd}</Alert>) || (messageAdd && <Alert severity="error">{messageAdd}</Alert>)}

          </div>}
      </div>
      <div style={{marginTop: '50px',marginRight:0 ,display:'flex', flexDirection:'column', alignItems:'center'}}>
          {<div style ={{display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'20px',height:'490px', width:'650px', border:'2px solid black'}}>
              <Typography style ={{justifyContent:'center', marginBottom:'20px'}} variant='h4'>Edit a New Health Package</Typography>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px', width: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                <Typography style={{ marginRight: '10px', width: '100px' }}>Package Name:</Typography>
                  <TextField id="packageNameToBeEdited" name="packageName" label="Enter Package Name" />
            </div>
          <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                  <Typography style={{ marginRight: '10px', width: '100px' }}>Price:</Typography>
                <TextField id="priceToBeEdited" name="price" label="Enter Price" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                <Typography style={{ marginRight: '10px', width: '100px' }}>Doctor Discount:</Typography>
                <TextField id="doctorDiscountToBeEdited" name="doctorDiscount" label="Enter Doctor Discount" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
              <Typography style={{ marginRight: '10px', width: '100px' }}>Pharmacy Discount:</Typography>
                <TextField id="pharmacyDiscountToBeEdited" name="pharmacyDiscount" label="Enter Pharmacy Discount" />
              </div>
                <div style={{ display: 'flex', alignItems: 'center',marginBottom: '10px' }}>
                <Typography style={{ marginRight: '10px', width: '100px' }}>Family Discount:</Typography>
                <TextField id="familyDiscountToBeEdited" name="familyDiscount" label="Enter Family Discount" />
              </div>
              </div>

              <Button style={{marginTop:'20px', marginBottom:'20px'}} variant="contained" onClick={editHealthPackage} >Edit</Button>
              {(messageCreate=="package Edited successfully" && <Alert severity="success">{messageCreate}</Alert>) || (messageCreate && <Alert severity="error">{messageCreate}</Alert>)}

          </div>}
      </div>
      </div>
      </div>
      </div>
      
      </div>
  
      );
}
