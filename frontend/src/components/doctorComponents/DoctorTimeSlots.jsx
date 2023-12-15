import React from 'react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import Joi from 'joi';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Navbar from './Navbar';
import TimeSlotCard from './TimeSlotCard';
import { Button, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import Alert from '@mui/material/Alert';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

const DoctorTimeSlots = () => {
    const [results, setResults] = useState(false);
    const days=["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    //const [result, setResult] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);
    const [message, setMessage] = useState("");
    const [value, setValue] = useState('1');
    useEffect(() => {check() , getTimeSlots()},[]);
    const [Day, setAge] = React.useState("");
    const [timefrom, setTimeFrom] = React.useState(dayjs('2022-04-17T15:30'));
    const [timeTo, setTimeTo] = React.useState(dayjs('2022-04-17T15:30'));
    const [error, setError] = useState(false);
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const [result, setResult] = useState(false);
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

          const homeBreadcrumb = { label: "timeSlots", href: "/doctor/timeslots" };
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

    async function cancel(id){
        deleteTimeSlot(id);
    }
    async function getTimeSlots() {
        try {
            const res = await axios.get("http://localhost:3000/doctor/timeSlots", {
                withCredentials: true
            });
            //console.log(result);
            setTimeSlots(res.data.result);

        } catch (err) {
            console.log(err);
        }
    }
   

    



    async function createNewTimeSlot() {
        
        try {
            if(Day==("")){
                setError(true);
                return setMessage("Please Choose a Day");
            }
            let from1;
            if(timefrom.minute()=="5"||timefrom.minute()=="0"){
                from1 = dayjs(timefrom).hour() + ":0"+dayjs(timefrom).minute();
            }
            else{
                from1 = dayjs(timefrom).hour() + ":"+dayjs(timefrom).minute();
            }
            let to1;
            if(timeTo.minute()=="5"||timeTo.minute()=="0"){
                to1 = dayjs(timeTo).hour() + ":0"+dayjs(timeTo).minute();
            }
            else{
                to1 = dayjs(timeTo).hour() + ":"+dayjs(timeTo).minute();
            }
            let day = Day;
            
            

            const schema = Joi.object({
                day: Joi.string().required().min(5).max(20),
                "Start Time": Joi.string().required(),
                "End Time": Joi.string().required(),
              });
            const {error1,result}=schema.validate({day:day,"Start Time":from1,"End Time":to1});
            if (error1) {
                setError(true);
                return setMessage(error1.details[0].message);
            }
            const res = await axios.post("http://localhost:3000/doctor/addTimeSlot", {
                day: day,
                from: from1,
                to: to1
            }, {
                withCredentials: true
            });
            setMessage(res.data.message);
            if(res.data.message=="Timeslot created successfully."){
                setTimeSlots(res.data.times)
                setError(false);

            }
            else(setError(true))
        } catch (err) {
            console.log(err);
        }
    }
    async function deleteTimeSlot(e) {
            const id=e;
            const res = await axios.get(`http://localhost:3000/doctor/deleteTimeSlot/${id}`, {
                withCredentials: true
            });
            setTimeSlots(res.data.result);  

    }
    const handleChange1 = (event, newValue) => {
        setValue(newValue);

      };
      console.log( dayjs(timefrom).hour() + ":"+dayjs(timefrom).minute() );

    
    return (result &&
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
            <div>
            <Grid container sx={{ display: 'flex', marginTop: 2 ,width:"100%",justifyContent:"center" ,alignItems:"center"  }} columnSpacing={3} rowSpacing={3}>
            <Paper sx={{ width: '40%', typography: 'body1',marginTop:"100px",marginLeft:"50px",justifyContent:"center" ,alignItems:"center"  }}>
                <Typography sx={{ fontSize: 20,textAlign:"center",marginTop:"10px"}} > Current Time Slots </Typography>
                <TabContext value={value} sx={{width:'100%'}}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange1} aria-label="lab API tabs example">
                    <Tab label="Sunday" value="1" />
                    <Tab label="Monday" value="2" />
                    <Tab label="Tuesday" value="3" />
                    <Tab label="Wednesday" value="4" />
                    <Tab label="Thursday" value="5" />
                    <Tab label="Friday" value="6" />
                    <Tab label="Saturday" value="7" />
                    </TabList>
                     </Box>
                    <TabPanel value="1" sx={{overflowY:'auto',width:'100%',height:"500px"}}>
                    <Grid container sx={{ display: 'flex', marginTop: 2 ,width:"100%",justifyContent:"center" ,alignItems:"center"}} columnSpacing={2} rowSpacing={2}>
                    {timeSlots.length !== 0 &&
                         timeSlots.filter(app => app.day === "sunday").map((app, index) => (
                    <Grid item key={index}>
                       <TimeSlotCard from={app.from} to={app.to} _id={app._id} cancel={cancel}/>
                        </Grid> 
                    
                         ))}
                    </Grid>
                            
                  </TabPanel>
                  <TabPanel value="2" sx={{overflowY:'auto',width:'100%',height:"500px"}}>
                    <Grid container sx={{ display: 'flex', marginTop: 2 ,width:"100%",justifyContent:"center" ,alignItems:"center" }} columnSpacing={3} rowSpacing={3}>
                    {timeSlots.length !== 0 &&
                         timeSlots.filter(app => app.day === "monday").map((app, index) => (
                    <Grid item key={index}>
                       <TimeSlotCard from={app.from} to={app.to} _id={app._id} cancel={cancel}/>
                        </Grid> 
                    
                         ))}
                    </Grid>
                            
                  </TabPanel>
                  <TabPanel value="3" sx={{overflowY:'auto',width:'100%',height:"500px"}}>
                    <Grid container sx={{ display: 'flex', marginTop: 2 ,width:"100%",justifyContent:"center" ,alignItems:"center" }} columnSpacing={3} rowSpacing={3}>
                    {timeSlots.length !== 0 &&
                         timeSlots.filter(app => app.day === "tuesday").map((app, index) => (
                    <Grid item key={index}>
                       <TimeSlotCard from={app.from} to={app.to} _id={app._id} cancel={cancel}/>
                        </Grid> 
                    
                         ))}
                    </Grid>
                            
                  </TabPanel>
                  <TabPanel value="4" sx={{overflowY:'auto',width:'100%',height:"500px"}}>
                    <Grid container sx={{ display: 'flex', marginTop: 2 ,width:"100%",justifyContent:"center" ,alignItems:"center" }} columnSpacing={3} rowSpacing={3}>
                    {timeSlots.length !== 0 &&
                         timeSlots.filter(app => app.day === "wednesday").map((app, index) => (
                    <Grid item key={index}>
                       <TimeSlotCard from={app.from} to={app.to} _id={app._id} cancel={cancel}/>
                        </Grid> 
                    
                         ))}
                    </Grid>
                            
                  </TabPanel>
                  <TabPanel value="5" sx={{overflowY:'auto',width:'100%',height:"500px"}}>
                    <Grid container sx={{ display: 'flex', marginTop: 2 ,width:"100%",justifyContent:"center" ,alignItems:"center" }} columnSpacing={3} rowSpacing={3}>
                    {timeSlots.length !== 0 &&
                         timeSlots.filter(app => app.day === "thursday").map((app, index) => (
                    <Grid item key={index}>
                       <TimeSlotCard from={app.from} to={app.to} _id={app._id} cancel={cancel}/>
                        </Grid> 
                    
                         ))}
                    </Grid>
                            
                  </TabPanel>
                  <TabPanel value="6" sx={{overflowY:'auto',width:'100%',height:"500px"}}>
                    <Grid container sx={{ display: 'flex', marginTop: 2 ,width:"100%",justifyContent:"center" ,alignItems:"center" }} columnSpacing={3} rowSpacing={3}>
                    {timeSlots.length !== 0 &&
                         timeSlots.filter(app => app.day === "friday").map((app, index) => (
                    <Grid item key={index}>
                       <TimeSlotCard from={app.from} to={app.to} _id={app._id} cancel={cancel}/>
                        </Grid> 
                    
                         ))}
                    </Grid>
                            
                  </TabPanel>
                  <TabPanel value="7" sx={{overflowY:'auto',width:'100%',height:"500px"}}>
                    <Grid container sx={{ display: 'flex', marginTop: 2 ,width:"100%",justifyContent:"center" ,alignItems:"center" }} columnSpacing={3} rowSpacing={3}>
                    {timeSlots.length !== 0 &&
                         timeSlots.filter(app => app.day === "saturday").map((app, index) => (
                    <Grid item key={index}>
                       <TimeSlotCard from={app.from} to={app.to} _id={app._id} cancel={cancel}/>
                        </Grid> 
                    
                         ))}
                    </Grid>
                            
                  </TabPanel>
                  </TabContext>
            </Paper>
            
            
            <Paper sx={{ width: '40%', typography: 'body1',marginTop:"100px",marginLeft:"150px",justifyContent:"center" ,alignItems:"center",height:"578px" }}>
            <div>
            <Typography sx={{ fontSize: 20,textAlign:"center",marginTop:"10px"}} > Create Time Slots </Typography>
            </div>
            <div>
            <Grid container sx={{ display: 'flex', marginTop: "50px" ,width:"100%",justifyContent:"center" ,alignItems:"center",maringBottom:"100px" }}>
            
            <FormControl sx={{width:'60%'}}>
                <InputLabel id="demo-simple-select-label">Day</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={Day}
                    label="Day"
                    onChange={handleChange}>
                    <MenuItem value={"sunday"}>Sunday</MenuItem>
                    <MenuItem value={"monday"}>Monday</MenuItem>
                    <MenuItem value={"tuesday"}>Tuesday</MenuItem>
                    <MenuItem value={"wednesday"}>Wednesday</MenuItem>
                    <MenuItem value={"thursday"}>Thursday</MenuItem>
                    <MenuItem value={"friday"}>Friday</MenuItem>
                    <MenuItem value={"saturday"}>Saturday</MenuItem>
                    
                </Select>
            </FormControl>
            </Grid>
            </div>
            <div>
            <Grid container sx={{ display: 'flex', marginTop: "50px" ,width:"100%",justifyContent:"center" ,alignItems:"center",maringBottom:"100px" }}>
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['TimePicker']}>
            <TimePicker
            label="From"
             value={timefrom}
            onChange={(newValue) => setTimeFrom(newValue)}
            />
            </DemoContainer>
            </LocalizationProvider>

            </Grid>
            </div>
            <div>
            <Grid container sx={{ display: 'flex', marginTop: "50px" ,width:"100%",justifyContent:"center" ,alignItems:"center",maringBottom:"100px" }}>
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['TimePicker']}>
            <TimePicker
            label="To"
             value={timeTo}
            onChange={(newValue) => setTimeTo(newValue)}
            />
            </DemoContainer>
            </LocalizationProvider>

            </Grid>
            </div>
            <div>
            <Grid container sx={{ display: 'flex', marginTop: "50px" ,width:"100%",justifyContent:"center" ,alignItems:"center",maringBottom:"100px" }}>
            <Button variant="contained" onClick={createNewTimeSlot}>Create</Button>
            </Grid>
            </div>
            <div>
            <Grid container sx={{ display: 'flex', marginTop: "50px" ,width:"100%",justifyContent:"center" ,alignItems:"center",maringBottom:"100px" }}>
            {message.length !== 0 &&error&&<Alert severity="error">{message}</Alert>}
            {message.length !== 0 &&!error&&<Alert severity="success">{message}</Alert>}
            </Grid>
            
            </div>
            </Paper>
            </Grid>
            </div>
            
         </div>
    );
};

export default DoctorTimeSlots;
