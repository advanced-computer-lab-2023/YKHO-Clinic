import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar'
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton, Box, Paper, Button, Typography, Grid, Stack, Autocomplete, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PrescriptionCard from './PrescriptionCard';
import PlaceHolder from '../PlaceHolder';
import { set } from 'mongoose';
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
            window.location.href = res.data.result;
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
                <Navbar />
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
                            </Stack> : prescriptions.length > 0 && <Stack direction="column" spacing={2} justifyContent="center" alignItems="center" sx={{ width: "100%" }}>
                                {prescriptions.length > 0 && prescriptions.map((prescription, index) => {
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: -50, width: '100%', height: '100%' }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.2 }}
                                        >
                                            <PrescriptionCard doctorName={prescription.doctorName} prescriptionName={prescription.prescriptionName} date={prescription.date} filled={prescription.filled} medicines={prescription.MedicineNames} handleWallet={handleWallet} handleCredit={handleCredit} id={prescription._id} paid={prescription.paid} price={prescription.price} discount={prescriptionPrice[index]} hasHealthPackage={hasHealthPackage} />
                                        </motion.div>)
                                })}
                            </Stack>}
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