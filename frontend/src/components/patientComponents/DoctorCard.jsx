import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paper, Typography, Stack, Box, Button, Dialog, DialogTitle, TextField, DialogActions, DialogContent, DialogContentText, Select, MenuItem, FormControl, InputLabel, } from '@mui/material'
import ReservationTimeSlot from './ReservationTimeSlot';
import PersonIcon from '@mui/icons-material/Person';
import PlaceHolder from '../PlaceHolder.jsx';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDate = new Date();
    return days[currentDate.getDay()];
};
const getDayForTomorrow = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDate = new Date();
    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(currentDate.getDate() + 1); // Incrementing the current date by 1 to get tomorrow's date
    return days[tomorrowDate.getDay()];
};
const getDayForAfterTomorrow = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDate = new Date();
    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(currentDate.getDate() + 2); // Incrementing the current date by 1 to get tomorrow's date
    return days[tomorrowDate.getDay()];
};

export default function DoctorCard(props) {
    const [open, setOpen] = useState(false);
    const [time, setTime] = useState("");
    const [rescheduleDate, setRescheduleDate] = useState();
    const [id, setID] = useState(props.myID);
    const [fam, setFam] = useState(id);

    const today = dayjs();

    const changeTimeValue = (event) => {
        setTime(event.target.value);
    };

    const currentDay = getCurrentDay();
    const tomorrowDay = getDayForTomorrow();
    const afterTomorrowDay = getDayForAfterTomorrow();

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(currentDate.getDate() + 1);
    tomorrowDate.setHours(0, 0, 0, 0);

    const afterTomorrowDate = new Date(currentDate);
    afterTomorrowDate.setDate(currentDate.getDate() + 2);
    afterTomorrowDate.setHours(0, 0, 0, 0);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setRescheduleDate(null);
        setTime("");
    };

    const handleFam = (event) => {
        setFam(event.target.value);
    };

    const appointmentsOfToday = props.appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getDate() == currentDate.getDate() && appointmentDate.getMonth() == currentDate.getMonth() && appointmentDate.getFullYear() == currentDate.getFullYear(); // Check if dates are equal
    });
    const appointmentsOfTomorrow = props.appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getDate() == tomorrowDate.getDate() && appointmentDate.getMonth() == tomorrowDate.getMonth() && appointmentDate.getFullYear() == tomorrowDate.getFullYear(); // Check if dates are equal
    });
    const appointmentsOfAfterTomorrow = props.appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getDate() == afterTomorrowDate.getDate() && appointmentDate.getMonth() == afterTomorrowDate.getMonth() && appointmentDate.getFullYear() == afterTomorrowDate.getFullYear();
    });
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const selectedDay = days[new Date(props.selectedDate).getDay()];
    days = days.filter(day => day == currentDay || day == tomorrowDay || day == afterTomorrowDay);
    return (
        <Paper elevation={7} sx={{ padding: "20px", width: "100%", minHeight: "90%" }}>
            <Stack direction='row' spacing={2} sx={{ width: "100%" }} justifyContent="center" alignItems="center">
                <PersonIcon sx={{ fontSize: 100 }} />
                <Stack direction='column' spacing={2} sx={{ width: "30%" }}>
                    <Typography variant='h4'> Dr. {props.doctorName} </Typography>
                    <Typography variant='h6'> Speciality: {props.speciality} </Typography>
                    <Typography variant='h6'> hospital: {props.hospital} </Typography>
                    <Typography variant='h6'> education: {props.education} </Typography>
                    <Typography variant='h4'> Session Fee: {props.price} $</Typography>
                </Stack>
                {props.timeSlots.length > 0 ? <Stack direction='column' spacing={2} sx={{ width: "70%", height: "230.39px" }} justifyContent="center" alignItems="center">
                    <Stack direction='row' spacing={2} sx={{ width: "80%" }} justifyContent="center" alignContent="center">
                        {props.selectedDate == null && props.timeSlots.length > 0 && days.map((slot) => {
                            return slot === currentDay &&
                                <Stack direction='column' spacing={2} sx={{ width: "100%" }}>
                                    <Box sx={{ Width: "100%", height: "100%" }}>
                                        <Typography variant='h6' sx={{ Width: "100%" }}> Today </Typography>
                                        <Paper elevation={5} sx={{ padding: "20px", minWidth: "170px", height: "160px", overflowY: "auto" }}>
                                            <ReservationTimeSlot timeSlots={props.timeSlots} day={slot} appointmentOfTheDay={appointmentsOfToday} date={currentDate} handleReserve={props.handleReserve} doctorID={props.doctorID} familyMembers={props.familyMembers} myID={props.myID} />
                                        </Paper>
                                    </Box>
                                </Stack>
                        })}
                        {props.selectedDate == null && props.timeSlots.length > 0 && days.map((slot) => {
                            return slot == tomorrowDay && <Stack direction='column' spacing={2} sx={{ width: "100%" }}>
                                <Box sx={{ Width: "100%", height: "100%" }}>
                                    <Typography variant='h6' sx={{ Width: "100%" }}> Tomorrow </Typography>
                                    <Paper elevation={5} sx={{ padding: "20px", minWidth: "170px", height: "160px", overflowY: "auto" }}>
                                        <ReservationTimeSlot timeSlots={props.timeSlots} day={slot} appointmentOfTheDay={appointmentsOfTomorrow} date={tomorrowDate} handleReserve={props.handleReserve} doctorID={props.doctorID} familyMembers={props.familyMembers} myID={props.myID} />
                                    </Paper>
                                </Box>
                            </Stack>
                        })}
                        {props.selectedDate == null && props.timeSlots.length > 0 && days.map((slot) => {
                            return slot === afterTomorrowDay && <Stack direction='column' spacing={2} sx={{ width: "100%" }}>
                                <Box sx={{ Width: "100%", height: "100%" }}>
                                    <Typography variant='h6' sx={{ Width: "100%" }}> {slot}  {afterTomorrowDate.getDate()}/{afterTomorrowDate.getMonth() + 1} </Typography>
                                    <Paper elevation={5} sx={{ padding: "20px", minWidth: "170px", height: "160px", overflowY: "auto" }}>
                                        <ReservationTimeSlot timeSlots={props.timeSlots} day={slot} appointmentOfTheDay={appointmentsOfAfterTomorrow} handleReserve={props.handleReserve} date={afterTomorrowDate} doctorID={props.doctorID} familyMembers={props.familyMembers} myID={props.myID} />
                                    </Paper>
                                </Box>
                            </Stack>
                        })}
                        {props.selectedDate != null && props.timeSlots.length > 0 &&
                            <Stack direction='column' spacing={2} sx={{ minWidth: "210px", maxWidth: "170px" }} justifyContent="center" alignContent="center">
                                <Box sx={{ minWidth: "170px", maxWidth: "210px", height: "100%" }}>
                                    <Typography variant='h6' sx={{ width: "100%" }}>{selectedDay==currentDay?"Today":selectedDay==tomorrowDay?"Tomorrow":`${selectedDay} ${new Date(props.selectedDate).getDate()}/${new Date(props.selectedDate).getMonth() + 1}`}  </Typography>
                                    <Paper elevation={5} sx={{ padding: "20px", minWidth: "210px", maxWidth: "170px", height: "160px", overflowY: "auto" }}>
                                        <ReservationTimeSlot timeSlots={props.timeSlots} day={selectedDay} appointmentOfTheDay={props.appointments.filter(appointment => {
                                            const appointmentDate = new Date(appointment.date);
                                            appointmentDate.setHours(0, 0, 0, 0);
                                            return appointmentDate.getDate() == new Date(props.selectedDate).getDate() && appointmentDate.getMonth() == new Date(props.selectedDate).getMonth() && appointmentDate.getFullYear() == new Date(props.selectedDate).getFullYear();
                                        })} handleReserve={props.handleReserve} date={new Date(props.selectedDate)} doctorID={props.doctorID} familyMembers={props.familyMembers} myID={props.myID} />
                                    </Paper>
                                </Box>
                            </Stack>}
                    </Stack>
                    <Typography variant='h6' sx={{ fontSize: "14px" }}> Select an Appointment </Typography>
                </Stack> : <Stack direction='column' spacing={2} sx={{ width: "100%", height: "230.39px" }} justifyContent="center" alignItems="center">
                    <PlaceHolder message="Doctor does not have any slots" width="350px" height="230px" />
                </Stack>}
                {props.timeSlots.length > 0 && <Button variant="outlined" sx={{ fontSize: "14px", width: "9%", textTransform: "lowercase" }} fullWidth onClick={handleClickOpen}>Show More</Button>}
            </Stack>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Schedule an Appointment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Choose a date to see Time Slots for Dr. {props.doctorName}
                    </DialogContentText>
                    <Stack direction='row' spacing={2} sx={{ width: "100%" }} justifyContent="center" alignItems="center">
                        <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ marginTop: 5 }}>
                            <DatePicker id="searchDate" minDate={today.add(1, 'day')} value={rescheduleDate} onChange={(date) => {
                                setRescheduleDate(date);
                                props.getSlots(props.doctorID, date, new Date(date).getDay())
                            }} />
                        </LocalizationProvider>
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl sx={{ width: 313, mr:1 }} >
                                <InputLabel id="TimeSelector">{props.times.length == 0 && "no appointment with this date"}{props.times.length > 0 && "Select a time"}</InputLabel>
                                <Select
                                    labelId="TimeSelector"
                                    id="demo-simple-select"
                                    label="Time"
                                    value={time}
                                    onChange={changeTimeValue}
                                    disabled={props.times.length == 0}
                                >
                                    <MenuItem value={""}>None</MenuItem>
                                    {props.times.length > 0 &&
                                        props.times.map((time, index) => {
                                            return <MenuItem key={index} value={time.from + "," + time.to}>{time.from + "-" + time.to}</MenuItem>
                                        }
                                        )
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                    </Stack>
                    <Box sx={{mt: 5 }}>
                        <DialogContentText>
                            is it for you or for a family member?
                        </DialogContentText>
                        <FormControl sx={{ minWidth: 200, mt:1}}>
                            <InputLabel id="status">Family Member</InputLabel>
                            <Select
                                id="filterCondtion"
                                value={fam}
                                label="Family Member"
                                onChange={handleFam}
                            >
                                <MenuItem value={id}> Me </MenuItem>

                                {props.familyMembers.length > 0 && props.familyMembers.map((member) => {
                                    if (member.patientID != null)
                                        return <MenuItem value={member.patientID}> {member.name} </MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => {
                        props.handleReserve(props.doctorID, rescheduleDate, time, fam);
                        return handleClose();
                    }}>Schedule</Button>
                </DialogActions>
            </Dialog>

        </Paper>
    )
}