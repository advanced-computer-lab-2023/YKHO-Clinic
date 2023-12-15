import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paper, Typography, Stack, Box, Button, Dialog, DialogTitle, TextField, DialogActions, DialogContent, DialogContentText, Select, MenuItem, FormControl, InputLabel, } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
export default function AppointmentCard(props) {
    const [open, setOpen] = useState(false);
    const [time, setTime] = useState("");
    const [rescheduleDate, setRescheduleDate] = useState();
    const today = dayjs();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const changeTimeValue = (event) => {
        setTime(event.target.value);
    };

    return (
        <Paper elevation={7} sx={{ padding: "20px", width: "90%", height: "10%" }}>
            <Stack direction='row' spacing={2} sx={{ width: "100%" }} justifyContent="space-between" alignItems="center">
                <Stack direction='row' spacing={2} sx={{ minWidth: "400px" }} alignItems="center">
                    <PersonIcon sx={{ fontSize: "100px" }} />
                    <Stack direction='column' spacing={2} sx={{ width: "100%" }}>
                        <Typography variant='h4'>You Have an Appointment with Dr. {props.doctorName} </Typography>
                        <Typography variant='h6'> On {props.date.split("T")[0]} at {parseInt(props.date.split("T")[1].split(".")[0].split(":")[0]) + 2}:{props.date.split("T")[1].split(".")[0].split(":")[1]} </Typography>
                        <Typography variant='h6'> Session Fee: {Math.ceil(props.price)} $</Typography>
                        <Typography variant='h6'>Status: {props.status}</Typography>
                    </Stack>
                </Stack>
                {props.status != "completed" && props.status != "cancelled" ?
                    <Stack direction='row' spacing={2} sx={{ hieght: "100%" }}>
                        <Button variant='contained' disabled={props.status != "upcoming" && props.status != "rescheduled"}>Pay</Button>
                        <Button variant='contained' disabled={props.status != "upcoming" && props.status != "rescheduled"} onClick={handleClickOpen}>Reschudle</Button>
                        <Button variant='outlined' disabled={props.status != "upcoming" && props.status != "rescheduled"} onClick={() => props.handleCancel(props.id)}>Cancel</Button>
                    </Stack> : props.status == "completed" && <Button variant='contained' disabled={props.status != "completed"}>Request a Follow up</Button>}
            </Stack>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Reschudle an Appointment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You will Reschdule your appointment with Dr. {props.doctorName} on {props.date.split("T")[0]} at {parseInt(props.date.split("T")[1].split(".")[0].split(":")[0]) + 2}:{props.date.split("T")[1].split(".")[0].split(":")[1]}
                        <br />Are you sure you want to reschudle? (This action is not reversable)
                    </DialogContentText>

                    <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ marginTop: 5 }}>
                        <DatePicker id="searchDate" minDate={today.add(1, 'day')} value={rescheduleDate} onChange={(date) => { setRescheduleDate(date);
                            props.getSlots(props.doctorID, date, new Date(date).getDay())}} />
                    </LocalizationProvider>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl sx={{ width: 313, marginTop: 5 }} >
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
                                        return <MenuItem key={index} value={time.from+"-"+time.to}>{time.from+"-"+time.to}</MenuItem>
                                    }
                                    )
                                }
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => {
                        props.handleReschedule(props.id, rescheduleDate, time);
                        return handleClose();
                    }}>Reschedule</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    )
}