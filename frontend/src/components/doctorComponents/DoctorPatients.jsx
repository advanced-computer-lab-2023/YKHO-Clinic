import React from 'react';
import axios from 'axios';
import Joi from 'joi';
import PatientCard from './PatientCard';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography,Button, Paper, CardActions, CircularProgress, IconButton, Autocomplete } from '@mui/material';
import PlaceHolder from '../PlaceHolder';
import LoadingComponent from '../LoadingComponent';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import MedicationIcon from '@mui/icons-material/Medication';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PrescriptionCards from './PrescriptionCards';
import MedicineCards from './MedicineCards';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
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
const DoctorPatients = () => {
    const [result, setResult] = useState(false);
    const [patients, setPatients] = useState([]);
    const [onePatient, setOnePatient] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [patientLoading, setPatientLoading] = useState(true);
    const [open2, setOpen2] = useState(false);
    const [healthName, setHealthName] = useState("");
    const [file, setFile] = useState("");
    const [open3, setOpen3] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState("");
    const [loading2, setLoading2] = useState(false);
    const [prescriptionsOpen, setPrescriptionsOpen] = useState(false);
    const [availableMedicine, setAvailableMedicine] = useState([]);
    useEffect(() => {
        check(); 
        getMedicine();
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
            setLoading2(true);
            const name = healthName;
            const file2 = file;
            console.log(file2)
            const uploadSchema = Joi.object({
                name: Joi.string().required(),
                file: Joi.required()
            });
            
            const { error, result } = uploadSchema.validate({name:name,file:file2});
            if (error || file2=="") {
                    setLoading2(false);
                    if(file2==""){
                        setErrorMessage("Please upload a file");
                    }
                    else{
                        setErrorMessage(error.details[0].message);
                    }
                    return setOpen3(true);
            }
            else{
            const id = onePatient.patientID._id;
            const formData = new FormData();
            formData.append("name", name);
            formData.append("healthRecords", file2);
            const res = await axios.post(`http://localhost:3000/doctor/patients/${id}/upload-pdf`, formData, {
                withCredentials: true
            },{headers:{"Content-Type":"multipart/form-data"}});
            setOnePatient(res.data.result);
            setLoading2(false);
            setOpen4(true);
            setHealthName("");
            setFile("");
                }
        
    }
    async function uploadPrescription(){
        const id = onePatient.patientID._id;
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
    function handleFileChange(e){
        setFile(e.target.files[0]);
    }
    function closeAlert(){
        setOpen3(false);
    }
    const [open4, setOpen4] = React.useState(false);
    function closeAlert2(){
        setOpen4(false);
    }
    const [prescriptions, setPrescriptions] = useState([]);
    const [prescriptionsLoading, setPrescriptionsLoading] = useState(true);
    const [medicineNames, setMedicineNames] = useState([]);
    const [medicineOpen, setMedicineOpen] = useState(false);
    const [prescription,setPrescription] = useState("");
    const [uploadingMedicine, setUploadingMedicine] = useState(false);


    async function openPrescriptions(){
        setPrescriptionsLoading(true);
        const id = onePatient.patientID._id;
         await axios.get(`http://localhost:3000/doctor/Prescriptions?id=${id}`, {
                withCredentials: true
            }).then((res)=>{
            console.log(res.data.result)
            setPrescriptions(res.data.result);
            setPrescriptionsLoading(false);
            })
    }
    function showMedicine(med,id){
        setMedicineNames(med);
        setPrescription(id);
        setMedicineOpen(true);
        setPrescriptionsOpen(false);
    }
    function uploadMedicine(){
        setUploadingMedicine(true);
    }
    async function deleteMedicine(price,name){
        await axios.post(`http://localhost:3000/doctor/deleteMedicine`,{price:price,name:name,id:prescription}, {
                withCredentials: true
        }).then((res)=>{
            console.log(res.data.result)
            setMedicineNames(res.data.result);
        })
    }
    async function getMedicine(){
        await axios.get(`http://localhost:3000/doctor/getMedicine`, {
                withCredentials: true
        }).then((res)=>{
            console.log(res.data.result)
            setAvailableMedicine(res.data.result);
        })
    }
    const [dos,setDos] = useState("");
    function setDosage(e){
        setDos(e.target.value);
    }
    async function addMedicine() {
        if (selectedMedicine && selectedMedicine.label && dos) {
            console.log(medicineNames)
            const medicineLabelExists = medicineNames.some(
                (medicine) => medicine.name === selectedMedicine.label
            );
            if (!medicineLabelExists) {
                await axios
                    .post(
                        `http://localhost:3000/doctor/addMedicine/${prescription}`,
                        {
                            name: selectedMedicine.label,
                            dosage: dos,
                            id: prescription,
                            price: selectedMedicine.price,
                        },
                        {
                            withCredentials: true,
                        }
                    )
                    .then((res) => {
                        setMedicineNames(res.data.result);
                        setUploadingMedicine(false);
                    });
            } else {
                setErrorMessage("Medicine already exists");
                setOpen3(true);
            }
        } else {
            setErrorMessage("Please fill all the fields");
            setOpen3(true);
        }
    }
    const [selectedMedicine, setSelectedMedicine] = React.useState(null);

    const handleMedicineChange = (event, value) => {
      setSelectedMedicine(value);
    }
    function selectMedicine(name){
        setMedicineName(name);
        setUpdateMedicineOpen(true);
    }
    async function updateMedicine(){
        const id= prescription;
        const dosage= dos;
        const name=medicineName;
        if(!dos){
            setErrorMessage("Please fill all the fields");
            setOpen3(true);
            return;
        }

        await axios.post("http://localhost:3000/doctor/updatePrescMed",{
            id:id,
            dosage:dosage,
            name:name
        }
        ,
        {
            withCredentials: true,
        }).then((res)=>{
            console.log(res.data.result)
            setMedicineNames(res.data.result.MedicineNames);
            setUpdateMedicineOpen(false);
        })
    }
    const [medicineName,setMedicineName] = React.useState("");
    const [updateMedicineOpen,setUpdateMedicineOpen]= React.useState(false);
    const [addPrescriptionOpen,setAddPrescriptionOpen]= React.useState(false);
    const [prescriptionName,setPrescriptionName]= React.useState("");
    async function addPrescription(){
        const name = prescriptionName;
        const id = onePatient.patientID._id;
        if(!name){
            setErrorMessage("Please fill all the fields");
            setOpen3(true);
            return;
        }
       await axios.post("http://localhost:3000/doctor/addPrescription",{
            id:id,
            name:name
        }
        ,
        {
            withCredentials: true,
        }).then((res)=>{
            console.log(res.data.result)
            setPrescriptions(res.data.result);
            setAddPrescriptionOpen(false);
        })
    }
    function handlePrescriptionChange(e){
        setPrescriptionName(e.target.value);
    }
    return (
        <div>
            {result && (
                <div >
                    
                        <Snackbar
                    open={open3}
                    autoHideDuration={2000}
                    onClose={closeAlert}
                    message="Note archived"
                        >
                            <Alert severity="error">{ErrorMessage}</Alert>
                        </Snackbar>
                        <Snackbar
                    open={open4}
                    autoHideDuration={2000}
                    onClose={closeAlert2}
                    message="Note archived"
                        >
                            <Alert severity="success">health record uploaded successfully</Alert>
                        </Snackbar>
                        <Dialog 
                    open={prescriptionsOpen}
                    keepMounted
                    onClose={()=>{setPrescriptionsOpen(false);}}
                    aria-describedby="alert-dialog-slide-description"
                    maxWidth="lg"
                    sx={{width:"100%"}}
                    >
                    {prescriptionsOpen&& <>
                    <div style={{display:"flex"}}>
                    <IconButton onClick={()=>{setPrescriptionsOpen(false);setOpen(true);}}>
                        <ArrowBackIcon />
                    </IconButton>
                    <DialogTitle>{onePatient.patientID.name}'s Prescriptions</DialogTitle>
                    <IconButton  onClick={()=>{setAddPrescriptionOpen(true)}}>
                        <NoteAddIcon />
                    </IconButton>
                    
                    </div>
                    <div style={{overflowY:"auto",width:1200,height:400}}>
                    <Grid container columnSpacing={3} rowSpacing={3} sx={{display:"flex",justifyContent:"center",alignItems:"center",padding:5}}>
                    {
                                !prescriptionsLoading&& prescriptions.length>0&& prescriptions.map((prescription) =>{ return (
                                    <Grid item key={prescription._id}>
                                        <PrescriptionCards prescriptionName={prescription.prescriptionName} MedicineNames={prescription.MedicineNames} filled={prescription.filled} _id={prescription._id} retrieveNames={showMedicine} />
                                    </Grid>
                                    
                                )})
                            }
                           {
                                 !prescriptionsLoading&&prescriptions.length==0&&<PlaceHolder title="No Prescriptions Found" description="There are no prescriptions available." width="300" height="100" />
                           }
                            
                    </Grid>
                    </div>
                    </>}
                    </Dialog>
                    <Dialog 
                    open={medicineOpen}
                    keepMounted
                    onClose={()=>{setMedicineOpen(false);}}
                    aria-describedby="alert-dialog-slide-description"
                    maxWidth="lg"
                    sx={{width:"100%"}}
                    >
                    {medicineOpen&& <>
                    <div style={{display:"flex",width:700}}>
                    <IconButton onClick={()=>{setMedicineOpen(false);setPrescriptionsOpen(true);}}>
                        <ArrowBackIcon />
                    </IconButton>
                    <DialogTitle>{onePatient.patientID.name}'s medicine</DialogTitle>
                    <IconButton  onClick={()=>{uploadMedicine();}}>
                        <NoteAddIcon />
                    </IconButton>
                    </div>
                    <div style={{overflowY:"auto",height:400}}>
                    <Grid container columnSpacing={3} rowSpacing={3} sx={{marginTop:2,display:"flex",justifyContent:"center",alignItems:"center",marginBottom:5,padding:4}}>
                            {
                                medicineNames.map((medicine) =>{ return (
                                    <Grid item>
                                        <MedicineCards name={medicine.name} dosage={medicine.dosage} price={medicine.price} deleteMedicine={deleteMedicine} updateMedicine={selectMedicine}/>
                                    </Grid>
                                    
                                )})
                            }
                            
                    </Grid>
                    </div>
                    </>}
                    </Dialog>
                    <Dialog
                    open={uploadingMedicine}
                    keepMounted
                    onClose={()=>{setUploadingMedicine(false);}}
                    aria-describedby="alert-dialog-slide-description"
                    maxWidth="lg"
                    sx={{width:"100%"}}
                    >
                    {uploadingMedicine&& <>
                        <DialogTitle>Add medicine</DialogTitle>
                    <div style={{display:"flex",width:700,height:300,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <DialogContent>
                    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={availableMedicine}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Medicine name" />}
      PaperComponent={(props) => (
        <Paper {...props} style={{ height: 100 }}>
          {props.children}
        </Paper>
      )}
      value={selectedMedicine}
      onChange={handleMedicineChange}
      getOptionLabel={(option) => option.label}
    />
                        <div style={{display:"flex"}}>
                        <TextField  id="dosage" label="dosage"  onChange={setDosage} variant="standard" sx={{ width: 300,marginTop: 2 }} >  </TextField>
                        </div>
                    </DialogContent>
                    <DialogActions>
                    <Button variant="contained" onClick={addMedicine}>add</Button>
                    </DialogActions>
                    </div>
                    </>
                    }
                    </Dialog>
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
                    <Button variant="text" onClick={()=>{openPrescriptions();setPrescriptionsOpen(true); setOpen(false);}} startIcon={<MedicationIcon />}>View prescriptions</Button>
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
                                <div style={{display:"flex"}}>
                                <IconButton onClick={()=>{setOpen2(false); setOpen(true)}}>
                                    <ArrowBackIcon  />
                                </IconButton>
                                <DialogTitle>{onePatient.patientID.name}'s Health Records</DialogTitle>
                                </div>
                                <DialogContent sx={{display:"flex"}}>
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
                                </DialogContent>
                            </>
                        )}
                    </Dialog>
                    <Dialog
                     open={updateMedicineOpen}
                     keepMounted
                     onClose={()=>{setUpdateMedicineOpen(false);}}
                     aria-describedby="alert-dialog-slide-description"
                     maxWidth="lg"
                     sx={{width:"100%"}}>
                        {updateMedicineOpen&&<>
                        <DialogTitle>Update {medicineName}'s Dosage</DialogTitle>
                        <DialogContent>
                            <div style={{display:"flex"}}>
                            <TextField id="dosage" label="dosage"  onChange={setDosage} variant="standard" sx={{ width: 300,marginTop: 2 }} >  </TextField>
                            </div>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                            <Button sx={{marginTop:4}} variant="contained"onClick={updateMedicine}> 
                                                    Submit
                            </Button>
                            </div>
                        </DialogContent>
                        </>}
                    </Dialog>
                    <Dialog
                    open={addPrescriptionOpen}
                    keepMounted
                    onClose={()=>{setAddPrescriptionOpen(false);}}
                    aria-describedby="alert-dialog-slide-description"
                    maxWidth="lg"
                    sx={{width:"100%"}}
                    >
                        {addPrescriptionOpen&&<>
                        <DialogTitle>Add Prescription</DialogTitle>
                        <DialogContent>
                            <div style={{display:"flex"}}>
                            <TextField id="prescriptionName" label="prescription name"  onChange={handlePrescriptionChange} variant="standard" sx={{ width: 300,marginTop: 2 }} >  </TextField>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" onClick={addPrescription}>
                                Submit
                            </Button>
                        </DialogActions>
                        </>}
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
