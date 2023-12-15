
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
import PlaceHolder from "../PlaceHolder";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

export default function FollowupPage(){
    const [followUp, setFollowUp] = useState([]);


    useEffect(() => {
      check(), loadRequests()
    }, []);

    async function loadRequests() {
      await axios.get("http://localhost:3000/doctor/upcomingAppointments",{withCredentials:true}).then((res)=>{
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

    return(
      result && <>
        <div>
            <Navbar goHome={goHome} goPatients={goPatients} goTimeSlots={goTimeSlots} editDoctorInfo={editDoctorInfo} goAppointments={allAppointments} goFollowUp={toFollowUp}/>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
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
            <Card sx={{ display: 'flex', width: '80vw', height: '80vh' }}>    
              <CardContent sx={{ width: '100%', overflowY: 'auto' }}>
                <div  style={{position: 'sticky', backgroundColor:"white",height:60,top: 0, zIndex: 1}} >
                <Typography sx={{ fontSize: 24 }} gutterBottom>
                  Your Folllow requests
                </Typography>
                </div>
                <Grid container sx={{ display: 'flex', marginTop: 2 }} justifyContent="center" alignItems="center" columnSpacing={3} rowSpacing={3}>
                  {appointments.length === 0 && !appLoading && (
                    <PlaceHolder message="No appointments" description="You have no appointments" width="390" height="320" />
                  )}
                  
                  {followUp.length != 0 && 
                      followUp.map(follow => {
                        return(
                        <Grid item>
                          <FollowUpCard id={follow._id} name={follow.patientID.name} date={follow.date.split("T")[0]} accept={acceptRequest} reject={rejectRequest} />
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
              
            </Card>
        </div>
      </>
    )

}