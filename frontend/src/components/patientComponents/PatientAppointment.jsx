import React from 'react';
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import Navbar from './Navbar'
import { Stack, FormControl, InputLabel, Select, MenuItem, Paper, Snackbar, Alert, Button, Menu, Box } from '@mui/material'
import { set } from 'mongoose';
import { motion, AnimatePresence } from 'framer-motion';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useParams } from 'react-router-dom';
import AppointmentCard from './AppointmentsCard';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
// socket
import io from 'socket.io-client';
const socket = io.connect("http://localhost:3000");

const init = async () => {
    await axios.get("http://localhost:3000/rooms", {
        withCredentials: true
    }).then((res) => {
        let rooms = res.data;
        for (let i = 0; i < rooms.length; i++) {
            joinRoom(rooms[i])
        }
    })
}

const joinRoom = (room) => {
    socket.emit("join_room", room)
}


const PatientAppointments = () => {
    // socket
    useEffect(() => { init() }, [])

    const [result, setResult] = useState(false);
    useEffect(() => { getID() }, []);
    const [id, setID] = useState("");
    const [fam, setFam] = useState(id);
    useEffect(() => { check(), loadAppointments(), handlePaymentSnack(), getFamilyMembers() }, []);
    useEffect(() => { loadAppointments() }, [fam]);
    const [appointments, setAppointments] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [open, setOpen] = useState(false);
    const [openErorr, setOpenError] = useState(false);
    const [filled, setFilled] = useState("");
    const [filled2, setFilled2] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [familyMembers, setFamilyMembers] = useState([]);
    
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

    async function getID() {
        await axios.get("http://localhost:3000/patient/getMyID", { withCredentials: true }).then((res) => {
            setID(res.data.result);
            setFam(res.data.result);
        }
        ).catch((err) => {
            console.log(err);
        })
    }
    async function loadAppointments() {
        console.log(fam);
        await axios.get(`http://localhost:3000/Patient/Appointments/${fam}`, { withCredentials: true }).then((res) => {
            var app = res.data.result
            app = app.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA - dateB;
            });
            setAppointments(app);
        }
        ).catch((err) => {
            console.log(err);
        })
    }
    function setSearchBox() {

        const searchValueInput = document.getElementById('searchvalue');
        const filterDropdown = document.getElementById('filter');
        if (searchValueInput) {
            filterDropdown.addEventListener('change', function () {
                if (filterDropdown.value === 'Date') {
                    // Show the date input field when Date is selected
                    searchValueInput.type = 'date';

                } else {
                    // Show the text input field for other options
                    searchValueInput.type = 'text';
                }
            }
            );
            const radioButtons = document.querySelectorAll('input[type="radio"][name="filters"]');
            radioButtons.forEach(function (radioButton) {
                let prevChecked = false; // Initialize a variable to track the previous checked state

                radioButton.addEventListener('click', function () {
                    if (prevChecked) {
                        // Deselect the clicked radio button
                        this.checked = false;
                    }
                    prevChecked = this.checked; // Update the previous checked state
                });
            });
        }
    }
    async function cancelAppointment(id) {
        await axios.post(`http://localhost:3000/patient/cancelAppointment`, { id: id }, {
            withCredentials: true
        }).then((res) => {
            socket.emit("update", id);
            console.log(res);
            loadAppointments();
        }).catch((err) => {
            console.log(err);
        });
    }

    async function filterAppointments() {
        await axios.get(`http://localhost:3000/Patient/AppointmentsFilter?date=${selectedDate}&searchvalue=${filled}&filters=${filled2}&id=${fam}`, {
            withCredentials: true
        }).then((res) => {
            var app = res.data.result
            app = app.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA - dateB;
            });
            setAppointments(app);
        }).catch((err) => {
            console.log(err);
        });
    }
    async function payByWallet(id) {
        await axios.get(`http://localhost:3000/patient/paymentWallet/${id}`, {
            withCredentials: true
        }).then((res) => {
            console.log(res);
            loadAppointments();
            if(res.data.result == true){
                setOpen(true);
            }else{
                setOpenError(true);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    async function payByCredit(id) {
        await axios.get(`http://localhost:3000/patient/paymentcredit/${id}`, {
            withCredentials: true
        }).then((res) => {
            window.location.href = res.data.result;
            handleReset();
        }).catch((err) => {
            console.log(err);
        })

    }

    async function getTimeSlots(id, date, day) {
        await axios.get(`http://localhost:3000/patient/getTimeSlotOnDate?id=${id}&&date=${date}&&day=${day}`, {
            withCredentials: true,
        }).then((res) => {
            setTimeSlots(res.data.result);
        }).catch((err) => {
            console.log(err);
        });
    }

    async function rescheduleAppointment(id, date, time) {
        await axios.post(`http://localhost:3000/patient/rescheduleAppointment`, { appointmentId: id, date: date, time: time }, {
            withCredentials: true
        }).then((res) => {
            socket.emit("update", id);
            console.log(res);
            loadAppointments();
        }).catch((err) => {
            console.log(err);
        });
    }

    const handlePaymentSnack = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const successParam = urlParams.get('success');

        if (successParam !== null) {
            if (successParam === 'true')
                setOpen(true);
            else if (successParam === 'false')
                setOpenError(true)

            window.history.replaceState(null, '', '/patient/Appointments');
        }

    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setOpenError(false);
    };

    async function requestFollowUp(id, date, time) {
        await axios.post(`http://localhost:3000/patient/addFollowUpRequest`, { doctorID: id, date: date, time: time, id: fam }, {
            withCredentials: true
        }).then((res) => {
            console.log(res);
            loadAppointments();
        }
        ).catch((err) => {
            console.log(err);
        });
    }

    const handleFilled = (event) => {
        setFilled(event.target.value);
    };

    const handleFilled2 = (event) => {
        setFilled2(event.target.value);
    };
    const handleFam = (event) => {
        setFam(event.target.value);
    };
    const handleReset = () => {
        setFilled2("");
        setSelectedDate(null);
        setFilled("");
    };
    async function getFamilyMembers() {
        await axios.get(`http://localhost:3000/patient/readFamilyMembers`, {
            withCredentials: true
        }).then((res) => {
            setFamilyMembers(res.data.result);
        }).catch((err) => {
            console.log(err);
        });
    }
    
    return (
        <div>
            {result && <div>
                <Navbar goEditInfo={goEditInfo} openHelp={toggleFilter} goHealthPackages={goHealthPackages} goHome={goHome} handleSearch={handleSearch} goFiles={goFiles} handlePrescriptions={handlePrescriptions} handleAppointments={handleAppointments} handleFamilyMembers={handleFamilyMembers} handleManageFamily={handleManageFamily} viewAllDoctors={viewAllDoctors} toChats={toChats} />
                <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "center" }} open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Appoinment Payment Successful
                    </Alert>
                </Snackbar>
                <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "center" }} open={openErorr} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        Appoinment Payment failed
                    </Alert>
                </Snackbar>
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
                <Stack direction="column" spacing={2} justifyContent="center" alignItems="center" sx={{ marginTop: "2%" }}>
                    <Stack direction="row" spacing={2} justifyContent="flex-start" alignItems="center" sx={{ width: "70%" }} >
                        <FormControl sx={{ m: 1, minWidth: 200 }}>
                            <InputLabel id="status">Status</InputLabel>
                            <Select
                                id="filterSpeciality"
                                value={filled}
                                label="Status Filter"
                                onChange={handleFilled}
                            >
                                <MenuItem value={""}> Any </MenuItem>
                                <MenuItem value={"cancelled"}> Cancelled </MenuItem>
                                <MenuItem value={"completed"}> Completed </MenuItem>
                                <MenuItem value={"rescheduled"}> Rescheduled </MenuItem>
                                <MenuItem value={"upcoming"}> Upcoming </MenuItem>
                            </Select>
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DatePicker id="DOP" name="DOP" label="Date of Appointment" value={selectedDate} onChange={(date) => setSelectedDate(date)} />
                        </LocalizationProvider>
                        <FormControl sx={{ m: 1, minWidth: 200 }}>
                            <InputLabel id="status">Time Perspective</InputLabel>
                            <Select
                                id="filterCondtion"
                                value={filled2}
                                label="Time Perspective"
                                onChange={handleFilled2}
                            >
                                <MenuItem value={""}> Any </MenuItem>
                                <MenuItem value={"past"}> Past </MenuItem>
                                <MenuItem value={"upcoming"}> Upcoming </MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" size="small" sx={{ marginLeft: "1%" }} onClick={filterAppointments}> Filter </Button>
                        <Button variant="outlined" size="small" sx={{ marginLeft: "1%" }} onClick={() => { loadAppointments(); return handleReset(); }}> Reset </Button>
                        <Box>
                            <FormControl sx={{ minWidth: 200, marginLeft:"300px" }}>
                                <InputLabel id="status">Family Member</InputLabel>
                                <Select
                                    id="filterCondtion"
                                    value={fam}
                                    label="Family Member"
                                    onChange={handleFam}
                                >
                                    <MenuItem value={id}> Me </MenuItem>
                                    {familyMembers.length > 0 && familyMembers.map((member) => {
                                        if(member.patientID != null)
                                            return <MenuItem value={member.patientID}> {member.name} </MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Box>
                    </Stack>
                    <Paper variant="elevation" elevation={4} sx={{ height: "750px", width: "80%", overflowY: "auto" }}>
                        <Stack direction="column" spacing={2} justifyContent="center" alignItems="center" sx={{ padding: "15px" }}>
                            {appointments.length > 0 && appointments.map((appointment) => {
                                return <AppointmentCard id={appointment._id} doctorName={appointment.doctorID.name} date={appointment.date} price={appointment.price} status={appointment.status} handleCancel={cancelAppointment} doctorID={appointment.doctorID._id}
                                    getSlots={getTimeSlots} times={timeSlots} handleReschedule={rescheduleAppointment} paid={appointment.paid} handlePayWallet={payByWallet} handlePayCredit={payByCredit} handleFollowUp={requestFollowUp} />
                            })}
                        </Stack>
                    </Paper>
                </Stack>
            </div>}
        </div>
    );
}

export default PatientAppointments;