import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton, Paper, Button, Typography, Grid, Stack, IconButton } from '@mui/material'
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import DownloadIcon from '@mui/icons-material/Download';
export default function PrescriptionCard(props) {
    return (
        <Paper elevation={7} sx={{ padding: "20px", width: "100%", height: "80%" }}>
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
                    {props.paid ? <Button variant="contained" size="small" sx={{ marginLeft: "1%" }} onClick={() => props.handleCredit(props.id)} disabled> Pay For Prescription </Button> :
                        <Button variant="contained" size="small" sx={{ marginLeft: "1%" }} onClick={() => props.handleCredit(props.id)}> Pay for Prescription </Button>}
                    <a href={`http://localhost:3000/downloadPresc/${props.id}`} download>
                        <IconButton >
                            <DownloadIcon />
                        </IconButton>
                    </a>
                    {/* <Button variant="contained" size="small" onClick={}> Download PDF</Button> */}
                </Stack>
                <Stack direction="row" spacing={3} justifyContent="center" alignItems="center" sx={{ width: "100%", overflowX: "auto" }} >
                    {props.medicines.map((medicine) => {
                        return (
                            <Paper sx={{ height: "65%", minWidth: "100px", paddingTop: "10px" }} >
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
        </Paper >
    )
}
