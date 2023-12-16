import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';
import { Button, CardActions, TextField ,Paper} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from './Navbar';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
const PatientFile = () => {
    const [result, setResult] = useState(false);
    useEffect(() => { check() ,getPatient()}, []);
    const [healthName,setHealthName]=useState("");
    const [handleFileChange,setHandleFileChange]=useState(null);
    const [loading2,setLoading2]=useState(false);
    const [onePatient, setOnePatient] = useState(null);

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

                const homeBreadcrumb = { label: "files", href: "/patient/files" };
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
    async function getPatient() {
        const res = await axios.get("http://localhost:3000/patient", {
            withCredentials: true
        })
        console.log(res.data.result)
        setOnePatient(res.data.result)
    }
    return (
        <>
            {result && <>
                <Navbar openHelp={toggleFilter} goHome={goHome} handleSearch={handleSearch} goFiles={goFiles} handlePrescriptions={handlePrescriptions} handleAppointments={handleAppointments} handleFamilyMembers={handleFamilyMembers} handleManageFamily={handleManageFamily} viewAllDoctors={viewAllDoctors} toChats={toChats} />
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
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"90vh",width:"100%"}}>

                <Card sx={{height:"70%",width:"70%"}}>
                    <Typography variant="h4">Your files</Typography>
                    <CardContent>
                        <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}>
                        <Paper sx={{height:"200px",width:"83%",overflowY:"auto",marginBottom:8}}>
                            <Typography variant="h6">Upload Medical history</Typography>
                            <div style={{display:"flex",marginLeft:'auto',marginRight:'auto',width:"80%",justifyContent:"space-between",alignItems:"center",marginTop:"3%"}}>
                            <TextField sx={{width:"20%"}} label="Name" variant="outlined" onChange={(e)=>{setHealthName(e.target.value)}}/>
                            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                        Upload file
                                        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                            </Button>
                            <Button  variant="contained" component="span" onClick={()=>{
                                setLoading2(true);
                                const formData = new FormData();
                                formData.append('file', handleFileChange);
                                formData.append('name',healthName);
                                axios.post("http://localhost:3000/patient/uploadHealthRecord",formData,{
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                }).then((res)=>{
                                    setLoading2(false);
                                    getPatient();
                                }).catch((err)=>{
                                    setLoading2(false);
                                })
                            }}>
                                Upload
                            </Button>
                            </div>
                        </Paper>
                        </div>
                        <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}>
                        <Paper sx={{height:"200px",width:"40%",overflowY:"auto"}}>
                                        <div  style={{position: 'sticky', backgroundColor:"white",height:60,top: 0, zIndex: 1}}>
                                        <Typography variant="h6">Uploaded Health Records</Typography>
                                        </div>
                                    {onePatient!=null&&onePatient.healthRecords.map((record, index) => (
                                        <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography sx={{marginLeft:3}}>{record.name}</Typography>
                                            
                                            <a href={`http://localhost:3000/doctor/patients/${onePatient._id}/${index}`} download>
                                                <Button sx={{marginRight:3}}  variant="text">
                                                    Download
                                                </Button>
                                            </a>
                                        </div>
                                    ))}
                        </Paper>
                        <Paper sx={{height:"200px",width:"40%",overflowY:"auto",marginLeft:5}}>
                                        <div  style={{position: 'sticky', backgroundColor:"white",height:60,top: 0, zIndex: 1}}>
                                        <Typography variant="h6">Uploaded Medical History</Typography>
                                        </div>
                                    {onePatient!=null&&onePatient.medicalHistory.map((record, index) => (
                                        <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography sx={{marginLeft:3}}>{record.name}</Typography>
                                            
                                            <a href={`http://localhost:3000/patient/medicalHistory/${index}`} download>
                                                <Button sx={{marginRight:3}}  variant="text">
                                                    Download
                                                </Button>
                                            </a>
                                        </div>
                                    ))}
                        </Paper>
                        </div>
                    </CardContent>
                </Card>
            </div></>}
        </>
    )
}

export default PatientFile;