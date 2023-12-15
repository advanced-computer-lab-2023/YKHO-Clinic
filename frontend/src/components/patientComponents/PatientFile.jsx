import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';

const PatientFile = () => {
    const [result, setResult] = useState(false);
    useEffect(() => { check() }, []);
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
    return (
        <>
            {result && <>
                <Card>
                    <Typography variant="h4">Your files</Typography>
                    <CardContent>
                        <Card>
                        <Card sx={{height:200, width:400}}>
                                    <CardContent>
                                    <Typography variant="h6">Upload new health record</Typography>
                                    <TextField value={healthName} onChange={(e)=>{setHealthName(e.target.value)}} id="healthName" label="name" variant="standard" sx={{ marginTop: 2 }} />         
                                    </CardContent>
                                    <CardActions>
                                    <Button component="label" sx={{marginRight:"auto"}} variant="contained" startIcon={<CloudUploadIcon />}>
                                        Upload file
                                        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                                    </Button>
                                    {loading2&&<CircularProgress/>}
                                    <Button sx={{marginLeft:2}} variant="contained" disabled={loading2} onClick={uploadFile}>Confirm</Button>  
                                    </CardActions>
                                    </Card>
                                    <Paper sx={{height:200,overflowY:"auto",marginLeft:5}}>
                                        <div  style={{position: 'sticky', backgroundColor:"white",height:60,top: 0, zIndex: 1}}>
                                        <Typography variant="h6">Uploaded Health Records</Typography>
                                        </div>
                                    {onePatient.patientID.healthRecords.map((record, index) => (
                                        <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography sx={{marginLeft:3}}>{record.name}</Typography>
                                            
                                            <a href={`http://localhost:3000/doctor/patients/${onePatient.patientID._id}/${index}`} download>
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