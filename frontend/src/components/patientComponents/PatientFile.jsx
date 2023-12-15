import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';
import { Button, CardActions, TextField ,Paper} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
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
                <Card>
                    <Typography variant="h4">Your files</Typography>
                    <CardContent>
                        <Card>
                                    <Paper sx={{height:200,overflowY:"auto",marginLeft:5}}>
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
                        </Card>
                        <Card>

                        </Card>
                    </CardContent>
                </Card>
            </>}
        </>
    )
}

export default PatientFile;