import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar'
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton, Box, Paper, Button, Typography, Grid, Stack, Autocomplete, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PrescriptionCard from './PrescriptionCard';
import PlaceHolder from '../PlaceHolder';
import { set } from 'mongoose';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

const PatientPrescriptions = () => {
    const [result, setResult] = useState(false);
    const [prescriptions, setPrescriptions] = useState([]);
    const [prescriptionPrice, setPrescriptionPrice] = useState([]);
    const [hasHealthPackage, setHasHealthPackage] = useState(false);
    const [doctorName, setDoctorName] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [filtered, setFiltered] = useState(false);
    const [filled, setFilled] = useState("");
    const [uniqueDoctorNames, setUniqueDoctorNames] = useState([]);
    const [appLoading, setAppLoading] = useState(true);
    useEffect(() => { check(), getPrescriptions(), setOptions() }, []);

    
    async function setOptions() {
        const res = await axios.get("http://localhost:3000/patient/AllPresecrptionsInfo", {
            withCredentials: true
        }).then((res) => {
            setUniqueDoctorNames([...new Set(res.data.result.map((option) => option.doctorName))]);
        }).catch((err) => {
            console.log(err);
        })
    }

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

                const homeBreadcrumb = { label: "prescriptions", href: "/patient/Prescriptions" };
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
      function goHealthPackages(){
        const breadcrumb = { label: "HealthPackages", href: "/patient/healthPackages/-1" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      function goEditInfo(){
        const breadcrumb = { label: "editInfo", href: "/patient/editInfo" };
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
    const handleReset = () => {
        setDoctorName("");
        setSelectedDate(null);
        setFilled("");
    };
    const handleFilled = (event) => {
        setFilled(event.target.value);
    };

    async function getPrescriptions() {
        await axios.get("http://localhost:3000/patient/AllPresecrptionsInfo", {
            withCredentials: true
        }).then((res) => {
            setPrescriptions(res.data.result);
            setPrescriptionPrice(res.data.totalPrice);
            setHasHealthPackage(res.data.hasHealthPackage);
            setFiltered(false);
            setAppLoading(false);
        }).catch((err) => {
            console.log(err);
        })
    }

    async function handleWallet(id) {
        await axios.get(`http://localhost:3000/patient/paymentWalletpresc/${id}`, {
            withCredentials: true
        }).then((res) => {
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        })
    }

    async function handleCredit(id) {
        await axios.get(`http://localhost:3000/patient/paymentcreditpresc/${id}`, {
            withCredentials: true
        }).then((res) => {
            window.location.href = "http://localhost:"+res.data.result+"/login";

        }).catch((err) => {
            console.log(err);
        })

    }
    async function handleDownload(id) {
        await axios.get(`http://localhost:3000/patient/prescriptionPDF/${id}`, {
            withCredentials: true
        }).then((res) => {
            window.location.href = res.data.result;
        }).catch((err) => {
            console.log(err);
        })
    }
    async function prescriptionFiltered() {
        try {
            setAppLoading(true);
            const res = await axios.get(`http://localhost:3000/Patient/PrescriptionsFiltered?doctor=${doctorName}&&date=${selectedDate}&&filled=${filled}`, {
                withCredentials: true
            });
            setPrescriptions(res.data.result);
            setPrescriptionPrice(res.data.totalPrice);
            setHasHealthPackage(res.data.hasHealthPackage);
            setFiltered(true);
            setAppLoading(false);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div>
            {result && <div>
                <Navbar goEditInfo={goEditInfo} openHelp={toggleFilter} goHealthPackages={goHealthPackages} goHome={goHome} handleSearch={handleSearch} goFiles={goFiles} handlePrescriptions={handlePrescriptions} handleAppointments={handleAppointments} handleFamilyMembers={handleFamilyMembers} handleManageFamily={handleManageFamily} viewAllDoctors={viewAllDoctors} toChats={toChats} />
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
                <Typography variant="h3" sx={{ marginLeft: "15%", marginTop: "1%" }} gutterBottom>Your Prescriptions</Typography>
                <Stack direction="column" spacing={5} alignItems="center">
                    <Stack direction="row" spacing={2} sx={{ width: "100%" }} justifyContent="center" alignItems="center">
                        <Autocomplete loading id="prescBox" sx={{ width: "20%" }} freeSolo options={uniqueDoctorNames} renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search Doctor Name"
                                InputProps={{
                                    ...params.InputProps,
                                    type: 'search',
                                }}
                            />
                        )} inputValue={doctorName} onInputChange={(event, value) => setDoctorName(value)} />
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DatePicker id="DOP" name="DOP" label="Date of Prescription" value={selectedDate} onChange={(date) => setSelectedDate(date)} />
                        </LocalizationProvider>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="filterFilled">Filled Filter</InputLabel>
                            <Select
                                id="filterFilled"
                                value={filled}
                                label="Filled Filter"
                                onChange={handleFilled}
                            >
                                <MenuItem value={""}> Any </MenuItem>
                                <MenuItem value={true}>Filled</MenuItem>
                                <MenuItem value={false}>Not Filled</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" size="small" sx={{ marginLeft: "1%" }} onClick={() => prescriptionFiltered()}> Filter </Button>
                        <Button variant="outlined" size="small" sx={{ marginLeft: "1%" }} onClick={() => { getPrescriptions(); handleReset(); }}> Reset </Button>
                    </Stack>
                    <AnimatePresence>
                        <Paper elevation={4} sx={{ padding: "20px", width: "80%", height: "640px", overflowY: "auto" }}>
                            {appLoading ? <Stack direction="column" spacing={1} justifyContent="center" alignItems="center" sx={{ width: "100%", height: "100%" }}>
                                <Skeleton variant='rectangular' animation="wave" sx={{ width: '100%', height: '100%' }} />
                                <Skeleton variant='rectangular' animation="wave" sx={{ width: '100%', height: '100%' }} />
                            </Stack> : prescriptions.length > 0 && <Grid container spacing={4} sx={{ width: "100%", display:"flex" , justifyContent: "center", alignItems:"center", height: "100%" }}>
                                {prescriptions.length > 0 && prescriptions.map((prescription, index) => {
                                    return (
                                        <Grid item key={prescription._id} sx={{minWidth:"200px"}}>
                                        <motion.div
                                            initial={{ opacity: 0, y: -50, width: '100%', height: '100%' }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.2 }}
                                        >
                                            <PrescriptionCard doctorName={prescription.doctorName} prescriptionName={prescription.prescriptionName} date={prescription.date} filled={prescription.filled} medicines={prescription.MedicineNames} handleWallet={handleWallet} handleCredit={handleCredit} id={prescription._id} paid={prescription.paid} price={prescription.price} discount={prescriptionPrice[index]} hasHealthPackage={hasHealthPackage} />
                                        </motion.div>
                                        </Grid>)
                                })}
                            </Grid>}
                            {prescriptions.length == 0 && !appLoading && <Stack direction="column" spacing={2} justifyContent="center" alignItems="center" sx={{ width: "100%", height: "100%" }}>
                                {!filtered &&
                                    <Stack justifyContent="center" alignSelf="center">
                                        <PlaceHolder message={"No Prescriptions"} description={"You have no Prescriptions"} width={"200"} />
                                    </Stack>}
                                {filtered &&
                                    <Stack justifyContent="center" alignSelf="center" sx={{ height: "100%" }}>
                                        <PlaceHolder message={"No Prescriptions"} description={"No Prescriptions with this filter"} width={"200"} />
                                    </Stack>}
                            </Stack>}
                        </Paper>
                    </AnimatePresence>
                </Stack>
            </div>}
        </div>
    )
}

export default PatientPrescriptions;