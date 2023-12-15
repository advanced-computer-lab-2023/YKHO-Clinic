import { CardContent, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useState } from 'react'
import {useEffect} from 'react'
import { Card } from '@mui/material';
import {InputLabel,MenuItem,Select,FormControl} from '@mui/material'

const DoctorInfo = () => {
    const [error,setError]= useState("")
    const updateDoctor= async()=>{
        const updateTerm=document.getElementById("updateTerm").value
        const updateValue=document.getElementById("updateValue").value
        await axios.post("http://localhost:3000/doctor/updateInfo",{
            updateTerm:updateTerm,
            updateValue:updateValue,
        },{withCredentials:true}).then((res)=>{
           setError(res.data.message);
        })
    }
    //checks if logged in and if not redirects to login page
    const [result,setResult]=useState(false);
    useEffect(()=>{check()},[]);
    async function check(){
        await axios.get("http://localhost:3000/doctor/contract",{
        withCredentials:true
    }).then((res)=>{
        if(res.data.contract=="rej"){
            window.location.href="/doctor/contract"
        }
        else{
          setResult(true)
        }
    }).catch((err)=>{
        console.log(err);
    })
        const res= await axios.get("http://localhost:3000/loggedIn",{
            withCredentials:true
        }).then((res)=>{
            
            if(res.data.type!="doctor" ){
                if(res.data.type=="patient"){
                    window.location.href="/patient/home"
                }
                else if(res.data.type=="admin"){
                    window.location.href="/admin/home"
                }
                else{
                 window.location.href="/"
                }
             }
             
         }
         ).catch((err)=>{
            if(err.response.status==401){
                window.location.href="/"
            }
         })
    }
    function handleChange(event){
        setUpdateTerm(event.target.value);
    }
    const [updateTerm,setUpdateTerm]=useState("");
  return (
    <div>
      {result && <div>
        <Card sx={{width:"70%",height:"60%"}}>
        <CardContent>
            <Typography variant="h4">Update your info</Typography>
            <Card sx={{display:"flex"}}>
                <Card>
                    <CardContent>
                        <Typography variant="h5">Update term</Typography>
                        <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Update term</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={updateTerm}
                            label="Age"
                            onChange={handleChange}
                        >
                            <MenuItem value={"email"}>email</MenuItem>
                            <MenuItem value={"rate"}>rate</MenuItem>
                            <MenuItem value={"affiliation"}>affiliation</MenuItem>
                        </Select>
                        </FormControl>
                    </CardContent>
                </Card>        
            </Card>
        </CardContent>
        </Card>
        

      </div>}
    </div>
  );
};

export default DoctorInfo;
