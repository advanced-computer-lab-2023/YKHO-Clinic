
import React from 'react'
import axios from 'axios'
import { useState ,useEffect} from 'react'
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import logo from "../../../images/logo_white.png";
import Box from '@mui/material/Box';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Login(){
    const [error,setError]= useState("")
    const [result,setResult]=useState(false);
    useEffect(()=>{check()},[]);
    async function check(){
        const res= await axios.get("http://localhost:3000/loggedIn",{
            withCredentials:true
        }).then((res)=>{
            
            if(res.data.type=="doctor" ){
                window.location.href="/doctor/home"
             }
                else if(res.data.type=="patient"){
                    window.location.href="/patient/home"
                }
                else if(res.data.type=="admin"){
                    window.location.href="/admin/home"
                }
                else{
                    setResult(true)
                    
                }
         }
         ).catch((err)=>{
            if(err.response.status==401){
                setResult(true)
            }
         })
    }
    const handleLogin= async ()=>{
        //get username and password from input fields
        //send a post request to backend with username and password
        //if backend returns a token, store it in local storage
        //redirect to user type home page
        //else show an error message

        const username=document.getElementsByName("username")[0].value
        const password=document.getElementsByName("password")[0].value
        await axios.post("http://localhost:3000/login",{ 
            username:username, 
            password:password, 
        },{withCredentials:true}).then(async (res)=>{ 
            if(!res.data.message){ 
                if(res.data.type=="doctor"){ 
                    window.location.href="/doctor/home"  
                } 
                else if(res.data.type=="patient"){ 
                        window.location.href="/patient/home"        
                }
                else if(res.data.type=="admin"){
                        window.location.href="/admin/home"
                }
                else{
                    window.location.href="/"
                }
            }
            else{
                setError(res.data.message)
            }
        })
    }
    function handleDoctor(){
        window.location.href="/register/doctor"
    }
    function handlePatient(){
        window.location.href="/register/patient"
    }
    function goToForgetPassword(){
        window.location.href="/forgetPassword/enterUsername"  
    }
    return(
        <>
            {result&&
                <div style={{width:"100vw",height:"100vh",display:"flex",margin:0}}>
                <Box bgcolor="primary.main" sx={{display:"flex",justifyContent:"center",alignItems:"center",width:"50vw"}}>
                <img src={logo} style={{width:'400px'}}/>
                </Box>
                <div style ={{display:'flex',width:"50vw", flexDirection:'column',justifyContent:'center' ,alignItems:'center'}}>
                
                <Typography style ={{justifyContent:'center', marginBottom:'20px'}} variant='h4'>LOGIN</Typography>
                <input style={styles.input} name="username" type="text" placeholder="username" />
                <input style={styles.input} name="password" type="password" placeholder="password" />
                <div style={{display:'flex', justifyContent:'space-around'}}>
                    <Button variant='contained' style={{marginRight: '190px'}} onClick={goToForgetPassword}>forget Password</Button>
                    <Button variant='contained'  onClick={handleLogin}>Login</Button>
                </div>
                <br/>
                <Button style={{...styles.input,marginBottom:'10px'}} variant='contained' onClick={handleDoctor}>register doctor</Button>
                <Button style={{...styles.input,marginBottom:'30px'}} variant='contained' onClick={handlePatient}>register patient</Button>
                {error && <Alert severity="error"> {error} </Alert>}
            </div>
            </div>}
        </>
    )
}

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

export default Login