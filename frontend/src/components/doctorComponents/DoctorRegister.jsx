import React, { useState } from 'react';
import axios from 'axios';
import Joi from 'joi';
import Button from '@mui/material/Button';
import MuiAlert  from '@mui/material/Alert';
import { Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Paper from '@mui/material/Paper';
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

const DoctorRegister = () => {
    const [message, setMessage] = useState("");
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const [selectedDate, setSelectedDate] = React.useState("");
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };

    const [speciality, setspeciality] = React.useState('');
    const handleSpecialityChange = (event) => {
        setspeciality(event.target.value);
    };
    // const handleFileChange = (event) => {
    //     const file = event.target.files[0];
    //     // Do something with the file, e.g., upload or process it
    //     console.log('Selected file:', file);
    //   };

    async function register() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const name = document.getElementById("name").value;
        let DOB = selectedDate;
        const email = document.getElementById("email").value;
        const specialityChoice = speciality;
        const mobile = document.getElementById("mobile").value;
        const rate = document.getElementById("rate").value;
        const affiliation = document.getElementById("affiliation").value;
        const education = document.getElementById("education").value;
        const id = document.getElementById("id").files[0];
        const license = document.getElementById("license").files[0];
        const degree = document.getElementById("degree").files[0];
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("name", name);
        formData.append("DOB", DOB);
        formData.append("email", email);
        formData.append("speciality", specialityChoice);
        formData.append("mobile", mobile);
        formData.append("rate", rate);
        formData.append("affiliation", affiliation);
        formData.append("education", education);
        formData.append("files", id);
        formData.append("files", license);
        formData.append("files", degree);
        const requestSchema = Joi.object({
            username: Joi.string().required().min(3).max(30),
            password: Joi.string().required().min(8).max(30),
            name: Joi.string().required().min(3).max(30),
            email: Joi.string().required(),
            speciality: Joi.string().required(),
            mobile: Joi.number().required(),
            rate: Joi.number().required(),
            affiliation: Joi.string().required(),
            education: Joi.string().required(),
            id: Joi.required(),
            license: Joi.required(),
            degree: Joi.required(),
        });
        // const [speciality1, setSpeciality1] = React.useState('');

        // const handleChange = (event) => {
        //     setSpeciality1(event.target.value);
        // };
        const { error, value } = requestSchema.validate({
            username,
            password,
            name,
            email,
            speciality,
            mobile,
            rate,
            affiliation,
            education,
            id,
            license,
            degree,
        });

        if (error) {
            return setMessage(error.details[0].message);
        }
        if (!validateEmail(email)) {
            return setMessage("invalid email");
        }
        try {
            const response = await axios.post("http://localhost:3000/request/createRequest", formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
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
                <div style={{display:'flex', flexDirection:'column', justifyContent:"center",alignItems:'center'}}>
                    <IconButton style={{ position: 'absolute', top: '10px', left: '10px' }} onClick={() => { window.location.href = "/" }}>
                        <ArrowBackIcon/>
                    </IconButton>
                    <Paper sx={{padding:5, marginTop:'150px',display:"flex",flexDirection:'column',alignItems:"center"}}>
                    <Typography style={{marginBottom:'15px'}} variant='h5'>Register Doctor</Typography>
                    <div style={{display:'flex'}}>
                        <div style={{display:'flex', flexDirection:'column',alignItems:"center", marginRight:'150px'}}>
                            <TextField  sx={{ marginBottom:'16px' }}  id="username" name="username" label="username" />
                            <TextField  sx={{ marginBottom:'16px' }} type="password" id="password" name="password" label='password' />
                            <TextField  sx={{ marginBottom:'16px' }} id="name" name="name" label='name' />
                            <TextField  sx={{ marginBottom:'16px' }} type="email" id="email" name="email" label='email'/>
                            
                            {/* <input style={styles.input} type="date" id="DOB" name="DOB" placeholder='DOB' /> */}
                            <LocalizationProvider sx={{maxWidth:"223px",marginBottom:"16px"}} dateAdapter={AdapterDayjs}>
                       
                                    <DatePicker sx={{maxWidth:"223px",marginBottom:"16px"}} id="DOB" name="DOB" value={selectedDate} onChange={handleDateChange} label="Date of Birth" />
                                
                            </LocalizationProvider>
                            
                        </div>
                        <div style={{display:'flex', flexDirection:'column',alignItems:"center", marginBottom:'15px'}}>
                            <div style={{width:'259px',display:"flex",flexDirection:'column' }}>
                                {/* <label htmlFor="speciality">Specialty:</label>
                                <select style={{...styles.input, width:'186px'}} id="speciality" name="speciality">
                                    <option value="dermatology">dermatology</option>
                                    <option value="pediatrics">pediatrics</option>
                                    <option value="orthopedics">orthopedics</option>
                                </select> */}
                                <Box fullWidth sx={{marginBottom:'16px',minWidth: "223px"}}>
                                    <FormControl sx={{display:"flex",alignItems:"center",minWidth: "223px"}}>
                                        <InputLabel id="choice">dermatology</InputLabel>
                                        <Select
                                            labelId="choice"
                                            id="demo-simple-select"
                                            value={speciality}
                                            label="Speciality"
                                            onChange={handleSpecialityChange}
                                            sx={{minWidth: "223px"}}
                                            >
                                            <MenuItem value={"dermatology"}>dermatology</MenuItem>
                                            <MenuItem value={"pediatrics"}>pediatrics</MenuItem>
                                            <MenuItem value={"orthopedics"}>orthopedics</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </div>
                            <TextField sx={{ marginBottom:'16px'}} type="number" id="mobile" name="mobile" label='mobile' />
                            <TextField sx={{ marginBottom:'16px' }} type="number" id="rate" name="rate" label='rate' />
                            <TextField sx={{ marginBottom:'18px' }} type="text" id="affiliation" name="affiliation" label='affiliation' />
                            <TextField sx={{ marginBottom:'15px' }} type="text" id="education" name="education" label='education' />
                            
                        </div>
                    </div>
                    <Stack spacing={1} direction={'column'} style={{ marginBottom:'30px'}}>
                    <Button  component="label" variant="contained" startIcon={<CloudUploadIcon />} name="files"> Upload Identification <VisuallyHiddenInput id="id" type="file" />  </Button>
                    <Button  component="label" variant="contained" startIcon={<CloudUploadIcon />} name="files"> Upload Medical License <VisuallyHiddenInput id="license" type="file" />  </Button>
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} name="files"> Upload Medical degree <VisuallyHiddenInput id="degree" type="file" />  </Button>
                    </Stack>
                    <Button style={{ marginBottom:'15px'}} type="submit" variant='contained' onClick={register} value="register"> Register </Button>
                    {message && <Alert severity="error">{message}</Alert>}
                    </Paper>
                    
                </div>
                
            );
        };
        
export default DoctorRegister;
