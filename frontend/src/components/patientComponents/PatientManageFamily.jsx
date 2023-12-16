import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './Navbar'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';


import Link from '@mui/material/Link';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Breadcrumbs from '@mui/material/Breadcrumbs';

const PatientManageFamily = () => {
    const [result, setResult] = useState(false);
    const [members, setMembers] = useState([]);
    const [add, setAdd] = useState(false);
    const [name, setName] = useState(false);
    const [natioalID, setNationalID] = useState(false);
    const [age, setAge] = useState(false);
    const [relation, setRelation] = useState("husband");
    const [link, setLink] = useState(false);
    const [filter, setFilter] = useState("");
    const [search, setSearch] = useState("");
    const [kimo, setKimo] = useState("");
    const [details, setDetails] = useState(false);
    const [gender, setGender] = useState("male");
    //const [packageName,setPackageName ] = useState("");
    //const [doctorDiscount, setDoctorDiscount] = useState("");
    //const [pharmacyDiscount, setPharmacyDiscount] = useState("");
   // const [familyDiscount, setFamilyDiscount] = useState("");
    useEffect(() => { check(), fetch() }, []);

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

                const homeBreadcrumb = { label: "Appointments", href: "/patient/Appointments" };
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

    async function fetch() {

        const res = await axios.get("http://localhost:3000/patient/readFamilyMembersSubscriptions", {
            withCredentials: true
        }).then((res) => {
            console.log(res.data)
            setMembers(res.data);
        }
        ).catch((err) => {
            console.log(err);
        })
    }

    const subscribe = (nationalID) => {
        window.location.href = `/patient/healthPackages/${nationalID}`
    }

    const cancel = (nationlID) => {

    }

    const viewDetails = async (name) => {
        const res = await axios.get(`http://localhost:3000/patient/getFamilyMemberSub/${name}`, {
            withCredentials: true
        }).then((res) => {
            console.log(res.data.result);
            setKimo(res.data.result);
        }
        ).catch((err) => {
            console.log(err);
        })
        setDetails(true);

    }
    async function Addfamily() {
        const res = await axios.post(`http://localhost:3000/patient/createFamilyMember`,{name:name,nationalID:natioalID,age:age,relation:relation} ,{
            withCredentials: true
        }).then((res) => {
            console.log(res.data.result);
            fetch();
            
        }
        ).catch((err) => {
            console.log(err);
        })
        

    }
    const handleChange = (event) => {
        setRelation(event.target.value);
      };

    return (
        <>
            {result &&
                <>
                    <Navbar openHelp={toggleFilter} goHome={goHome} handleSearch={handleSearch} goFiles={goFiles} handlePrescriptions={handlePrescriptions} handleAppointments={handleAppointments} handleFamilyMembers={handleFamilyMembers} handleManageFamily={handleManageFamily} viewAllDoctors={viewAllDoctors} toChats={toChats} />
                    

                    <Stack spacing={2} sx={{ p: '32px' ,overflowY:'auto',height:"880px"}} >
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
                        <Paper elevation={1} onClick={() => { setAdd(true); }} sx={{ minHeight: '120px', px: "32px", display: 'flex', alignItems: 'center' }}>
                            <IconButton aria-label="delete" size="large" >
                                <AddCircleOutlineIcon />
                            </IconButton>
                            <Typography variant="h6" gutterBottom>
                                Add a family member
                            </Typography>
                        </Paper>
                        <>
                            {members.length > 0 &&
                                members.map((member) => (
                                    <Paper key={member.nationalID} elevation={1} sx={{ px: '32px', minHeight: '120px', display: 'flex', alignItems: 'center' }}>
                                        <Grid container spacing={0} >
                                            <Grid item xs={3} sx={{ borderRight: 2, borderColor: 'primary.main' }}>
                                                <Box sx={{ px: '32px' }}>
                                                    <Typography variant="h5" gutterBottom>
                                                        {member.name}
                                                    </Typography>
                                                    <Typography variant="subtitle" sx={{ color: 'primary.dark' }}>
                                                        {member.relation}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item>
                                                <Box sx={{ px: '32px' }} >
                                                    <Typography variant="h6" gutterBottom>
                                                        {member.state == "unsubscribed" && member.agent == true&&
                                                            "Not Subscribed To a Package Yet!"
                                                        }
                                                        {member.agent == false&&
                                                            "Not Linked Please Link First"
                                                        }
                                                        {(member.state == "subscribed" || member.state == "cancelled") &&
                                                            `Enjoying ${member.healthPackage} Until ${member.endDate.split("T")[0]}`
                                                        }
                                                    </Typography>
                                                    <Stack direction='row'>
                                                        {member.state == "unsubscribed" && member.agent == true&&
                                                            <Button variant="contained" onClick={() => { subscribe(member.nationalID) }} sx={{marginRight: 2}}>
                                                                subscribe
                                                            </Button>
                                                        }
                                                        {(member.state == "subscribed" || member.state == "cancelled") && member.agent == true&&
                                                            <Button variant="contained" onClick={() => { viewDetails(member.nationalID) }} sx={{marginRight: 2}}>
                                                                view package
                                                            </Button>
                                                        }
                                                        {member.state == "subscribed" &&member.agent == true&&
                                                            <Button variant="contained" onClick={() => { cancel(member.nationalID) }} sx={{marginRight: 2}}>
                                                                cancel
                                                            </Button>
                                                        }
                                                        {member.agent == false && 
                                                            <Button variant="contained" onClick={() => {  }}>
                                                                Link User
                                                            </Button>
                                                        }
                                                    </Stack>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                ))
                            }
                        </>

                    </Stack>
                    <Dialog open={add} onClose={() => { setAdd(false) }}>
                        <DialogTitle>Add member</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Name"
                                type="name"
                                fullWidth
                                variant="standard"
                                onChange={(e) => { setName(e.target.value) }}/>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="nationalID"
                                label="NationalID"
                                type="nationalID"
                                fullWidth
                                variant="standard"
                                onChange={(e) => { setNationalID(e.target.value) }}/>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="age"
                                label="Age"
                                type="age"
                                fullWidth
                                variant="standard"
                                onChange={(e) => { setAge(e.target.value) }}
                                sx={{mb:"16px"}}/>
                            <FormLabel id="demo-row-radio-buttons-group-label">
                                Relation
                            </FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={relation}
                                onChange={handleChange}
                            >
                                <FormControlLabel value="husband" control={<Radio />} label="husband" />
                                <FormControlLabel value="wife" control={<Radio />} label="wife" />
                                <FormControlLabel value="son" control={<Radio />} label="son" />
                                <FormControlLabel value="daughter" control={<Radio />} label="daughter"/>
                            </RadioGroup>
                        </DialogContent>
                        <DialogActions>
                        <   Button
                                onClick={() => { 
                                    setAdd(false)
                                }}
                            >
                                cancel
                            </Button>
                            <Button
                                onClick={() => { 
                                    setAdd(false) ;Addfamily();
                                }}
                            >
                                Create
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={link} onClose={() => { setLink(false) }}>
                        <DialogTitle>Subscribe</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To subscribe to this website, please enter your email address here. We
                                will send updates occasionally.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Email Address"
                                type="email"
                                fullWidth
                                variant="standard"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { setLink(false) }}>Link</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={details} onClose={() => { setDetails(false) }}>
                        <DialogTitle>Health Package Details</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                        Package Name: {kimo.packageName} <br></br>
                        Pharmacy Discount: {kimo.pharmacyDiscount} <br></br>
                        Doctor Discount: {kimo.doctorDiscount} <br></br>
                        Family Discount: {kimo.familyDiscount} <br></br>
                        Price: {kimo.price}<br></br>
                        </DialogContentText>
                        </DialogContent>
                    </Dialog>
                </>
            }
        </>
    )
}

export default PatientManageFamily;