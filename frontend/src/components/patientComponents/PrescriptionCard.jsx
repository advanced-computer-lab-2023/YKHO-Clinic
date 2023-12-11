import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton, Paper, Button, Typography, Grid, Stack } from '@mui/material'
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
export default function PrescriptionCard(props) {
    return (
        <Paper elevation={7} sx={{ padding: "20px", width: "95%", height: "100%" }}>
            <Stack direction="row" spacing={5} >

                <Stack direction="column" spacing={2}>

                    <Typography sx={{ fontSize: 24, whiteSpace: "nowrap", marginLeft: "1%" }} gutterBottom>
                        Dr. {props.doctorName}
                    </Typography>

                    <Typography sx={{ fontSize: 13, whiteSpace: "nowrap", marginLeft: "1%" }} gutterBottom>
                        {props.prescriptionName}
                    </Typography>

                    <Typography sx={{ fontSize: 13, whiteSpace: "nowrap", marginLeft: "1%" }} gutterBottom>
                        {props.date.split("T")[0]} at {props.date.split("T")[1].split(".")[0]}
                    </Typography>
                    {props.hasHealthPackage ?
                        <Typography sx={{ fontSize: 13, whiteSpace: "nowrap", marginLeft: "1%" }} gutterBottom>
                            Price: <del>{props.price} EGP</del> {props.discount} EGP
                        </Typography> : <Typography sx={{ fontSize: 13, whiteSpace: "nowrap", marginLeft: "1%" }} gutterBottom>
                            Price: {props.price} EGP
                        </Typography>
                    }

                    <Typography sx={{ fontSize: 13, whiteSpace: "nowrap", marginLeft: "1%" }} gutterBottom>
                        {props.filled ? "Prescription Filled" : "Prescription Not Filled yet"}
                    </Typography>
                    {props.paid ?
                        <Button variant="contained" size="small" sx={{ marginLeft: "1%" }} onClick={() => props.handleWallet(props.id)} disabled> Pay by Wallet </Button> :
                        <Button variant="contained" size="small" sx={{ marginLeft: "1%" }} onClick={() => props.handleWallet(props.id)}> Pay by Wallet </Button>}
                    {props.paid ? <Button variant="contained" size="small" sx={{ marginLeft: "1%" }} onClick={() => props.handleCredit(props.id)} disabled> Pay by Credit Card </Button> :
                        <Button variant="contained" size="small" sx={{ marginLeft: "1%" }} onClick={() => props.handleCredit(props.id)}> Pay by Credit Card </Button>}



                </Stack>

                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ width: "100%", overflowX: "auto" }} >
                    {props.medicines.map((medicine) => {
                        return (
                            <Paper sx={{ height: "65%", width: "100px", paddingTop: "10px" }} >
                                <Stack direction="column" spacing={2} justifyContent="center" alignItems="center">
                                    <MedicationLiquidIcon sx={{ fontSize: 40 }} />
                                    <Typography sx={{ fontSize: 18, whiteSpace: "nowrap", marginLeft: "1%" }} gutterBottom>
                                        {medicine.name}
                                    </Typography>
                                    <Typography sx={{ fontSize: 13, whiteSpace: "nowrap", marginLeft: "1%" }} gutterBottom>
                                        {medicine.dosage}
                                    </Typography>
                                </Stack>
                            </Paper>
                        )
                    })}
                </Stack>
            </Stack>
        </Paper>
    )
}
