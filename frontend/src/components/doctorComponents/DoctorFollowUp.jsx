
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Navbar from "./Navbar";
import AppointmentCard from "./AppointmentCard";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { DialogTitle, Grid } from "@mui/material";
import FollowUpCard from "./FollowUpCard";
import Button from "@mui/material/Button";
import LoadingComponent from "../LoadingComponent";
import { motion, AnimatePresence } from "framer-motion";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import PlaceHolder from "../PlaceHolder";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

export default function DoctorFollowUp(){
    const [followUp, setFollowUp] = useState([]);
    const [result, setResult] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [id, setId] = useState("");
    const [type, setType] = useState("");
    useEffect(() => {
      check();  loadRequests();
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
            let savedBreadcrumbs = JSON.parse(localStorage.getItem('breadcrumbs'));
            setBreadcrumbs(savedBreadcrumbs);
  
            const homeBreadcrumb = { label: "followUp", href: "/doctor/followup" };
            const hasHomeBreadcrumb = savedBreadcrumbs.some(
              (item) => item.label == homeBreadcrumb.label
            );
            console.log(hasHomeBreadcrumb)
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
    
        console.log(updatedBreadcrumbs)
        // Navigate to the new page
        window.location.href = breadcrumb.href;
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

    async function loadRequests() {
      await axios.get("http://localhost:3000/doctor/showRequests",{withCredentials:true}).then((res)=>{
        setFollowUp(res.data.result);
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
            setFollowUp(res.data.result);
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
            setFollowUp(res.data.result);
          })
          .catch((err) => {
            console.log(err);
          });
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
      
    return(
      result && <>
        <div>
        <Navbar goHome={goHome} toChats={toChats} goPatients={goPatients} goTimeSlots={goTimeSlots} editDoctorInfo={editDoctorInfo} goAppointments={allAppointments} goFollowUp={toFollowUp}/>
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
            <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
            <Card sx={{ display: 'flex', width: '80vw', height: '80vh',marginTop:6}}>    
              <CardContent sx={{ width: '100%', overflowY: 'auto' }}>
                <div  style={{position: 'sticky', backgroundColor:"white",height:60,top: 0, zIndex: 1}} >
                <Typography sx={{ fontSize: 24 }} gutterBottom>
                  Your Follow up requests
                </Typography>
                </div>
                <Grid container sx={{ display: 'flex', marginTop: 2 }} justifyContent="center" alignItems="center" columnSpacing={3} rowSpacing={3}>
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
                        width="300"
                        height="190"
                        />
                      }
                  
                </Grid>
              </CardContent>
              
            </Card>
            </div>
        </div>
      </>
    )

}