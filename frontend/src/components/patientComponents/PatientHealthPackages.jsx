import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Typography, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, Snackbar } from '@mui/material';
import Stack from '@mui/material/Stack';
import healthPackageIcon from '../../assets/healthIcon.svg';
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
import PrimarySearchAppBar from './Navbar';
import { useParams } from 'react-router-dom';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function patientHealthPackages() {
    const [error, setError] = useState('');
    const [healthPackages, setHealthPackages] = useState([]);
    const [subscription, setSubscription] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [messageAdd, setMessageAdd] = useState("");
    const [messageCreate, setMessageCreate] = useState("");
    const [openDialog, setOpenDialog] = useState({});
    const [open, setOpen] = useState(false);
    const [openErorr, setOpenError] = useState(false);
    const [result, setResult] = useState(false);
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("");
    const { ID } = useParams();
    const [openDialogCancel, setOpenDialogCancel] = useState({});
    const [openCancel, setOpenCancel] = useState(false);
    useEffect(() => { getPackages(), check(), getSubscription(), handlePaymentSnack() }, []);
    //  const [breadcrumbs, setBreadcrumbs] = useState([{}]);
    async function check() {
        try {
            const res = await axios.get("http://localhost:3000/loggedIn", {
                withCredentials: true
            });

            if (res.data.type === "admin") {
                window.location.href = "/admin/home";
                // // Check if breadcrumbs contain the "Home" breadcrumb
                // let savedBreadcrumbs = JSON.parse(localStorage.getItem('breadcrumbs'));
                // setBreadcrumbs(savedBreadcrumbs);

                // const healthPackageBreadcrumb = { label: "Health Packages", href: "/admin/healthPackages" };
                // const hasHealthPackageBreadcrumb = savedBreadcrumbs.some(
                //   (item) => item.label == healthPackageBreadcrumb.label
                // );
                //   console.log(hasHealthPackageBreadcrumb)
                // // If not, add it to the breadcrumbs
                // if (!hasHealthPackageBreadcrumb) {
                //   const updatedBreadcrumbs = [healthPackageBreadcrumb];
                //   setBreadcrumbs(updatedBreadcrumbs);
                //   localStorage.setItem('breadcrumbs', JSON.stringify(updatedBreadcrumbs));
                // }
            } else if (res.data.type === "patient") {
                setResult(true);
            } else if (res.data.type === "doctor") {
                window.location.href = "/doctor/home";
            } else {
                window.location.href = "/";
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                window.location.href = "/";
            } else {
                setError(err.message);
            }
        }
    }

    async function getPackages() {
        await axios.get("http://localhost:3000/getHealthPackages", {
            withCredentials: true,
        }).then((res) => {
            const sortedArray = res.data.healthPackages.sort((a, b) => a.price - b.price);
            setHealthPackages(sortedArray);
        }).catch((err) => {
            console.log(err);
        });
    }

    async function getSubscription() {
        try {
            const res = await axios.get("http://localhost:3000/patient/plan", {
                withCredentials: true,
            });
            setSubscription(res.data.result);
            setEndDate(res.data.endDate);
            setStatus(res.data.state);
        } catch (err) {
            setError(err.message);
        }
    }

    const handleOpenDialog = (slotId) => {
        setOpenDialog(prevState => ({
            ...prevState,
            [slotId]: true, // Set the specific slot's dialog to open
        }));
    };
    const handleOpenDialogCancel = (slotId) => {
        setOpenDialogCancel(prevState => ({
            ...prevState,
            [slotId]: true, // Set the specific slot's dialog to open
        }));
    };

    const handleCloseDialog = (slotId) => {
        setOpenDialog(prevState => ({
            ...prevState,
            [slotId]: false, // Set the specific slot's dialog to close
        }));
    };
    const handleCloseDialogCancel = (slotId) => {
        setOpenDialogCancel(prevState => ({
            ...prevState,
            [slotId]: false, // Set the specific slot's dialog to close
        }));
    };

    async function handleSub(healthPackage, paymentMethod) {
        await axios.post(`http://localhost:3000/patient/subscribe/${healthPackage}`, { id: ID, paymentMethod: paymentMethod }, {
            withCredentials: true,
        }).then((res) => {
            console.log(res.data);
            getPackages();
            getSubscription();
            if (paymentMethod != "wallet") {
                window.location.href = res.data.result;
            }else{
                if(res.data.result == true){
                    setOpen(true);
                }else{
                    setOpenError(true);
                }
            }
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
                setOpenError(true);

            window.history.replaceState(null, '', `/patient/healthPackages/${ID}`);
        }

    }

    async function handleCancel() {
        await axios.get(`http://localhost:3000/patient/deleteSubscription?id=${ID}`, {
            withCredentials: true,
        }).then((res) => {
            console.log(res.data);
            getPackages();
            getSubscription();
            setOpenCancel(true);
        }).catch((err) => {
            console.log(err);
        });
    }

    //   function handleBreadcrumbClick(event, breadcrumb) {
    //     event.preventDefault();
    //     // Find the index of the clicked breadcrumb in the array
    //     const index = breadcrumbs.findIndex((item) => item.label == breadcrumb.label);
    //     let updatedBreadcrumbs;
    //     if(index == -1){
    //       updatedBreadcrumbs = ([...breadcrumbs, breadcrumb]);
    //     }else{
    //     // Slice the array up to the clicked breadcrumb (inclusive)
    //       updatedBreadcrumbs = breadcrumbs.slice(0, index + 1);
    //     }
    //     console.log(index);
    //     // Set the updated breadcrumbs
    //     setBreadcrumbs(updatedBreadcrumbs);

    //     // Save updated breadcrumbs to localStorage
    //     localStorage.setItem('breadcrumbs', JSON.stringify(updatedBreadcrumbs));

    //     console.log(updatedBreadcrumbs)
    //     // Navigate to the new page
    //     window.location.href = breadcrumb.href;
    //   }


    // useEffect(() => {
    //   getPackages();
    // }, []);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setOpenError(false);
    };
    return (result &&
        <div>
            <PrimarySearchAppBar />
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
            <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "center" }} open={openCancel} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Appoinment Canceled Successfully
                </Alert>
            </Snackbar>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography style={{ marginBottom: '30px', marginTop: '30px', fontSize: '2em' }}>Health Packages</Typography>
                <Paper elevation={6} sx={{ display: 'flex', overflowX: 'auto', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '80px', width: '1300px' }}>
                    <Stack direction='row' spacing={3} sx={{ height: '500px', width: '100%' }}>
                        {healthPackages.map((packagesTable) => (
                            <div style={{ width: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ border: '2px solid black', width: '270px', height: '400px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <img style={{ width: '110px' }} src={healthPackageIcon} />
                                        <Typography style={{ fontWeight: 'bold', marginBottom: '20px' }}>{packagesTable.packageName} Package</Typography>
                                        <Typography>Pharmacy Discount: <span style={{ fontWeight: 'bold' }}>{packagesTable.pharmacyDiscount}%</span></Typography>
                                        <Typography>Doctor Discount: <span style={{ fontWeight: 'bold' }}>{packagesTable.doctorDiscount}%</span></Typography>
                                        <Typography>Family Discount: <span style={{ fontWeight: 'bold' }}>{packagesTable.familyDiscount}%</span></Typography>
                                        {subscription == packagesTable.packageName ? (
                                            <div>
                                                <Typography style={{ marginLeft: '40px' }}>State: <span style={{ fontWeight: 'bold' }}>{status}</span></Typography>
                                                <Typography style={{ marginBottom: '0px' }}>Your Subscription will end at <br /><span style={{ marginLeft: '60px', fontWeight: 'bold' }}>{endDate.split("T")[0]}</span></Typography>
                                            </div>
                                        ) : (
                                            <Typography style={{ marginBottom: '35px' }}>Duraion: <span style={{ fontWeight: 'bold' }}>1 year</span></Typography>
                                        )}
                                        <Typography>Price: <span style={{ fontWeight: 'bold' }}>{packagesTable.price}</span></Typography>
                                        {subscription == packagesTable.packageName ? (
                                            <div style={{ marginTop: '13px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <Button style={{ marginTop: '5px' }} variant="contained" disabled={status == "cancelled"} onClick={() => handleOpenDialogCancel(packagesTable._id)} >Cancel</Button>
                                            </div>
                                        ) : (
                                            <Button style={{ marginTop: '30px' }} variant="contained" disabled={subscription != "none"} onClick={() => handleOpenDialog(packagesTable._id)}>
                                                Subscribe
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <Dialog open={!!openDialog[packagesTable._id]} onClose={() => handleCloseDialog(packagesTable._id)}>
                                    <DialogTitle>Pay for a Subscribtion</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Subscribe to {packagesTable.packageName} for {packagesTable.price} EGP
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => handleCloseDialog(packagesTable._id)}>Cancel</Button>
                                        <Button onClick={() => {
                                            handleSub(packagesTable.packageName, "wallet")
                                            return handleCloseDialog(packagesTable._id);
                                        }}>Pay by Wallet</Button>
                                        <Button onClick={() => {
                                            handleSub(packagesTable.packageName, "credit")
                                            return handleCloseDialog(packagesTable._id);
                                        }}>Pay by Credit</Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog open={!!openDialogCancel[packagesTable._id]} onClose={() => handleCloseDialogCancel(packagesTable._id)}>
                                    <DialogTitle>Cancel a Subscribtion</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            You sure want to cancel your Subscribtion?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => handleCloseDialogCancel(packagesTable._id)}>Cancel</Button>
                                        <Button onClick={() => {
                                            handleCancel();
                                            return handleCloseDialogCancel(packagesTable._id);
                                        }}>confirm</Button>
                                    </DialogActions>
                                </Dialog>

                            </div>



                        ))}
                    </Stack>
                </Paper>
            </div>
        </div>
    );
}
