import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paper, Typography, Stack, Box, Button, } from '@mui/material'
import ReservationTimeSlot from './ReservationTimeSlot';
import PersonIcon from '@mui/icons-material/Person';
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
    const appointmentsOfToday = props.appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getTime() === currentDate.getTime(); // Check if dates are equal
    });
    const appointmentsOfTomorrow = props.appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getTime() === tomorrowDate.getTime(); // Check if dates are equal
    });
    const appointmentsOfAfterTomorrow = props.appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getTime() === afterTomorrowDate.getTime(); // Check if dates are equal
    });
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    days = days.filter(day => day == currentDay || day == tomorrowDay || day == afterTomorrowDay);
    return (
        <Paper elevation={7} sx={{ padding: "20px", width: "100%", height: "90%" }}>
            <Stack direction='row' spacing={2} sx={{ width: "100%" }} justifyContent="center" alignItems="center">
                <PersonIcon sx={{ fontSize: 100 }} />
                <Stack direction='column' spacing={2} sx={{ width: "30%" }}>
                    <Typography variant='h4'> Dr. {props.doctorName} </Typography>
                    <Typography variant='h6'> {props.speciality} </Typography>
                    <Typography variant='h6'> {props.hospital} </Typography>
                    <Typography variant='h4'> Session Fee: {props.price} $</Typography>
                </Stack>
                <Stack direction='column' spacing={2} sx={{ width: "70%" }} justifyContent="center" alignItems="center">
                    <Stack direction='row' spacing={2} sx={{ width: "80%" }}>
                        {props.timeSlots.length > 0 && days.map((slot) => {
                            return <Stack direction='column' spacing={2} sx={{ width: "100%" }}>
                                {slot == currentDay && <Box sx={{ Width: "100%", height: "100%" }}>
                                    <Typography variant='h6' sx={{ Width: "100%" }}> Today </Typography>
                                    <Paper elevation={7} sx={{ padding: "20px", width: "100%", height: "160px", overflowY:"auto" }}>
                                        <ReservationTimeSlot timeSlots={props.timeSlots} day={slot} appointmentOfTheDay={appointmentsOfToday} date={currentDate} handleReserve={props.handleReserve} doctorID={props.doctorID} />
                                    </Paper>
                                </Box>}
                                {slot == tomorrowDay && <Box sx={{ Width: "100%", height: "100%" }}>
                                    <Typography variant='h6' sx={{ Width: "100%" }}> Tomorrow </Typography>
                                    <Paper elevation={7} sx={{ padding: "20px", width: "100%", height: "160px", overflowY:"auto" }}>
                                        <ReservationTimeSlot timeSlots={props.timeSlots} day={slot} appointmentOfTheDay={appointmentsOfTomorrow} date={tomorrowDate} handleReserve={props.handleReserve} doctorID={props.doctorID} />
                                    </Paper>
                                </Box>}
                                {slot != currentDay && slot != tomorrowDay && <Box sx={{ Width: "100%", height: "100%" }}>
                                    <Typography variant='h6' sx={{ Width: "100%" }}> {slot}  {afterTomorrowDate.getDate()}/{afterTomorrowDate.getMonth()+1} </Typography>
                                    <Paper elevation={7} sx={{ padding: "20px", width: "100%", height: "160px", overflowY:"auto"}}>
                                        <ReservationTimeSlot timeSlots={props.timeSlots} day={slot} appointmentOfTheDay={appointmentsOfAfterTomorrow} handleReserve={props.handleReserve} date={afterTomorrowDate} doctorID={props.doctorID} />
                                    </Paper>
                                </Box>}
                            </Stack>
                        })}
                    </Stack>
                    <Typography variant='h6' sx={{fontSize:"14px"}}> Select an Appointment </Typography>
                </Stack>
                
                <Button variant="outlined" sx={{fontSize:"14px", width:"9%", textTransform: "lowercase"}} fullWidth>Show More</Button>
            </Stack>
        </Paper>
    )
}