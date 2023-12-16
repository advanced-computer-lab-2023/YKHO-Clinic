import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';
import { Button, CardActions, TextField ,Paper} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from './Navbar';
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
    async function check() {
        const res = await axios.get("http://localhost:3000/loggedIn", {
            withCredentials: true
        }).then((res) => {

            if (res.data.type != "patient") {

                window.location.href = "/"
            }
            else {
                setResult(true)
            }
        }
        ).catch((err) => {
            if (err.response.status == 401) {
                window.location.href = "/"
            }
        })
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
                <Navbar />
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