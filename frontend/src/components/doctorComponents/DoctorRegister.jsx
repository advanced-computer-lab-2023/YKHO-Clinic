import {React,useState} from 'react';
import axios from 'axios';
import Joi from 'joi';
import { set } from 'mongoose';
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
                <div style={{display:'flex', flexDirection:'column'}}>
                    <div style={{display:'flex'}}>
                        <div>
                            <label htmlFor="username">username</label><br />
                            <input type="text" id="username" name="username" /><br />
                            <label htmlFor="password">password</label><br />
                            <input type="password" id="password" name="password" /><br />
                            <label htmlFor="name">name</label><br />
                            <input type="text" id="name" name="name" /><br />
                            <label htmlFor="DOB">DOB</label><br />
                            <input type="date" id="DOB" name="DOB" /><br />
                            <label htmlFor="email">email</label><br />
                            <input type="email" id="email" name="email" /><br /><br />
                        </div>
                        <div>

                            <label htmlFor="speciality">Choose a Specialty:</label>
                            <select id="speciality" name="speciality">
                                <option value="dermatology">dermatology</option>
                                <option value="pediatrics">pediatrics</option>
                                <option value="orthopedics">orthopedics</option>
                            </select><br /><br />
                            <label htmlFor="mobile">mobile</label><br />
                            <input type="number" id="mobile" name="mobile" /><br />
                            <label htmlFor="rate">rate</label><br />
                            <input type="number" id="rate" name="rate" /><br />
                            <label htmlFor="affiliation">affiliation</label><br />
                            <input type="text" id="affiliation" name="affiliation" /><br />
                            <label htmlFor="education">education</label><br />
                            <input type="text" id="education" name="education" /><br /><br />
                        </div>
                    </div>
                    <div style={{display:'flex'}}>
                        <label htmlFor="id">Your Id:</label>
                        <input type="file" id="id" name="files" required /><br />
                        <label htmlFor="license">Your Medical License:</label>
                        <input type="file" id="license" name="files" required /><br />
                        <label htmlFor="degree">Your Medical degree:</label> 
                        <input type="file" id="degree" name="files" required /><br /><br />
                    </div>

                    <input type="submit" onClick={register} value="register" />
                    <p>{message}</p>
                </div>
            );
        };

const styles={
    input : {
        width: "450px",
        height: "40px",
        padding: "0px 10px",
        margin: "8px 0",
        display: "inline-block",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxSizing: "border-box"
    }
}
        
export default DoctorRegister;
