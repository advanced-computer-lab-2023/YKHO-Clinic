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
  TextField,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LoadingComponent from '../LoadingComponent';
import PlaceHolder from '../PlaceHolder';
import Navbar from './Navbar';
import AppointmentCard from './AppointmentCard';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
let status = '';
let date = undefined;
let searchvalue = '';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
async function reschedule(e) {
  await axios
    .post(
      'http://localhost:3000/doctor/reschedule',
      {
        id: e.target.id,
      },
      { withCredentials: true }
    )
    .then((res) => {
      window.location.href = '/doctor/appointments';
    })
    .catch((err) => {
      console.log(err);
    });
}
function DoctorAppointments() {
  const [result, setResult] = useState(false);
  useEffect(() => {
    check();
    loadAppointments();
  }, []);

  const [appointments, setAppointments] = useState([]);
  const [appLoading, setAppLoading] = useState(true);

  async function check() {
    await axios
      .get('http://localhost:3000/doctor/contract', {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.contract === 'rej') {
          window.location.href = '/doctor/contract';
        } else {
          setResult(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    const res = await axios
      .get('http://localhost:3000/loggedIn', {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.type !== 'doctor') {
          if (res.data.type === 'patient') {
            window.location.href = '/patient/home';
          } else if (res.data.type === 'admin') {
            window.location.href = '/admin/home';
          } else {
            window.location.href = '/';
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.location.href = '/';
        }
      });
  }

  async function loadAppointments() {
    await axios
      .get('http://localhost:3000/doctor/Appointments', { withCredentials: true })
      .then((res) => {
        setAppointments(res.data.result);
        setAppLoading(false);
      })
      .catch((err) => {
        console.log(err);
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
    searchvalue = event.target.value;
    setAppLoading(true);
    searchAppointments();
  }

  async function searchAppointments(event) {
    console.log(status, date, searchvalue);
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
    window.location.href = `/doctor/followup/${e.target.id}`;
  }

  const [isOpen, setIsOpen] = useState(false);

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
      console.log(e);
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const setDate = (e) => {
      

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
        <DialogTitle>{"Reshedule this appointment?"}</DialogTitle>
        <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs} sx={{marginTop:5}}>
                    <DatePicker id="searchDate" onChange={setDate} />
        </LocalizationProvider>
        <Box sx={{ minWidth: 120 }}>
        
      <FormControl sx={{width:313,marginTop:5}} >
        <InputLabel id="TimeSelector">Please select a date</InputLabel>
        <Select
          labelId="TimeSelector"
          id="demo-simple-select"
          label="Time"
          value=""
        >
        </Select>
      </FormControl>
        </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Reschedule</Button>
        </DialogActions>
      </Dialog>
          <Navbar />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '3%' }}>
            <Card sx={{ display: 'flex', width: '80vw', height: '80vh' }}>
              {/* Filter Box */}
              <Box bgcolor="primary.main" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <motion.div
                  initial={{ width: isOpen ? '310px' : '70px' }}
                  animate={{ width: isOpen ? '310px' : '70px' }}
                  transition={{ duration: 0.3 }}
                  style={{ backgroundColor: 'secondary', overflow: 'hidden' }}
                >
                  <div style={{ marginLeft: 8 }}>
                    <IconButton onClick={toggleFilter}>
                      <FilterAltIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                    <FormControl>
                      <br />
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
                
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', marginRight: 'auto' }}>
                    <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                    <TextField
                      onChange={changeSearchValue}
                      id="searchText"
                      label="Search appointments by name"
                      variant="standard"
                      sx={{ width: 300 }}
                    />
                  </Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker id="searchDate" onChange={changeDateValue} />
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
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                          >
                            <AppointmentCard name={app.patientID.name} date={app.date.split('T')[0]} isFull={true} ids={app._id} whenClicked={handleClickOpen} />
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
