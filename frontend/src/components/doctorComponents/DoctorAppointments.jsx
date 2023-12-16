import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LoadingComponent from '../LoadingComponent';
import PlaceHolder from '../PlaceHolder';
import Navbar from './Navbar';
import AppointmentCard from './AppointmentCard';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
let status = '';
let date = undefined;
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';


// socket
import io from 'socket.io-client';
const socket = io.connect("http://localhost:3000");

const init = async () => {
  await axios.get("http://localhost:3000/rooms", {
    withCredentials: true
  }).then((res) =>{
    let rooms = res.data;
    for(let i = 0; i < rooms.length; i++){
      joinRoom(rooms[i])
    }
  })
}

const joinRoom = (room) => {
  socket.emit("join_room", room)
}


function DoctorAppointments() {
  // socket
  useEffect(() => {init()}, [])


  const [searchvalue, setSearchValue] = useState('upcoming');
  const [result, setResult] = useState(false);
  useEffect(() => {
    check();
    searchAppointments();
  }, []);

  const [appointments, setAppointments] = useState([]);
  const [appLoading, setAppLoading] = useState(true);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [times, setTimes] = useState([]);
  const [time, setTime] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [isScheduleFollowUp, setIsScheduleFollowUp] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [appointmentId2, setAppointmentId2] = useState('');

  

  useEffect(() => {
    // Trigger the searchAppointments function when searchValue changes
    searchAppointments();
  }, [searchvalue]);
  const changeTimeValue = (event) => {
    setTime(event.target.value);
    setIsButtonDisabled(false);
  };

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

          const homeBreadcrumb = { label: "appointments", href: "/doctor/appointments" };
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
    
  async function cancel(e) {
    setIsOpen2(true);
    console.log(e);
    setAppointmentId2(e);
  }
  async function cancelAppointment() {
    

    setRescheduleLoading(true);
    await axios.post('http://localhost:3000/doctor/cancelAppointment', { id: appointmentId2 }, { withCredentials: true }).then(() => {
      socket.emit("update", appointmentId2);
      window.location.href = '/doctor/appointments';
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setRescheduleLoading(false);
      setIsOpen2(false);
    });

  }

  function changeRadioValue(event) {
    status = event.target.value;
    setAppLoading(true);
    searchAppointments();
  }

  function changeDateValue(value) {
    date = value;
    setAppLoading(true);
    searchAppointments();
  }

   function changeSearchValue(event) {

    setSearchValue(event.target.value);
      setAppLoading(true);

  }

  async function searchAppointments() {

    await axios
      .get(`http://localhost:3000/doctor/AppointmentsFilter/?date=${date}&searchvalue=${searchvalue}&filters=${status}`, {
        withCredentials: true,
      })
      .then((res) => {
        setAppointments(res.data.result);
        setAppLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function SchedFollow(e) {
    setIsScheduleFollowUp(true);
    setAppointmentId(e);
    setOpen(true);
  }

  const [isOpen, setIsOpen] = useState(false);
  const [appointmentId, setAppointmentId] = useState('');
 
  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  let loadingComponents = [];
  for (let i = 0; i < 12; i++) {
    loadingComponents.push(
      <Grid item>
        <LoadingComponent width="300" height="150" />
      </Grid>
    );
  }
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = (e) => {
      setAppointmentId(e);
      setIsScheduleFollowUp(false);
      setOpen(true);
    };
  
    const handleClose = () => {
      if(!rescheduleLoading){
        setTime('');
        setTimes([]);
        setRescheduleDate(null);
        setOpen(false);
        setIsButtonDisabled(true); 
        setIsOpen2(false);
      }  
    };
    const reschedule = async () => {
      setIsButtonDisabled(true);
      setRescheduleLoading(true);
      if(isScheduleFollowUp){
        await axios.post('http://localhost:3000/doctor/reserve', { appointmentId: appointmentId , date: rescheduleDate, time: time }, { withCredentials: true }).then(() => {
          window.location.href = '/doctor/appointments';
        }).catch((err) => {
          console.log(err);
        }).finally(() => {
          setRescheduleDate(null);
          setTime('');
          setTimes([]);
          setOpen(false);
          setRescheduleLoading(false);
        });
      }
      else{
        await axios.post('http://localhost:3000/rescheduleAppointment', { appointmentId: appointmentId , date: rescheduleDate, time: time }, { withCredentials: true }).then(() => {
          socket.emit("update", appointmentId);
          window.location.href = '/doctor/appointments';
        }).catch((err) => {
          console.log(err);
        }).finally(() => {
          setRescheduleDate(null);
          setTime('');
          setTimes([]);
          setOpen(false);
          setRescheduleLoading(false);
        });


      }
    }
    const today = dayjs();
    const nextDate = today.add(1, 'day');
    const setDate = async (e) => {
      
      setRescheduleDate(e);
      await axios.get(`http://localhost:3000/doctor/schedFollowUp/${e}`, { withCredentials: true }).then((res) => {
        setTimes([]);
        for (let i = 0; i < res.data.result.length; i++) {
          setTimes((prev) => [...prev, res.data.result[i].from + '-' + res.data.result[i].to]);
        }

      });


    }

  return (
    <div>
      {result && (
        <div>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{!isScheduleFollowUp&&"Reshedule this appointment?"}{isScheduleFollowUp &&"Schedule a followup?"}</DialogTitle>
        <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs} sx={{marginTop:5}}>
                    <DatePicker id="searchDate"  minDate={nextDate}  value={rescheduleDate} onChange={setDate}  />
        </LocalizationProvider>
        <Box sx={{ minWidth: 120 }}>
        
      <FormControl sx={{width:313,marginTop:5}} >
        <InputLabel id="TimeSelector">{times.length==0&&"no appointment with this date"}{times.length>0&&"Select a time"}</InputLabel>
        <Select
          labelId="TimeSelector"
          id="demo-simple-select"
          label="Time"
          value={time}
          onChange={changeTimeValue}
          disabled={times.length==0}
        >
          {
          times.map((time,index)=>{return <MenuItem key={index} value={time}>{time}</MenuItem>}
          )
        }
        </Select>
        
      </FormControl>
        </Box>
        </DialogContent>
        <DialogActions>
        {rescheduleLoading&&<Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>}
          <Button onClick={reschedule} disabled={isButtonDisabled}>{isScheduleFollowUp&&"Schedule follow up"}{!isScheduleFollowUp&&"reschedule"}</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isOpen2}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Are you sure you want to cancel this appointment?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        {rescheduleLoading&&<Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>}
          <Button disabled={rescheduleLoading} onClick={handleClose} >No</Button>
          <Button disabled={rescheduleLoading} onClick={cancelAppointment} color="error">Yes</Button>
        </DialogActions>
      </Dialog>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '3%' }}>
            <Card sx={{ display: 'flex', width: '80vw', height: '80vh' }}>
              {/* Filter Box */}
              <Box bgcolor="primary.main" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <motion.div
                  initial={{ width: isOpen ? '270px' : '70px' }}
                  animate={{ width: isOpen ? '270px' : '70px' }}
                  transition={{ duration: 0.3 }}
                  style={{ backgroundColor: 'secondary', overflow: 'hidden' }}
                >
                  <div style={{ marginLeft: 8 }}>
                    <IconButton onClick={toggleFilter}>
                      <FilterAltIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                    <FormControl>
                      
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue=""
                        name="radio-buttons-group"
                        onChange={changeRadioValue}
                      >
                        {isOpen && (
                          <>
                            <FormControlLabel
                              value="upcoming"
                              control={<Radio color="default" />}
                              label="Upcoming Appointments"
                            />
                            <FormControlLabel value="past" control={<Radio color="default" />} label="Past Appointments" />
                            <FormControlLabel value="" control={<Radio color="default" />} label="All Appointments" />
                          </>
                        )}
                      </RadioGroup>
                    </FormControl>
                  </div>
                </motion.div>
              </Box>

              {/* Main Content */}
              <CardContent sx={{ width: '100%', overflowY: 'auto' }}>
                

                {/* Sticky Search Box */}
                <div  style={{position: 'sticky', backgroundColor:"white",height:60,top: 0, zIndex: 1}} >
                <Typography sx={{ fontSize: 24 }} gutterBottom>
                  Your Appointments
                </Typography>
                </div>
                <div style={{ display: 'flex', width: '100%', position: 'sticky', backgroundColor:"white",top: -16, zIndex: 1 }}>
                
                <FormControl sx={{width:"300px",marginRight:"auto"}} >
                    <InputLabel id="StateSelector">State of appointment</InputLabel>
                    <Select
                    labelId="StateSelector"
                    id="demo-simple-select"
                    label="Time"
                    value={searchvalue}
                    onChange={changeSearchValue}
                  >
                    
                <MenuItem value="upcoming">upcoming</MenuItem>
                <MenuItem value="completed">completed</MenuItem>
                <MenuItem value="cancelled">cancelled</MenuItem>
                <MenuItem value="rescheduled">rescheduled</MenuItem>
                  </Select>
                  
                </FormControl>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker id="searchDate" onChange={changeDateValue} slotProps={{field: { clearable: true }}} />
                  </LocalizationProvider>
                </div>

                {/* Grid Content... */}
                <Grid container sx={{ display: 'flex', marginTop: 2 }} justifyContent="center" alignItems="center" columnSpacing={3} rowSpacing={3}>
                  {appointments.length === 0 && !appLoading && (
                    <PlaceHolder message="No appointments" description="You have no appointments" width="390" height="320" />
                  )}
                  <AnimatePresence>
                    {!appLoading &&
                      appointments.length !== 0 &&
                      appointments.map((app, index) => (
                        <Grid item key={index}>
                          <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                          >
                            
                            <AppointmentCard name={app.patientID.name} date={app.date.split('T')[0]} time={(app.date.split('T')[1]).split('.')[0]} status={app.status} isFull={true} ids={app._id} whenClicked={handleClickOpen} schedFollowup={SchedFollow} cancel={cancel} />
                          </motion.div>
                        </Grid>
                      ))}
                  </AnimatePresence>
                  
                  {appLoading && loadingComponents}
                </Grid>
              </CardContent>
              
            </Card>
            
          </div>
          
        </div>
      )}
       
    </div>
  );
}

export default DoctorAppointments;
