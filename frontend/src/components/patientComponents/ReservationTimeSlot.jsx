import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Stack, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, Slide, Typography, Box, Select, MenuItem, FormControl, InputLabel, } from '@mui/material'
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function ReservationTimeSlot(props) {
    const [id, setID] = useState(props.myID);
    const [fam, setFam] = useState(id);

    const currentDate = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const dayTimeSlots = props.timeSlots.filter(slot => {
        return (slot.day.toLowerCase() === props.day.toLowerCase()) && ((props.day.toLowerCase() != (days[currentDate.getDay()].toLowerCase())) || (!(currentDate.getHours() == parseInt(slot.from.split(':')[0]) && currentDate.getMinutes() > parseInt(slot.from.split(':')[1])) && currentDate.getHours() < parseInt(slot.from.split(':')[0])));
    });
    dayTimeSlots.sort((a, b) => {
        const timeA = new Date(`2000-01-01T${a.from}`);
        const timeB = new Date(`2000-01-01T${b.from}`);
        return timeA - timeB;
    });
    const [openDialog, setOpenDialog] = useState({}); // State to manage open/close state of dialogs
    // Function to handle opening a dialog for a specific slot
    const handleOpenDialog = (slotId) => {
        setOpenDialog(prevState => ({
            ...prevState,
            [slotId]: true, // Set the specific slot's dialog to open
        }));
    };

    // Function to handle closing a dialog for a specific slot
    const handleCloseDialog = (slotId) => {
        setOpenDialog(prevState => ({
            ...prevState,
            [slotId]: false, // Set the specific slot's dialog to close
        }));
    };

    const handleFam = (event) => {
        setFam(event.target.value);
    };

    return (
        <Box sx={{ height: "100%" }} >
            {dayTimeSlots.length > 0 ? <Stack direction='column' spacing={2} sx={{ width: "100%", height: "100%" }} justifyContent="flex-start" alignItems="center">
                {dayTimeSlots.map(slot => {

                    const isSlotBooked = props.appointmentOfTheDay.some(appointment => {
                        const appointmentTime = new Date(appointment.date);
                        const [hours, minutes] = slot.from.split(':');
                        const slotTime = new Date(appointmentTime);
                        slotTime.setHours(hours);
                        slotTime.setMinutes(minutes);
                        return slotTime.getHours() === (parseInt(appointment.date.split('T')[1].split('.')[0].split(':')[0]) + 2) && (slotTime.getMinutes() - 5 <= parseInt(appointment.date.split('T')[1].split('.')[0].split(':')[1]) && slotTime.getMinutes() + 5 >= parseInt(appointment.date.split('T')[1].split('.')[0].split(':')[1]));
                    });

                    return (
                        <div key={slot._id}>
                            <Button
                                key={slot._id}
                                variant="test"
                                sx={{ fontSize: "14px" }}
                                disabled={isSlotBooked}
                                onClick={() => handleOpenDialog(slot._id)}
                            // () => props.handleReserve(props.doctorID, props.date, (slot.from + "," + slot.to))
                            >
                                {`${slot.from} - ${slot.to}`}
                            </Button>
                            <Dialog
                                open={!!openDialog[slot._id]}
                                TransitionComponent={Transition}
                                keepMounted
                                onClose={() => handleCloseDialog(slot._id)}
                                aria-describedby="alert-dialog-slide-description"
                            >
                                <DialogTitle>{"Reserving an appointment"}</DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-slide-description">
                                        You Are Reserving an appointment with Dr. Shanky from {slot.from} to {slot.to} on {props.date.getDate()}/{props.date.getMonth() + 1}/{props.date.getFullYear()}
                                    </DialogContentText>
                                    <Box>
                                        <FormControl sx={{ minWidth: 200 }}>
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
                                    <Button onClick={() => handleCloseDialog(slot._id)}>Cancel</Button>
                                    <Button onClick={() => { props.handleReserve(props.doctorID, props.date, (slot.from + "," + slot.to), fam); handleCloseDialog(slot._id); }}>Confirm</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    );
                })}
            </Stack> : <Stack direction='column' spacing={2} sx={{ width: "100%", height: "100%" }} justifyContent="center" alignItems="center">
                <Typography variant='h6' sx={{ fontSize: "14px" }}> No Time Slots Available </Typography>
            </Stack>}
        </Box>
    );
}