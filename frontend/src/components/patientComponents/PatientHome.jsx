import React from 'react';
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import Navbar from './Navbar'
import { set } from 'mongoose';
import FamilyMemberCard from './FamilyMemeberCard';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
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

    const [breadcrumbs, setBreadcrumbs] = useState([{}]);
    async function check() {

        const res = await axios.get("http://localhost:3000/loggedIn", {
            withCredentials: true
        }).then((res) => {

            if (res.data.type != "patient") {

                window.location.href = "/"
            }
            else {
                setResult(true)
                const homeBreadcrumb = { label: "home", href: "/patient/home" };
                const hasHomeBreadcrumb = breadcrumbs.some(
                  (item) => item.label == homeBreadcrumb.label
                );
                // If not, add it to the breadcrumbs
                if (!hasHomeBreadcrumb) {
                  const updatedBreadcrumbs = [homeBreadcrumb];
                  setBreadcrumbs(updatedBreadcrumbs);
                  localStorage.setItem('breadcrumbs', JSON.stringify(updatedBreadcrumbs));
                }
            }
        }
        ).catch((err) => {
            if (err.response.status == 401) {
                window.location.href = "/"
            }
        })
    }

    function handleBreadcrumbClick(event, breadcrumb) {
        event.preventDefault();
        // Find the index of the clicked breadcrumb in the array
        const index = breadcrumbs.findIndex((item) => item.label == breadcrumb.label);
        let updatedBreadcrumbs;
        if(index == -1){
          updatedBreadcrumbs = ([...breadcrumbs, breadcrumb]);
        }else{
        // Slice the array up to the clicked breadcrumb (inclusive)
          updatedBreadcrumbs = breadcrumbs.slice(0, index + 1);
        }
        console.log(index);
        // Set the updated breadcrumbs
        setBreadcrumbs(updatedBreadcrumbs);
    
        // Save updated breadcrumbs to localStorage
        localStorage.setItem('breadcrumbs', JSON.stringify(updatedBreadcrumbs));
    
        // Navigate to the new page
        window.location.href = breadcrumb.href;
      }
      <Navbar goHome={goHome} goFiles={goFiles} handlePrescriptions={handlePrescriptions}handleAppointments={handleAppointments}  handleManageFamily={handleManageFamily} viewAllDoctors={viewAllDoctors} toChats={toChats} />
      function goHome() {
        const breadcrumb = { label: "Home", href: "/patient/home" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      
      function handlePrescriptions() {
          //window.location.href = "/patient/Prescriptions"
          const breadcrumb = { label: "prescriptions", href: "/patient/Prescriptions" };
          handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      function handleAppointments() {
          //window.location.href = "/patient/Appointments"
          const breadcrumb = { label: "Appointments", href: "/patient/Appointments" };
          handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      function handleFamilyMembers() {
          //window.location.href = "/patient/LinkFamily"
          const breadcrumb = { label: "LinkFamily", href: "/patient/LinkFamily" };
          handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      function handleManageFamily() {
          //window.location.href = "/patient/readFamilyMembers"
          const breadcrumb = { label: "FamilyMembers", href: "/patient/readFamilyMembers" };
          handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      function viewAllDoctors() {
        const breadcrumb = { label: "allDoctors", href: "/patient/search" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      function toChats(){
        const breadcrumb = { label: "chats", href: "/chats" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      function goFiles(){
        const breadcrumb = { label: "files", href: "/patient/files" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
      const handleSearch = (values) => {
        if(values != "" && values != null){
        const breadcrumb = { label: "allDoctors", href: `/patient/search/${values}` };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
      }
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
            console.log(app)
            app = app.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA - dateB;
            });
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
                <Navbar openHelp={toggleFilter} goHome={goHome} handleSearch={handleSearch} goFiles={goFiles} handlePrescriptions={handlePrescriptions} handleAppointments={handleAppointments} handleFamilyMembers={handleFamilyMembers} handleManageFamily={handleManageFamily} viewAllDoctors={viewAllDoctors} toChats={toChats} />
                <div>
                    <Breadcrumbs sx={{padding:'15px 0px 0px 15px'}} separator="›" aria-label="breadcrumb">
                    {breadcrumbs.map((breadcrumb, index) => (
                    <Link
                        key={index}
                        underline="hover"
                        color="inherit"
                        href={breadcrumb.href}
                        onClick={(event) => handleBreadcrumbClick(event, breadcrumb)}
                    >
                        {breadcrumb.label}
                    </Link>
                    ))}
                </Breadcrumbs>
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
                                    would you like to reserve an <Button variant="text" size="small" sx={{ font: "bold", fontSize: "18px" }} onClick={viewAllDoctors}>appointment</Button>?
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
