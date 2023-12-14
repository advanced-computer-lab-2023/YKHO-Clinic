import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paper, Typography, Stack, Box, Button, } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';

export default function AppointmentCard(props) {

    return (
        <Paper elevation={7} sx={{ padding: "20px", width: "100%", height: "10%" }}>
            <Stack direction='row' spacing={2} sx={{ width: "100%" }} justifyContent="center" alignItems="center">
                <PersonIcon />
                <Stack direction='column' spacing={2} sx={{ width: "30%" }}>
                    <Typography variant='h4'>You Have an Appointment with Dr. {props.doctorName} </Typography>
                    <Typography variant='h6'> On {props.date.split("T")[0]} at {props.date.split("T")[1].split(".")[0]} </Typography>
                    <Typography variant='h6'> Session Fee: {props.price}$</Typography>
                    <Typography variant='h6'>Status: {props.status}</Typography>
                </Stack>
                <Stack>
                    <Button>Pay</Button>
                    <Button>Reschudle</Button>
                    <Button>Request a Follow up</Button>
                    <Button>Cancel</Button>
                </Stack>
            </Stack>
        </Paper>
    )
}