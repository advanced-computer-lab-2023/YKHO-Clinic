import React from 'react';
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import Navbar from './Navbar'
import { set } from 'mongoose';
import FamilyMemberCard from './FamilyMemeberCard';

import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton, Paper, Button, Typography, Grid } from '@mui/material'



const PatientHome = () => {
    
    const [result, setResult] = useState(false);
    const [user, setUser] = useState({});
    const [plan, setPlan] = useState("");
    const [familyMembers, setFamilyMembers] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [wallet, setWallet] = useState(0);
    const [prescriptions, setPrescriptions] = useState([]);
    const [appLoadingFamily, setAppLoadingFamily] = useState(true);
    const [appLoadingAppointment, setAppLoadingAppointment] = useState(true);
    const [appLoadingPrescription, setAppLoadingPrescription] = useState(true);
    useEffect(() => { check(), loadUser(), loadPlan(), loadFamilyMembers(), loadAppointments(), loadWallet(), loadPrescriptions() }, []);
    async function check() {

        const res = await axios.get("http://localhost:3000/loggedIn", {
            withCredentials: true
        }).then((res) => {

            if (res.data.type != "patient") {

                window.location.href = "/"
            }
            else {
                setResult(true)
            }
        }
        ).catch((err) => {
            if (err.response.status == 401) {
                window.location.href = "/"
            }
        })
    }
    async function loadUser() {
        await axios.get("http://localhost:3000/patient/home", { withCredentials: true }).then((res) => {
            setUser(res.data.result);
        }
        ).catch((err) => {
            console.log(err);
        });
    }
    async function loadPlan() {
        await axios.get("http://localhost:3000/patient/plan", { withCredentials: true }).then((res) => {
            setPlan(res.data.result);
        }
        ).catch((err) => {
            console.log(err);
        });
    }
    async function loadFamilyMembers() {
        await axios.get("http://localhost:3000/patient/familyMembersPlans", { withCredentials: true }).then((res) => {
            var app = res.data.result
            app = app.slice(0, 4);
            setFamilyMembers(app);
        }
        ).catch((err) => {
            console.log(err);
        }).finally(() => {
            setAppLoadingFamily(false)
        });
    }
    async function loadAppointments() {
        await axios.get("http://localhost:3000/patient/appointmentsCards", { withCredentials: true }).then((res) => {
            var app = res.data.result
            app = app.slice(0, 4);
            setAppointments(app);
        }
        ).catch((err) => {
            console.log(err);
        }).finally(() => {
            setAppLoadingAppointment(false)
        }
        );
    }
    async function loadWallet() {
        await axios.get("http://localhost:3000/patient/Wallet", { withCredentials: true }).then((res) => {
            setWallet(res.data.result);
        }
        ).catch((err) => {
            console.log(err);
        });
    }
    async function loadPrescriptions() {
        await axios.get("http://localhost:3000/patient/Prescriptions", { withCredentials: true }).then((res) => {
            var app = res.data.result
            app = app.slice(0, 2);
            setPrescriptions(app);
        }
        ).catch((err) => {
            console.log(err);
        }).finally(() => {
            setAppLoadingPrescription(false)
        });
    }
    const [isOpen, setIsOpen] = useState(false);
    function toggleFilter() {
        setIsOpen(!isOpen);
      }
    function goHome() {
      const breadcrumb = { label: "Home", href: "/patient/home" };
      handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
    }
    
    function handlePrescriptions() {
        window.location.href = "/patient/Prescriptions"
    }
    function handleHealthRecords() {
        window.location.href = "/patient/HealthRecords"
    }
    function handleAppointments() {
        window.location.href = "/patient/Appointments"
    }
    function handleHistory() {
        window.location.href = "/patient/medicalHistory"
    }
    function handleLinkFamily() {
        window.location.href = "/patient/LinkFamily"
    }
    function handleManageFamily() {
        window.location.href = "/patient/readFamilyMembers"
    }
    async function handleLogout() {
        await axios.get("http://localhost:3000/logout", { withCredentials: true }).then((res) => {
            window.location.href = "/"
        }).catch((err) => {
            console.log(err);
        })
    }
    const itemVariants = {
        hidden: { y: -50, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    };
    const AnimatedComponent = ({ familyMembers }) => {
        useEffect(() => {
            // Trigger animation when familyMembers are loaded
            // This ensures animation triggers when data is loaded or updated
        }, [familyMembers]);
    }
    return (
        <div>
            {result && <div>
                <Navbar openHelp={toggleFilter} />
                <div style={{}}>
                
                <div style={{ width: "96.5%", marginTop: "5%", marginLeft: "2%" }}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={6}>
                            <Paper variant="elevation" elevation={4} sx={{ height: "231px" }}>
                                <Typography variant="h4" sx={{ font: "bold", marginLeft: "3%", paddingTop: "3%" }} gutterBottom>
                                    Good Morning, {user.name}
                                </Typography>
                                {plan !== "none" && (
                                    <Typography variant="h5" sx={{ font: "bold", marginLeft: "3.5%" }} gutterBottom>
                                        You are subscribed to <Button variant="text" size="small" sx={{ font: "bold", fontSize: "18px" }}>{plan}</Button>
                                    </Typography>
                                )}
                                {plan == "none" && <Typography variant="h4" sx={{ font: "bold", marginTop: "3%", marginLeft: "3%" }} gutterBottom>
                                    You are not subscribed to any plan
                                </Typography>}
                                <Typography variant="h5" sx={{ font: "bold", marginTop: "3%", marginLeft: "3%", paddingBottom: "4.4%" }} gutterBottom>
                                    would you like to reserve an <Button variant="text" size="small" sx={{ font: "bold", fontSize: "18px" }}>appointment</Button>?
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} >
                            <Paper variant="elevation" elevation={4}>
                                <Typography variant="h4" sx={{ font: "bold", marginLeft: "3%", paddingTop: "3%" }} gutterBottom>
                                    Family Members<Button variant="outlined" sx={{ marginLeft: "55%" }} onClick={handleManageFamily}>View All</Button>
                                </Typography>
                                <AnimatePresence>
                                    <div style={{ marginLeft: "3%", paddingRight: "30%", paddingBottom: "1%" }}>
                                        {appLoadingFamily ? <div>
                                            <Skeleton animation="wave" width={800} height={35} />
                                            <Skeleton animation="wave" width={800} height={35} />
                                            <Skeleton animation="wave" width={800} height={35} />
                                            <Skeleton animation="wave" width={800} height={35} />
                                        </div> : familyMembers.length > 0 && familyMembers.map((familyMember, index) => (
                                            <motion.div key={familyMember.name}
                                                initial={{ opacity: 0, y: -50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: index * 0.2 }} // Adjust the delay for staggered effect
                                            >
                                                <FamilyMemberCard name={familyMember.name} relation={familyMember.relation} healthPackage={familyMember.healthPackage} />
                                            </motion.div>
                                        ))}

                                    </div>
                                </AnimatePresence>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper variant='elevation' elevation={5} sx={{ height: "396px" }}>
                                <Typography variant="h4" sx={{ font: "bold", marginLeft: "3%", paddingTop: "3%" }} gutterBottom>
                                    Upcoming Appointments <Button variant="outlined" sx={{ marginLeft: "40%" }} onClick={handleAppointments}>View All</Button>
                                </Typography>
                                <AnimatePresence>
                                    <div style={{ paddingBottom: "20px" }}>
                                        {appLoadingAppointment ?
                                            <div style={{ marginLeft: "5px" }}>
                                                <Skeleton animation="wave" width={900} height={70} />
                                                <Skeleton animation="wave" width={900} height={70} />
                                                <Skeleton animation="wave" width={900} height={70} />
                                                <Skeleton animation="wave" width={900} height={70} />
                                            </div>
                                            : appointments.length > 0 && appointments.map((appointment, index) => (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -50 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5, delay: index * 0.2 }} // Adjust the delay for staggered effect
                                                >
                                                    <Paper variant='elevation' elevation={3} sx={{ marginLeft: "1.5%", width: "890px", height: "70px", marginTop: "5px" }}>
                                                        <Typography sx={{ fontSize: "25px", whiteSpace: "nowrap", marginLeft: "1.5%", paddingTop: "1.6%" }} gutterBottom>
                                                            you have an appointment with Dr.{appointment.doctorID.name} on this date {appointment.date.split('T')[0]} at {appointment.date.split('T')[1].split('.')[0]}
                                                        </Typography>
                                                    </Paper>
                                                </motion.div>
                                            ))}
                                    </div>
                                </AnimatePresence>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item xs={12}>
                                    <Paper variant="elevation" elevation={4} sx={{ height: "100px" }}>
                                        <Typography variant="h4" sx={{ font: "bold", marginLeft: "3%", paddingTop: "3%" }} gutterBottom>Your Wallet: {wallet} EGP</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper variant="elevation" elevation={4} sx={{ height: "280px" }}>
                                        <Typography variant="h4" sx={{ font: "bold", marginLeft: "3%", paddingTop: "3%" }} gutterBottom>Prescriptions
                                            <Button variant="outlined" sx={{ marginLeft: "60%" }} onClick={() => { handlePrescriptions(); }}>View All</Button></Typography>
                                        <AnimatePresence>
                                            {appLoadingPrescription ? <div style={{ marginLeft: "5px" }}>
                                                <Skeleton animation="wave" width={890} height={70} />
                                                <Skeleton animation="wave" width={890} height={70} />
                                            </div> : prescriptions.length > 0 && prescriptions.map((prescription, index) => (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -50 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5, delay: index * 0.2 }} // Adjust the delay for staggered effect
                                                >
                                                    <Paper variant='elevation' elevation={3} sx={{ marginLeft: "1.5%", width: "890px", height: "70px", marginTop: "5px" }}>
                                                        <Typography sx={{ fontSize: "25px", whiteSpace: "nowrap", marginLeft: "1.5%", paddingTop: "1.6%" }} gutterBottom>
                                                            you have a prescription from Dr.{prescription.doctorName}
                                                        </Typography>
                                                    </Paper>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                </div>
            </div>}
        </div>
    );
};

export default PatientHome;
