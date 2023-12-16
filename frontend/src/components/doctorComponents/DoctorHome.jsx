import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Navbar from "./Navbar";
import AppointmentCard from "./AppointmentCard";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import FollowUpCard from "./FollowUpCard";
import Button from "@mui/material/Button";
import LoadingComponent from "../LoadingComponent";
import { motion, AnimatePresence } from "framer-motion";
import PlaceHolder from "../PlaceHolder";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

function DoctorHome() {
  const [result, setResult] = useState(false);
  const [appointments, setAppointments] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [requests, setRequests] = useState([]);
  const [appLoading, setAppLoading] = useState(true);
  const [name, setName] = useState("");
  const [wallet, setWallet] = useState(0);
  const [followUp, setFollowUp] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [id, setId] = useState("");
  const [type, setType] = useState("");
  useEffect(() => {
    check(), loadAppointments(), loadRequests(), getName(), getWallet();
  }, []);

  const [breadcrumbs, setBreadcrumbs] = useState([{}]);
  async function check() {
    await axios
      .get("http://localhost:3000/doctor/contract", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.contract == "rej") {
          window.location.href = "/doctor/contract";
        } else {
          setResult(true);
          // Check if breadcrumbs contain the "Home" breadcrumb
          const homeBreadcrumb = { label: "Home", href: "/doctor/home" };
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
      })
      .catch((err) => {
        console.log(err);
      });
    await axios
      .get("http://localhost:3000/loggedIn", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.type != "doctor") {
          if (res.data.type == "patient") {
            window.location.href = "/patient/home";
          } else if (res.data.type == "admin") {
            window.location.href = "/admin/home";
          } else {
            window.location.href = "/";
          }
        }
      })
      .catch((err) => {
        if (err.response.status == 401) {
          window.location.href = "/";
        }
      });
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

  async function loadAppointments() {
    await axios
      .get("http://localhost:3000/doctor/upcomingAppointments", {
        withCredentials: true,
      })
      .then((res) => {
        var app = res.data.result;
        app = app.slice(0, 4);
        setAppointments(app);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setAppLoading(false);
      });
  }
  async function loadRequests() {
    await axios.get("http://localhost:3000/doctor/showRequests",{withCredentials:true}).then((res)=>{
      const temp = res.data.result.slice(0,2);
      console.log(temp)
      setFollowUp(temp);
    }).catch((err)=>{
      console.log(err);
    })
  }
  async function acceptRequest(id) {
    await axios
      .post("http://localhost:3000/doctor/acceptFollowUp",
      {
        id:id
      }
      ,
      {
        withCredentials: true,
      })
      .then((res) => {
        const temp = res.data.result.slice(0,2);
        setFollowUp(temp)
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function rejectRequest(id) {
    await axios
      .post("http://localhost:3000/doctor/rejectFollowUp",
      {
        id:id
      }
      ,
      {
        withCredentials: true,
      })
      .then((res) => {
        const temp = res.data.result.slice(0,2);
        setFollowUp(temp)
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function getName() {
    await axios
      .get("http://localhost:3000/doctor/name", { withCredentials: true })
      .then((res) => {
        setName(res.data.name);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function getWallet() {
    await axios
      .get("http://localhost:3000/doctor/Wallet", { withCredentials: true })
      .then((res) => {
        setWallet(Math.floor(res.data.Wallett));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function allAppointments() {
    const breadcrumb = { label: "appointments", href: "/doctor/appointments" };
    handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
  }

  function toFollowUp() {
    const breadcrumb = { label: "followUp", href: "/doctor/followup" };
    handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
  }

  function goHome(){
    const breadcrumb = { label: "home", href: "/doctor/home" };
    handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
  }

  function goPatients(){
    const breadcrumb = { label: "patients", href: "/doctor/patients" };
    handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
  }
  
  function goTimeSlots(){
    const breadcrumb = { label: "timeSlots", href: "/doctor/timeslots"};
    handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
  }
  
  function editDoctorInfo(){
    const breadcrumb = { label: "editInfo", href: "/doctor/edit" };
    handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
  }

  function toChats(){
    const breadcrumb = { label: "chats", href: "/chats" };
    handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
  }

  async function confirm(id, type) {
    setId(id);
    setConfirmOpen(true);
    setType(type);
  }
  async function confirmAction() {
    if (type == "accept") {
      await acceptRequest(id);
    } else {
      await rejectRequest(id);
    }
    setConfirmOpen(false);
}
  return (
    <div>
      {result && (
        <div>
          <Navbar goHome={goHome} toChats={toChats} goPatients={goPatients} goTimeSlots={goTimeSlots} editDoctorInfo={editDoctorInfo} goAppointments={allAppointments} goFollowUp={toFollowUp}/>
          <Dialog
            open={confirmOpen}
            keepMounted
            onClose={()=>{setConfirmOpen(false);}}
            aria-describedby="alert-dialog-slide-description"
            maxWidth="lg"
            sx={{width:"100%"}}
            >
                <DialogTitle>
                    <Typography> Are you sure </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography>This action cannot be undone</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{setConfirmOpen(false);}} >No</Button>
                    <Button onClick={confirmAction}>Yes</Button>
                </DialogActions>
            </Dialog>
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
          <Typography
            variant="h4"
            sx={{ font: "bold", marginTop: "3%", marginLeft: "3%" }}
            gutterBottom
          >
            Welcome Doctor {name}
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "5%",
            }}
          >
            <div style={{ minHeight: "320", width: "60%", marginRight: 30 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ height: "85%" }}>
                  <Typography sx={{ fontSize: 20 }} gutterBottom>
                    Upcoming appointments
                  </Typography>

                  <Grid
                    container
                    sx={{ display: "flex", marginTop: 2 }}
                    justifyContent="center"
                    alignItems="center"
                    columnSpacing={20}
                    rowSpacing={3}
                  >
                    {appLoading && (
                      <>
                        <Grid item>
                          <LoadingComponent width="270" height="140" />
                        </Grid>
                        <Grid item>
                          <LoadingComponent width="270" height="140" />
                        </Grid>
                        <Grid item>
                          <LoadingComponent width="270" height="140" />
                        </Grid>
                        <Grid item>
                          <LoadingComponent width="270" height="140" />
                        </Grid>
                      </>
                    )}
                    <AnimatePresence>
                      {!appLoading &&
                        appointments.length != 0 &&
                        appointments.map((app, index) => (
                          <Grid item key={index}>
                            <motion.div
                              initial={{ opacity: 0, y: -50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.2 }} // Adjust the delay for staggered effect
                            >
                            <AppointmentCard name={app.patientID.name} date={app.date.split('T')[0]} time={(app.date.split('T')[1]).split('.')[0]} isFull={false} />

                            </motion.div>
                          </Grid>
                        ))}
                    </AnimatePresence>
                    {appointments.length == 0 && !appLoading && (
                      <PlaceHolder
                        message="No upcoming appointments"
                        description="You have no upcoming appointments"
                        width="390"
                        height="320"
                      />
                    )}
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button onClick={allAppointments} variant="text">
                    Show all appointments
                  </Button>
                </CardActions>
              </Card>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "20%",
              }}
            >
              <div style={{ marginBottom: 30 }}>
                <Card>
                  <CardContent>
                    <Typography sx={{ fontSize: 20 }} gutterBottom>
                      Your wallet
                    </Typography>
                    <Typography sx={{ fontSize: 18 }} gutterBottom>
                      {wallet} EGP
                    </Typography>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardContent>
                    <Typography sx={{ fontSize: 20 }} gutterBottom>
                      Recent followup Requests
                    </Typography>
                    <Grid
                      container
                      sx={{ display: "flex", marginTop: 2 }}
                      justifyContent="center"
                      alignItems="center"
                      rowSpacing={1}
                    >
                      {followUp.length != 0 && 
                      followUp.map(follow => {
                        return(
                        <Grid item>
                                    <FollowUpCard id={follow._id} name={follow.patientID.name} date={follow.date.split("T")[0]} time={follow.date.split("T")[1].split(":")[0]+":"+follow.date.split("T")[1].split(":")[1]} accept={confirm} reject={confirm} />
                        </Grid>
                        );
                      })
                      }
                      {
                        followUp.length == 0 &&
                        <PlaceHolder
                        message="No follow up requests"
                        description="You have no follow up requests"
                        width="250"
                        height="190"
                        />
                      }
                    </Grid>
                  </CardContent>
                  <CardActions>
                    <Button onClick={toFollowUp} variant="text">Show more follow ups</Button>
                  </CardActions>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorHome;
