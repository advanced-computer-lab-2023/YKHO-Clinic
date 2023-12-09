import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import {useEffect} from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Navbar from './Navbar'
import AppointmentCard from './AppointmentCard'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material'
import FollowUpCard from './FollowUpCard'
import Button from '@mui/material/Button';
import LoadingComponent from '../LoadingComponent';
import { motion, AnimatePresence } from 'framer-motion';
function DoctorHome(props) {
    const [result,setResult]=useState(false);
    const [appointments,setAppointments]=useState([]);
    const [requests,setRequests]=useState([]);
    const [appLoading,setAppLoading]=useState(true);
    useEffect(()=>{check(),loadAppointments(),loadRequests()},[]);
    async function check(){
        await axios.get("http://localhost:3000/doctor/contract",{
        withCredentials:true
    }).then((res)=>{
        if(res.data.contract=="rej"){
            window.location.href="/doctor/contract"
        }
        else{
          setResult(true)
        }
    }).catch((err)=>{
        console.log(err);
    })
        const res= await axios.get("http://localhost:3000/loggedIn",{
            withCredentials:true
        }).then((res)=>{
            
            if(res.data.type!="doctor" ){
                if(res.data.type=="patient"){
                    window.location.href="/patient/home"
                }
                else if(res.data.type=="admin"){
                    window.location.href="/admin/home"
                }
                else{
                 window.location.href="/"
                }
             }
         }
         ).catch((err)=>{
            if(err.response.status==401){
                window.location.href="/"
            }
         })
    }
    async function loadAppointments(){
        await axios.get("http://localhost:3000/doctor/Appointments",{withCredentials:true}).then((res)=>{
            var app=res.data.result;
            app=app.slice(0,4);
            setAppointments(app);
        }).catch((err)=>{
            console.log(err);
        }).finally(()=>{
            setAppLoading(false)})
    }
    async function loadRequests(){
        // get the follow up requests
    }
    return (
        <div>
            {result && <div>
                <Navbar/>
                
                <Typography variant="h4" sx={{font:"bold",marginTop:"3%",marginLeft:"3%" }}  gutterBottom>
                    Welcome Doctor {props.name}
                </Typography>
                <div style={{display:"flex",justifyContent:"center",marginTop:"5%"}}>
                    <div style={{width:"60%",marginRight:30}}>
                        <Card sx={{height:"100%"}}>
                            <CardContent >
                                <Typography sx={{ fontSize: 20 }}  gutterBottom>
                                Upcoming appointments
                                </Typography>
                            
                                <Grid container sx={{display:"flex",marginTop:2}} justifyContent="center" alignItems="center" columnSpacing={20} rowSpacing={3}>
                                  
                                    {appLoading&&(<>
                                        <Grid item >
                                        <LoadingComponent width="275" height="150"/>
                                        </Grid>
                                        <Grid item>
                                        <LoadingComponent width="275" height="150"/>
                                        </Grid>
                                        <Grid item>
                                        <LoadingComponent width="275" height="150"/>
                                        </Grid>
                                        <Grid item>
                                        <LoadingComponent width="275" height="150"/> 
                                        </Grid>
                                        </>
                                        )}
                                    <AnimatePresence>
                                        {!appLoading &&
                                            appointments.map((app, index) => (
                                            <Grid item key={index}>
                                                <motion.div
                                                initial={{ opacity: 0, y: -50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: index * 0.2 }} // Adjust the delay for staggered effect
                                                >
                                                <AppointmentCard name={app.patientID.name} date={app.date.split('T')[0]}  />
                                                </motion.div>
                                            </Grid>
                                            ))}
                                    </AnimatePresence>
                                                          
                                </Grid>
                             
                            </CardContent>
                            <CardActions >
                            <Button variant="text">Show more appointments</Button>
                            </CardActions>
                        </Card>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"space-between",width:"20%"}}>
                        <div >
                            <Card>
                                <CardContent>
                                    <Typography sx={{ fontSize: 20 }}  gutterBottom>
                                    Your wallet
                                    </Typography>
                                    <Typography sx={{ fontSize: 18 }}  gutterBottom>
                                    1000 EGP
                                    </Typography>
                                </CardContent>
                            </Card>
                        </div>
                        <div  >
                            <Card >
                                <CardContent>
                                <Typography sx={{ fontSize: 20 }}  gutterBottom>
                                    Recent followup Requests
                                </Typography>
                                <Grid container sx={{display:"flex",marginTop:2}} justifyContent="center" alignItems="center" rowSpacing={1} >
                                    <Grid item >
                                    <FollowUpCard name="ahmed" date="12/12/2021"/>
                                    </Grid>
                                    <Grid item>
                                    <FollowUpCard name="ahmed" date="12/12/2021"/>
                                    </Grid>
                                </Grid>    
                                </CardContent>
                                <CardActions>
                                <Button variant="text">Show more follow ups</Button>
                                </CardActions>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
}

export default DoctorHome;