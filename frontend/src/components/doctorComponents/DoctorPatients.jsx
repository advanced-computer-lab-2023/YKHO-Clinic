import axios from 'axios';
import Joi from 'joi';
import PatientCard from './PatientCard';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography,Button } from '@mui/material';
import PlaceHolder from '../PlaceHolder';
import LoadingComponent from '../LoadingComponent';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import MedicationIcon from '@mui/icons-material/Medication';
const DoctorPatients = () => {
    const [result, setResult] = useState(false);
    const [patients, setPatients] = useState([]);
    const [onePatient, setOnePatient] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [patientLoading, setPatientLoading] = useState(true);
    const [open2, setOpen2] = useState(false);
    useEffect(() => {
        check();
    }, []);

    async function check() {
        await axios.get("http://localhost:3000/doctor/contract",{
        withCredentials:true
    }).then((res)=>{
        if(res.data.contract=="rej"){
            window.location.href="/doctor/contract"
        }
        else{
            setResult(true)
        }
    }).catch((err)=>{
        console.log(err);
    })
        try {
            const res = await axios.get("http://localhost:3000/loggedIn", {
                withCredentials: true
            });
            if(res.data.type!="doctor" ){
                if(res.data.type=="patient"){
                    window.location.href="/patient/home"
                }
                else if(res.data.type=="admin"){
                    window.location.href="/admin/home"
                }
                else{
                    window.location.href="/"
                }
                } 
        } catch (err) {
            if (err.response.status === 401) {
                window.location.href = "/";
            }
        }
    }

    useEffect(() => {
        getPatients();
    }, []);

    async function getPatients() {
       
            setIsLoading(true);
            const res = await axios.get("http://localhost:3000/doctor/patients", {
                withCredentials: true
            }).then((res)=>{

            console.log(res.data.result)
            setPatients(res.data.result);
            setIsLoading(false);
            }).catch((err)=>{
                console.log(err);
            });
    }
    function changeSearchValue(e) {
        setSearchValue(e.target.value);
    }
    useEffect(() => {
        searchPatients();
    }, [searchValue]);

    async function searchPatients() {
      
            setIsLoading(true);
            const name = searchValue;
            const res = await axios.get(`http://localhost:3000/doctor/patients/?name=${name}`, {
                withCredentials: true
            }).then((res)=>{

            setPatients(res.data.result);
            setIsLoading(false);
            }).catch((err)=>{
                console.log(err);
            })
        
        }
    
    async function showPatientInfo(e) {
        try {
            setPatientLoading(true);
            const id = e;
            setOpen(true);
            await axios.get(`http://localhost:3000/doctor/patients/${id}`, {
                withCredentials: true
            }).then((res)=>{
                setOnePatient(res.data.result);
                console.log(res.data.result)
                setPatientLoading(false);
            })
            
        } catch (err) {
            console.log(err);
        }
    }
    async function uploadFile() {
        try {
            const name = document.getElementById("healthName").value;
            const file = document.getElementById("healthFile").files[0];
            const uploadSchema = Joi.object({
                name: Joi.string().required(),
                file: Joi.required()
            });
            const { error, result } = uploadSchema.validate({name:name,file:file});
            if (error) {
                    return setMessage(error.details[0].message);
            }
            const id = onePatient.patientID._id;
            const formData = new FormData();
            formData.append("name", name);
            formData.append("healthRecords", file);
            const res = await axios.post(`http://localhost:3000/doctor/patients/${id}/upload-pdf`, formData, {
                withCredentials: true
            },{headers:{"Content-Type":"multipart/form-data"}});
            setOnePatient(res.data.result);
        } catch (err) {
            console.log(err);
        }
    }
    let loading =[];
    for(let i=0;i<12;i++){
        loading.push(<Grid item><LoadingComponent width="300" height="150" /></Grid>)
    }
    function handleClose(){
        setOpen(false);
    }
    function handleClose2(){
        setOpen2(false);
    }
    function openHealthRecords(){
        setOpen2(true);
        setOpen(false);
    }
    return (
        <div>
            {result && (
                <div >
                    <Dialog 
                    open={open}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                    maxWidth="lg"
                    sx={{width:"100%"}}
                    >
                    {!patientLoading&& <DialogTitle>{onePatient.patientID.name}'s Info</DialogTitle>}
                    <DialogContent sx={{width:"100%"}}>
                        
                        {!patientLoading&&<div style={{display:"flex"}}>
                        <AssignmentIndIcon style={{fontSize:"120"}} />
                        <div style={{marginLeft:30}}>
                            <Typography><b>name:</b>{onePatient.patientID.name}</Typography>
                            <Typography><b>mobile:</b>{onePatient.patientID.mobile}</Typography>
                            <Typography><b>DOB:</b>{onePatient.patientID.DOB.split("T")[0]}</Typography>
                            <Typography><b>gender:</b>{onePatient.patientID.gender}</Typography>
                        </div>
                        <div style={{marginLeft:30}}>
                        <Typography><b>emergency name:</b>{onePatient.patientID.emergency.name}</Typography>
                        <Typography><b>emergency phone:</b>{onePatient.patientID.emergency.mobile}</Typography>
                        <Typography><b>Health package:</b>{onePatient.patientID.healthPackage}</Typography>
                        </div>
                        </div>}
                        {patientLoading&&
                        <LoadingComponent width="700" height="200" />
                        }

                    </DialogContent>
                    <DialogActions sx={{width:"100%"}}>
                    <Button sx={{marginRight:"auto"}}variant="text" startIcon={<MedicalInformationIcon />} onClick={openHealthRecords}>View health records</Button>
                    <Button variant="text" startIcon={<MedicationIcon />}>View prescriptions</Button>
                    </DialogActions>
                    </Dialog>
                    <Dialog
                    open={open2}
                    keepMounted
                    onClose={handleClose2}
                    aria-describedby="alert-dialog-slide-description"
                    maxWidth="lg"
                    >
                        {open2 && (
                            <>
                                <DialogTitle>{onePatient.patientID.name}'s Health Records</DialogTitle>
                                <DialogContent>
                                    {onePatient.patientID.healthRecords.map((record, index) => (
                                        <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography>{record.name}</Typography>
                                            <a href={`http://localhost:3000/doctor/patients/${onePatient.patientID._id}/${index}`} download>
                                                <Button variant="text">
                                                    view
                                                </Button>
                                            </a>
                                        </div>
                                    ))}
                                </DialogContent>
                            </>
                        )}
                    </Dialog>
                    <Navbar />
                    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"80vh",marginTop:40}}>
                        <Card sx={{width:"80%",height:"80vh"}}>
                            <CardContent sx={{height:"100%",overflowY:"auto"}}>
                            <div  style={{position: 'sticky', backgroundColor:"white",height:60,top: 0, zIndex: 1}} >
                            <Typography variant='h5'>Your patients</Typography>
                            </div>
                            <div style={{ display: 'flex', width: '100%', position: 'sticky', backgroundColor:"white",top: -16, zIndex: 1 }}>
                            <TextField id="name" label="search by name" variant="standard" sx={{marginLeft:5}} onChange={changeSearchValue}/>
                            </div>
                                <Grid container columnSpacing={3} rowSpacing={3} sx={{marginTop:2,display:"flex",justifyContent:"center",alignItems:"center"}}>
                                    {!isLoading&&patients.length === 0 ? (
                                        <Grid item >
                                            <PlaceHolder title="No Patients Found" description="There are no patients available." />
                                        </Grid>
                                    ) : (
                                        !isLoading && patients.map((patient) => (
                                            <>
                                            <Grid item key={patient._id}>
                                                <PatientCard patient={patient.patientID} showPatientInfo={showPatientInfo} />
                                            </Grid>
                                            </>
                                        ))
                                        
                                    )
                                    }
                                    {
                                    isLoading&&loading
                                    }
                                </Grid>
                            </CardContent>
                        </Card>
                    </div>
                    
                </div>
            )}
        </div>
    );
};

export default DoctorPatients;
