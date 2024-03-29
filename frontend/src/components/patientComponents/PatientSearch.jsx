import React from 'react';
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import Navbar from './Navbar'
import { Stack, FormControl, InputLabel, Select, MenuItem, Paper, Snackbar, Alert, Button, Skeleton } from '@mui/material'
import { set } from 'mongoose';
import FamilyMemberCard from './FamilyMemeberCard';
import { motion, AnimatePresence } from 'framer-motion';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useParams } from 'react-router-dom';
import DoctorCard from './DoctorCard';
import dayjs from 'dayjs';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import PlaceHolder from '../PlaceHolder';

const PatientSearch = () => {
    const [result, setResult] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [filled, setFilled] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [speciality, setSpeciality] = useState([]);
    const [timeSlotsShow, setTimeSlotsShow] = useState([]);
    useEffect(() => { check(), getDoctors(), getDoctorSpeciality(), getFamilyMembers(),  getID() }, []);
    const { searchValue } = useParams();
    useEffect(() => { getDoctors() }, [searchValue]);
    const [open, setOpen] = useState(false);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [id, setID] = useState("");
    const [selectedDateSent, setSelectedDateSent] = useState(null);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
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

                const homeBreadcrumb = { label: "allDoctors", href: "/patient/search/" };
                const hasHomeBreadcrumb = savedBreadcrumbs.some(
                  (item) => item.label == homeBreadcrumb.label
                );
                
                // If not, add it to the breadcrumbs
                if (!hasHomeBreadcrumb) {
                    for(let i = 0; i < savedBreadcrumbs.length; i++){
                        if(savedBreadcrumbs[i].label == "allDoctors"){
                            homeBreadcrumb.href = savedBreadcrumbs[i].href;
                        };
                    };  
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

    async function getDoctors() {
        setLoadingDoctors(true);
        if (searchValue != "")
            await axios.get(`http://localhost:3000/patient/searchDoctors?searchValues=${searchValue}`, {
                withCredentials: true,
            }).then((res) => {
                setDoctors(res.data.results.doctors)
                setTimeSlots(res.data.results.timeSlots)
                setAppointments(res.data.results.doctorAppointments)
                handleReset();
                setLoadingDoctors(false);
            }).catch((err) => {
                console.log(err)
            });
    }
    async function reserveSlot(doctorID, date, time, id) {
        await axios.get(`http://localhost:3000/patient/doctors/${doctorID}/reserve?date=${date}&time=${time}&id=${id}`, {
            withCredentials: true,
        }).then((res) => {
            getDoctors();
            setOpen(true);

        }).catch((err) => {
            console.log(err)
        });
    }

    async function doctorsFiltered() {
        setLoadingDoctors(true);
        await axios.get(`http://localhost:3000/patient/filterDoctors/?searchValues=${searchValue}&&speciality=${filled}&&date=${selectedDate}`, {
            withCredentials: true,
        }).then((res) => {
            setDoctors(res.data.results.doctors)
            setTimeSlots(res.data.results.timeSlots)
            setAppointments(res.data.results.doctorAppointments)
            handleDateChange(selectedDate)
            setLoadingDoctors(false);
        }).catch((err) => {
            console.log(err)
        })
    }

    async function getDoctorSpeciality() {
        await axios.get(`http://localhost:3000/patient/doctorSpecialities`, {
            withCredentials: true,
        }).then((res) => {
            setSpeciality(res.data.results);
        }).catch((err) => {
            console.log(err);
        })
    }
    const handleReset = () => {
        setSelectedDate(null);
        setFilled("");
        setSelectedDateSent(null);
    };

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleFilled = (event) => {
        setFilled(event.target.value);
    };
    const handleDateChange = (date) => {
        setSelectedDateSent(date);
    };
    async function getTimeSlots(id, date, day) {
        await axios.get(`http://localhost:3000/patient/getTimeSlotOnDate?id=${id}&&date=${date}&&day=${day}`, {
            withCredentials: true,
        }).then((res) => {
            setTimeSlotsShow(res.data.result);
        }).catch((err) => {
            console.log(err);
        });
    }

    async function getFamilyMembers() {
        await axios.get(`http://localhost:3000/patient/readFamilyMembers`, {
            withCredentials: true
        }).then((res) => {
            setFamilyMembers(res.data.result);
        }).catch((err) => {
            console.log(err);
        });
    }

    async function getID() {
        await axios.get("http://localhost:3000/patient/getMyID", { withCredentials: true }).then((res) => {
            setID(res.data.result);
        }
        ).catch((err) => {
            console.log(err);
        })
    }
    const today = dayjs();
    return (
        <div>
            {result && <div>
                <Navbar content={searchValue} goEditInfo={goEditInfo} openHelp={toggleFilter} goHealthPackages={goHealthPackages} goHome={goHome} handleSearch={handleSearch} goFiles={goFiles} handlePrescriptions={handlePrescriptions} handleAppointments={handleAppointments} handleFamilyMembers={handleFamilyMembers} handleManageFamily={handleManageFamily} viewAllDoctors={viewAllDoctors} toChats={toChats} />
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
                <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "center" }} open={open} autoHideDuration={6000} onClose={handleClose} key={'bottom' + 'center'}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Appoinment Reserved Successfully
                    </Alert>
                </Snackbar>
                <Stack direction="column" spacing={2} justifyContent="center" alignItems="center" sx={{ marginTop: "2%" }}>
                    <Stack direction="row" spacing={2} justifyContent="flex-start" alignItems="center" sx={{ width: "70%" }} >
                        <FormControl sx={{ m: 1, minWidth: 200 }}>
                            <InputLabel id="filterSpeciality">Speciality Filter</InputLabel>
                            <Select
                                id="filterSpeciality"
                                value={filled}
                                label="Speciality Filter"
                                onChange={handleFilled}
                            >
                                <MenuItem value={""}> Any </MenuItem>
                                {speciality.length > 0 && speciality.map((speciality) => {

                                    return <MenuItem value={speciality}> {speciality}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DatePicker id="DOP" name="DOP" minDate={today.add(0, 'day')} label="Choose a Date" value={selectedDate} onChange={(date) => setSelectedDate(date)} />
                        </LocalizationProvider>
                        <Button variant="contained" size="small" sx={{ marginLeft: "1%" }} onClick={() => {doctorsFiltered()}}> Filter </Button>
                        <Button variant="outlined" size="small" sx={{ marginLeft: "1%" }} onClick={() => { getDoctors();}}> Reset </Button>
                    </Stack>
                    <Paper elevation={7} sx={{ padding: "20px", width: "80%", height: "700px", overflowY: "auto" }}>
                        <Stack direction="column" spacing={1} sx={{ width: "100%" }} justifyContent="center" alignContent="center">
                            {doctors.length > 0 ? doctors.map((doctor) => (
                                < DoctorCard education={doctor.education} doctorName={doctor.name} speciality={doctor.speciality} hospital={doctor.affiliation} price={doctor.sessionPrice} timeSlots={timeSlots.filter(slot => slot.doctorID == doctor._id)} 
                                appointments={appointments.filter(appointment => appointment.doctorID == doctor._id)} handleReserve={reserveSlot} doctorID={doctor._id} selectedDate={selectedDateSent}
                                getSlots={getTimeSlots} times = {timeSlotsShow} familyMembers= {familyMembers} myID={id}/>
                            )) : !loadingDoctors ? <PlaceHolder message={"No Doctors with this data"}/>
                            :<Stack direction="column" spacing={2} justifyContent="center" alignItems="center" sx={{ marginTop: "2%" }}>
                                <Skeleton animation="wave" variant="rectangular" width={1500} height={200} />
                                <Skeleton animation="wave" variant="rectangular" width={1500} height={200} />
                                <Skeleton animation="wave" variant="rectangular" width={1500} height={200} />
                            </Stack>}
                        </Stack>
                    </Paper>
                </Stack>
            </div>}
        </div>
    );
};

export default PatientSearch;
