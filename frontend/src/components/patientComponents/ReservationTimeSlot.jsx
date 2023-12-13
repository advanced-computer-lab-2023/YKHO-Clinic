import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Stack, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, Slide } from '@mui/material'
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function ReservationTimeSlot(props) {
    const currentDate = new Date();
    const dayTimeSlots = props.timeSlots.filter(slot => slot.day.toLowerCase() === props.day.toLowerCase() && !(currentDate.getHours() == parseInt(slot.from.split(':')[0]) && currentDate.getMinutes() >  parseInt(slot.from.split(':')[1])) || currentDate.getHours() > parseInt(slot.from.split(':')[0]));
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
    // let appointmentsOfToday = props.appointments.filter(appointment => appointment.date === props.todayDate);
    // let appointmentsOfTomorrow = props.appointments.filter(appointment => appointment.date === props.TomorrowDate);
    // let appointmentsOfAfterTomorrow = props.appointments.filter(appointment => appointment.date === props.AfterTomorrowDate);
    console.log(dayTimeSlots);
    return (
        // <Stack direction='column' spacing={2} sx={{ width: "100%" }}>
        //     {dayTimeSlots.map(slot => (
        //         <Button key={slot._id} variant="test" sx={{fontSize:"14px"}}>
        //             {`${slot.from} - ${slot.to}`}
        //         </Button>
        //     ))}
        // </Stack>
        <Stack direction='column' spacing={2} sx={{ width: "100%", height: "100%" }} justifyContent="flex-start" alignItems="center">
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
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => handleCloseDialog(slot._id)}>Cancel</Button>
                                <Button onClick={() => { props.handleReserve(props.doctorID, props.date, (slot.from + "," + slot.to)); handleCloseDialog(slot._id); }}>Confirm</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                );
            })}
        </Stack>
    );
}