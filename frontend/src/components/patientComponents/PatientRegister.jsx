import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import MuiAlert  from '@mui/material/Alert';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

const patientRegister = () => {
    const [message, setMessage] = useState("");
    
    const [selectedDate, setSelectedDate] = React.useState("");
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };

    const [gender, setGender] = React.useState('');
    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    async function register() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const name = document.getElementById("name").value;
        let DOB = selectedDate;
        const email = document.getElementById("email").value;
        const mobile = document.getElementById("mobile").value;
        const genderChoice = gender;
        const emergencyName = document.getElementById("emergencyName").value;
        const emergencyMobile = document.getElementById("emergencyMobile").value;


        let bodyJson = { username, password, name, DOB, email, mobile, gender: genderChoice, emergencyName, emergencyMobile };
        console.log(bodyJson)
        try {
            const response = await axios.post("http://localhost:3000/patient/createPatient", bodyJson);
            if (response.data.message === "request sent successfully") {
                window.location.href = "/";
            } else {
                console.log(response.data.message)
                setMessage(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
            return (
                <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginTop:'150px'}}>
                    <Typography style={{marginBottom:'15px'}} variant='h5'>Register Patient</Typography>
                    <div style={{display:'flex'}}>
                        <div style={{display:'flex', flexDirection:'column', marginRight:'150px'}}>
                            <TextField  sx={{ marginBottom:'15px' }}  id="username" name="username" label="username" />
                            <TextField  sx={{ marginBottom:'15px' }} type="password" id="password" name="password" label='password' />
                            <TextField  sx={{ marginBottom:'15px' }} id="name" name="name" label='name' />
                            <TextField  sx={{ marginBottom:'15px' }} type="email" id="email" name="email" label='email'/>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer sx={{ marginBottom:'15px' }} components={['DatePicker']}>
                                    <DatePicker id="DOB" name="DOB" value={selectedDate} onChange={handleDateChange} label="Date of Birth" />
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>
                        <div style={{display:'flex', flexDirection:'column', marginBottom:'15px'}}>
                            <TextField sx={{ marginBottom:'25px'}} type="number" id="mobile" name="mobile" label='mobile' />
                            <FormControl sx={{ marginBottom:'25px'}} fullWidth>
                                        <InputLabel id="choice">gender</InputLabel>
                                        <Select
                                            labelId="choice"
                                            id="demo-simple-select"
                                            value={gender}
                                            label="gender"
                                            onChange={handleGenderChange}
                                            >
                                            <MenuItem value={"male"}>male</MenuItem>
                                            <MenuItem value={"female"}>female</MenuItem>
                                        </Select>
                                    </FormControl>
                            <Typography sx={{ marginBottom:'25px'}}>Emergency Contact</Typography>
                            <TextField sx={{ marginBottom:'25px'}} id="emergencyName" name="emergencyName" label='emergencyName' />
                            <TextField sx={{ marginBottom:'25px'}} type="number" id="emergencyMobile" name="emergencyMobile" label='emergencyMobile' />
                        </div>
                    </div>
                    <Button style={{ marginBottom:'15px'}} type="submit" variant='contained' onClick={register} value="register"> Register </Button>
                    {message && <Alert severity="error">{message}</Alert>}
                </div>
            );
        };

export default patientRegister;
