import React from 'react';
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import Navbar from './Navbar'
import { Stack, FormControl, InputLabel, Select, MenuItem, Paper, Snackbar, Alert, Button } from '@mui/material'
import { set } from 'mongoose';
import FamilyMemberCard from './FamilyMemeberCard';
import { motion, AnimatePresence } from 'framer-motion';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useParams } from 'react-router-dom';
import AppointmentCard from './AppointmentsCard';

const PatientAppointments = () => {
    const [result, setResult] = useState(false);
    useEffect(() => { check(), loadAppointments(), handlePaymentSnack() }, []);
    useEffect(() => { setSearchBox(); }, [result]);
    const [appointments, setAppointments] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [open, setOpen] = useState(false);
    const [openErorr, setOpenError] = useState(false);
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

    async function loadAppointments() {
        await axios.get("http://localhost:3000/Patient/Appointments", { withCredentials: true }).then((res) => {
            var app = res.data.result
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

            console.log(res);
            loadAppointments();
        }).catch((err) => {
            console.log(err);
        });
    }
    // async function searchAppointments() {
    //     const searchValueInput = document.getElementById('searchvalue');
    //     const filterDropdown = document.getElementById('filter');
    //     const radioButtons = document.querySelectorAll('input[type="radio"][name="filters"]');

    //     let searchvalue = searchValueInput.value;
    //     let filter = filterDropdown.value;
    //     let status;
    //     radioButtons.forEach(function (radioButton) {
    //         if (radioButton.checked) {
    //             status = radioButton.value;
    //         }
    //     })

    //         ;
    //     await axios.get(`http://localhost:3000/patient/AppointmentsFilter/?filter=${filter}&searchvalue=${searchvalue}&filters=${status}`, { withCredentials: true }).then((res) => {
    //         setAppointments(res.data.result);
    //     }
    //     ).catch((err) => {
    //         console.log(err);
    //     });
    // }
    async function payByWallet(id) {
        await axios.get(`http://localhost:3000/patient/paymentWallet/${id}`, {
            withCredentials: true
        }).then((res) => {
            console.log(res);
            loadAppointments();
        }).catch((err) => {
            console.log(err);
        });
    }

    async function payByCredit(id) {
        await axios.get(`http://localhost:3000/patient/paymentcredit/${id}`, {
            withCredentials: true
        }).then((res) => {
            window.location.href = res.data.result;
            console.log(res.status);
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
        await axios.post(`http://localhost:3000/patient/addFollowUpRequest`, { doctorID: id, date: date, time: time }, {
            withCredentials: true
        }).then((res) => {
            console.log(res);
            loadAppointments();
        }
        ).catch((err) => {
            console.log(err);
        });
    }

    return (
        <div>
            {result && <div>
                <Navbar />
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
                <Stack direction="column" spacing={2} justifyContent="center" alignItems="center" sx={{ marginTop: "2%" }}>
                    <Paper variant="elevation" elevation={4} sx={{ height: "800px", width: "80%", overflowY: "auto" }}>
                        <Stack direction="column" spacing={2} justifyContent="center" alignItems="center" sx={{ padding: "15px" }}>
                            {appointments.length > 0 && appointments.map((appointment) => {
                                return <AppointmentCard id={appointment._id} doctorName={appointment.doctorID.name} date={appointment.date} price={appointment.price} status={appointment.status} handleCancel={cancelAppointment} doctorID={appointment.doctorID._id}
                                    getSlots={getTimeSlots} times={timeSlots} handleReschedule={rescheduleAppointment} paid={appointment.paid} handlePayWallet={payByWallet} handlePayCredit={payByCredit} handleFollowUp={requestFollowUp}/>
                            })}
                        </Stack>
                    </Paper>
                </Stack>
            </div>}
        </div>
    );
}

export default PatientAppointments;