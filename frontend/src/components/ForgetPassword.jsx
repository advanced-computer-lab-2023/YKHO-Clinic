import axios from 'axios';
import Button from '@mui/material/Button';
import { Icon, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import MuiAlert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ForgetPassword() {
  const [message, setMessage] = useState("");
  const [otpRetrieved, setOtpRetrieved] = useState("");
  const [username, setUsername] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  async function forgetPasswordGoToOTP() {
    try {
      const response = await axios.get(`http://localhost:3000/forgetPassword/enterOTP?username=${username}`);
      if (response.data.message === "otp sent") {
        console.log(response.data.OTP);
        setOtpRetrieved(response.data.OTP);
        setMessage("");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  async function checkOTP(){
    if(document.getElementById("OTP").value === otpRetrieved){
        setChangePassword(true);
        setMessage("");
    }else{
        setMessage("Invalid OTP");
    }
  }

  async function changePasswordFunc(){
    // if(document.getElementById("newPassowrd").value === document.getElementById("confirmPassowrd").value){
    //     if(!isStrongPassword(document.getElementById("newPassowrd").value)){
    //         setMessage("Password is Weak");
    //     } else {
            const Json = {username:username, 
                newPassword:document.getElementById("newPassowrd").value, 
                confirmationPassword:document.getElementById("confirmationPassword").value};
            try {
                const response = await axios.post(`http://localhost:3000/forgetPassword/done`, Json );
                if (response.data.message === "Password Changed") {
                  window.location.href = "/";
                } else {
                  setMessage(response.data.message);
                }
              } catch (error) {
                console.log(error);
              }
        
    // }
    // else{
    //     setMessage("Passwords do not match");
    // }
    
  }

  return (
    <div>
      <IconButton style={{ position: 'absolute', top: '10px', left: '10px' }} onClick={() => { window.location.href = "/" }}>
        <ArrowBackIcon/>
      </IconButton>
      {otpRetrieved === "" && (
        <div style={{  display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Paper sx={{ marginTop: '300px',display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px', height: '355px', width: '400px' }}>
            <Typography style={{ justifyContent: 'center', marginBottom: '20px' }} variant='h4'>Forget Password</Typography>
            <TextField
              id="username"
              name="username"
              label="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button style={{ marginTop: '20px', marginBottom: '20px' }} variant="contained" onClick={forgetPasswordGoToOTP}>Forget Password</Button>
            <Typography style={{ justifyContent: 'center', marginBottom: '20px' }}>An OTP will be sent to you through E-Mail</Typography>
            {message && <Alert severity="error">{message}</Alert>}
          </Paper>
        </div>
      )}
      {otpRetrieved !== "" && !changePassword && (
        <div style={{  display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Paper style={{marginTop: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px', height: '290px', width: '400px' }}>
            <Typography style={{ justifyContent: 'center', marginBottom: '20px' }} variant='h4'>Enter OTP</Typography>
            <TextField id="OTP" name="OTP" label="OTP" />
            <Button style={{ marginTop: '20px', marginBottom: '20px' }} variant="contained" onClick={checkOTP}>Submit</Button>
            {message && <Alert severity="error">{message}</Alert>}
          </Paper>
        </div>
      )}
      {changePassword && (
        <div style={{  display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Paper style={{ marginTop: '300px',display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px', height: '350px', width: '400px'}}>
            <Typography style={{ justifyContent: 'center', marginBottom: '20px' }} variant='h4'>Enter new Password</Typography>
            <TextField style={{marginBottom:'15px'}} type='password' id="newPassowrd" name="newPassowrd" label="newPassowrd" />
            <TextField  type='password' id="confirmationPassword" name="confirmationPassword" label="confirmationPassword" />
            <Button style={{ marginTop: '20px', marginBottom: '20px' }} variant="contained" onClick={changePasswordFunc}>Submit</Button>
            {message && <Alert severity="error">{message}</Alert>}
          </Paper>
        </div>
      )}
    </div>
  );
}

export default ForgetPassword;
