import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton, Paper, Button, Typography, Grid, Stack, IconButton, Dialog, DialogTitle, TextField, DialogActions, DialogContent, DialogContentText, } from '@mui/material'
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import DownloadIcon from '@mui/icons-material/Download';
export default function PrescriptionCard(props) {
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
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
                            Price: <del>{props.price} </del> {props.discount} $
                        </Typography> : <Typography sx={{ fontSize: 13, whiteSpace: "nowrap", marginLeft: "1%" }} gutterBottom>
                            Price: {props.price} $
                        </Typography>
                    }

                    <Typography sx={{ fontSize: 13, whiteSpace: "nowrap", marginLeft: "1%" }} gutterBottom>
                        {props.filled ? "Prescription Filled" : "Prescription Not Filled yet"}
                    </Typography>
                    <Button variant="contained" size="small" sx={{ marginLeft: "1%" }} onClick={handleClickOpen}> View Details </Button>
                    <a href={`http://localhost:3000/downloadPresc/${props.id}`} download>
                        <IconButton >
                            <DownloadIcon />
                        </IconButton>
                    </a>
                    {/* <Button variant="contained" size="small" onClick={}> Download PDF</Button> */}
                </Stack>



                <Dialog open={open} onClose={handleClose}>

                    <DialogTitle>Prescription Details</DialogTitle>
                    <DialogContent>
                        <div style={{ display: "flex", justifyContent: "center", alignItems:"center", width:"500px", height:"400px" }}>
                            <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center", alignItems:"center", minWidth: "500px", minHeight: "400px", maxHeight: "400px", overflowY: "auto" }}>

                                {props.medicines.map((medicine) => {
                                    return (
                                        <Grid item key={medicine._id}>
                                            <Paper elevation={4} sx={{ minWidth: "140px", minHeight: "150px", paddingTop: "10px" }} >
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
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Close</Button>
                        {props.filled ? <Button variant="contained" size="small" sx={{ marginLeft: "1%" }} onClick={() => props.handleCredit(props.id)} disabled> Pay For Prescription </Button> :
                            <Button variant="contained" size="small" sx={{ marginLeft: "1%" }} onClick={() => props.handleCredit(props.id)}> Pay for Prescription </Button>}
                    </DialogActions>
                </Dialog>

            </Stack>
        </Paper >
    )
}
