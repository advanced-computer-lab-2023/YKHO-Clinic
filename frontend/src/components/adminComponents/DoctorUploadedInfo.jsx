import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Table from '@mui/material/Table';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
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
import { Container, Typography, duration } from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from './Navbar';
export default DoctorUploadedInfo;

function DoctorUploadedInfo() {
  const [error, setError] = useState("");
  const [requests, setRequests] = useState([]);
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

        const infoBreadcrumb = { label: "View Doctors Uploaded Info", href: "/admin/uploadedInfo" };
        const hasInfoBreadcrumb = savedBreadcrumbs.some(
          (item) => item.label == infoBreadcrumb.label
        );
          console.log(hasInfoBreadcrumb)
        // If not, add it to the breadcrumbs
        if (!hasInfoBreadcrumb) {
          const updatedBreadcrumbs = [infoBreadcrumb];
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
    useEffect(() => {
        getRequests();
    }, []);

    async function getRequests() {
        try {
            const res = await axios.get("http://localhost:3000/getRequests", {
                withCredentials: true
            });
          
            setRequests(res.data.requests);
        } catch (err) {
            setError(err.data.message);
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
          
      } catch (err) {
          setError(err.message);
      }
  }

  function toggleFilter() {
      setIsOpen(!isOpen);
  }
  async function AcceptButton(e) {
      try {
          const res = await axios.post("http://localhost:3000/admin/acceptRequest", {
              email: e.target.id
          }, {
              withCredentials: true
          });
          window.location.reload();
      } catch (err) {
          setError(err.message);
      }
  }
    async function RejectButton(e) {
        try {
            const res = await axios.post("http://localhost:3000/admin/rejectRequest", {
                email: e.target.id
            }, {
                withCredentials: true
            });
            window.location.reload();
        } catch (err) {
            setError(err.data.message);
        }
  }

    return (
        (result && <div>
        <title>Home</title>
        <Navbar goHome={goHome} goEdit={editUserButton} goDoctor={uploadedInfoButton} goHealth={healthPackagesButton} goPass={changePasswordButton}/>
        <div style={{display:'flex', justifyContent:'center',alignItems:'center'}}>        
  <div >
        <TableContainer component={Paper} style={{ marginBottom:150, marginTop:150}}>
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
          <Table sx={{ minWidth: 650}} aria-label="simple table" >
            <TableHead bgcolor="primary.main.dark" style={{backgroundColor:'grey'}}>
              <TableRow>
                <TableCell align='left'>Name</TableCell>
                <TableCell align='left'>Email</TableCell>
                <TableCell align="left">Date of Birth</TableCell>
                <TableCell align="left">Mobile</TableCell>
                <TableCell align="left">Rate</TableCell>
                <TableCell align="left">Affiliation</TableCell>
                <TableCell align="left">Education</TableCell>
                <TableCell align='left'>ID</TableCell>
                <TableCell align='left'>Medical License</TableCell>
                <TableCell align='left'>Medical Degree</TableCell>
                <TableCell align='left'>Accept</TableCell>
                <TableCell align='left'>Reject</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((requestsTable) => (
                <TableRow key={requestsTable.name}>
                  <TableCell component="th" scope="row" align='left'>
                    {requestsTable.name} 
                  </TableCell>
                  <TableCell align="left">{requestsTable.email}</TableCell>
                  <TableCell align="left">
                    {new Date(requestsTable.DOB).toISOString().split('T')[0]}
                  </TableCell>
                  <TableCell align="left">{requestsTable.mobile}</TableCell>
                  <TableCell align="left">{requestsTable.rate}</TableCell>
                  <TableCell align="left">{requestsTable.affiliation}</TableCell>
                  <TableCell align="left">{requestsTable.education}</TableCell>
                  <TableCell align='left'>{<a href={`http://localhost:3000/admin/uploadedInfo/${requestsTable._id}/${"id"}`} download>
                      Download
                  </a>}</TableCell>
                  <TableCell align='left'>{<a href={`http://localhost:3000/admin/uploadedInfo/${requestsTable._id}/${"medicalLicense"}`} download>
                      Download
                  </a>}</TableCell>
                  <TableCell align='left'>{<a href={`http://localhost:3000/admin/uploadedInfo/${requestsTable._id}/${"medicalDegree"}`} download>
                      Download
                  </a>}</TableCell>
                  <TableCell align="left">{<Button id={requestsTable.email} variant='contained' bgcolor="primary.main.dark" style={{backgroundColor:'green'}} onClick={AcceptButton}>Accept</Button>}</TableCell>
                  <TableCell align="left">{<Button id={requestsTable.email} variant='contained'  onClick={RejectButton}>Reject</Button>}</TableCell>
                  
                </TableRow>
              ))}
              
            </TableBody>
          </Table>
          
        </TableContainer>
        
        </div>
      </div>
      </div>
    ));
  }


