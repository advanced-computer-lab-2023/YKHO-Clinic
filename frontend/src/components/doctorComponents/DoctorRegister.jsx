import {React,useState} from 'react';
import axios from 'axios';
import Joi from 'joi';
import { set } from 'mongoose';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';

const DoctorRegister = () => {
const [message, setMessage] = useState("");
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
    async function register() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const name = document.getElementById("name").value;
        const DOB = document.getElementById("DOB").value;
        const email = document.getElementById("email").value;
        const speciality = document.getElementById("speciality").value;
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
        formData.append("speciality", speciality);
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
            DOB: Joi.date().required(),
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
        
        const { error, value } = requestSchema.validate({
            username,
            password,
            name,
            DOB,
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
                setMessage(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
            return (
                <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginTop:'200px'}}>
                    <Typography style={{marginBottom:'15px'}} variant='h5'>Register Doctor</Typography>
                    <div style={{display:'flex'}}>
                        <div style={{display:'flex', flexDirection:'column', marginRight:'150px'}}>
                            <TextField variant='standard' id="username" name="username" label="username" />
                            <TextField variant='standard' type="password" id="password" name="password" label='password' />
                            <TextField variant='standard' type="text" id="name" name="name" label='name' />
                            <TextField variant='standard' type="date" id="DOB" name="DOB" label='DOB' />
                            <TextField variant='standard' type="email" id="email" name="email" label='email' />
                        </div>
                        <div style={{display:'flex', flexDirection:'column', marginBottom:'15px'}}>
                            <div>
                                <label htmlFor="speciality">Specialty:</label>
                                <select style={{...styles.input, width:'186px'}} id="speciality" name="speciality">
                                    <option value="dermatology">dermatology</option>
                                    <option value="pediatrics">pediatrics</option>
                                    <option value="orthopedics">orthopedics</option>
                                </select>
                            </div>
                            <input style={styles.input} type="number" id="mobile" name="mobile" placeholder='mobile' />
                            <input style={styles.input} type="number" id="rate" name="rate" placeholder='rate' />
                            <input style={styles.input} type="text" id="affiliation" name="affiliation" placeholder='affiliation' />
                            <input style={styles.input} type="text" id="education" name="education" placeholder='education' />
                        </div>
                    </div>
                    <div style={{display:'flex', marginBottom:'15px', paddingLeft:'80px'}}>
                        <label style={{fontSize: "1.1em"}} htmlFor="id">Your Id:</label>
                        <input type="file" id="id" name="files" required />
                        <label style={{fontSize: "1.1em"}} htmlFor="license">Your Medical License:</label>
                        <input type="file" id="license" name="files" required />
                    </div>
                    <div style={{ marginBottom:'15px'}}>
                    <label style={{fontSize: "1.1em"}} htmlFor="degree">Your Medical degree:</label> 
                    <input type="file" id="degree" name="files" required />
                    </div>
                    <Button type="submit" variant='contained' onClick={register} value="register"> Register </Button>
                    <p>{message}</p>
                </div>
            );
        };

const styles={
    input : {
        fontSize: "1.1em",
        width: "250px",
        height: "20px",
        padding: "0px 5px",
        margin: "8px 0",
        display: "inline-block",
        border: "1px solid black",
        borderRadius: "4px",
        boxSizing: "border-box"
    }
}
        
export default DoctorRegister;
