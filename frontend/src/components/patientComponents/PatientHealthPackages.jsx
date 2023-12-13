import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import healthPackageIcon from '../../assets/healthIcon.svg';
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
import PrimarySearchAppBar from './Navbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function patientHealthPackages() {
    const [error, setError] = useState('');
    const [healthPackages, setHealthPackages] = useState([]);
    const [subscription, setSubscription] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [messageAdd, setMessageAdd] = useState("");
    const [messageCreate, setMessageCreate] = useState("");

    const [result,setResult]=useState(false);
    useEffect(()=>{getPackages(),check()},[]);
//  const [breadcrumbs, setBreadcrumbs] = useState([{}]);
    async function check() {
    try {
        const res = await axios.get("http://localhost:3000/loggedIn", {
        withCredentials: true
        });

        if (res.data.type === "admin") {
        window.location.href = "/admin/home";
        // // Check if breadcrumbs contain the "Home" breadcrumb
        // let savedBreadcrumbs = JSON.parse(localStorage.getItem('breadcrumbs'));
        // setBreadcrumbs(savedBreadcrumbs);

        // const healthPackageBreadcrumb = { label: "Health Packages", href: "/admin/healthPackages" };
        // const hasHealthPackageBreadcrumb = savedBreadcrumbs.some(
        //   (item) => item.label == healthPackageBreadcrumb.label
        // );
        //   console.log(hasHealthPackageBreadcrumb)
        // // If not, add it to the breadcrumbs
        // if (!hasHealthPackageBreadcrumb) {
        //   const updatedBreadcrumbs = [healthPackageBreadcrumb];
        //   setBreadcrumbs(updatedBreadcrumbs);
        //   localStorage.setItem('breadcrumbs', JSON.stringify(updatedBreadcrumbs));
        // }
        } else if (res.data.type === "patient") {
        setResult(true);
        } else if (res.data.type === "doctor") {
        window.location.href = "/doctor/home";
        } else {
        window.location.href = "/";
        }
    } catch (err) {
        if (err.response && err.response.status === 401) {
        window.location.href = "/";
        } else {
        setError(err.message);
        }
    }
    }

    async function getPackages() {
        try {
        const res = await axios.get("http://localhost:3000/getHealthPackages", {
            withCredentials: true,
        });

        setHealthPackages(res.data.healthPackages);
        } catch (err) {
        setError(err.message);
        }
    }

    async function getSubscription() {
        try {
        const res = await axios.get("http://localhost:3000/patient/plan", {
            withCredentials: true,
        });

        setSubscription(res.data.result);
        } catch (err) {
        setError(err.message);
        }
    }
//   function handleBreadcrumbClick(event, breadcrumb) {
//     event.preventDefault();
//     // Find the index of the clicked breadcrumb in the array
//     const index = breadcrumbs.findIndex((item) => item.label == breadcrumb.label);
//     let updatedBreadcrumbs;
//     if(index == -1){
//       updatedBreadcrumbs = ([...breadcrumbs, breadcrumb]);
//     }else{
//     // Slice the array up to the clicked breadcrumb (inclusive)
//       updatedBreadcrumbs = breadcrumbs.slice(0, index + 1);
//     }
//     console.log(index);
//     // Set the updated breadcrumbs
//     setBreadcrumbs(updatedBreadcrumbs);

//     // Save updated breadcrumbs to localStorage
//     localStorage.setItem('breadcrumbs', JSON.stringify(updatedBreadcrumbs));

//     console.log(updatedBreadcrumbs)
//     // Navigate to the new page
//     window.location.href = breadcrumb.href;
//   }

  
    // useEffect(() => {
    //   getPackages();
    // }, []);

    return(result &&
        <div>
            <PrimarySearchAppBar/>
            <div style={{display:'flex', flexDirection:'column',justifyContent:'center', alignItems:'center'}}>     
            <Typography style={{marginBottom:'30px',marginTop:'30px', fontSize:'2em'}}>Health Packages</Typography>

                <Paper elevation={6} sx={{display:'flex', overflowX:'auto', flexDirection:'column',justifyContent:'center', alignItems:'center', marginTop:'80px', width:'1300px'}}>
                    <Stack direction='row' spacing={3} sx={{height:'500px', width:'100%'}}>
                        {healthPackages.map((packagesTable) => (
                            <div style={{width:'700px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                                <div style={{border:'2px solid black', width:'270px', height:'400px'}}>
                                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                        <img style={{width:'110px'}} src={healthPackageIcon}/>
                                        <Typography style={{fontWeight:'bold', marginBottom:'20px'}}>{packagesTable.packageName} Package</Typography>
                                        <Typography>Pharmacy Discount: <span style={{fontWeight:'bold'}}>{packagesTable.pharmacyDiscount}%</span></Typography>
                                        <Typography>Doctor Discount: <span style={{fontWeight:'bold'}}>{packagesTable.doctorDiscount}%</span></Typography>
                                        <Typography>Family Discount: <span style={{fontWeight:'bold'}}>{packagesTable.familyDiscount}%</span></Typography> 
                                        <Typography style={{marginBottom:'30px'}}>Duraion: <span style={{fontWeight:'bold'}}>1 year</span></Typography>
                                        <Typography style={{marginBottom:'30px'}}>Price: <span style={{fontWeight:'bold'}}>{packagesTable.price}</span></Typography>
                                        {/* {subscription ? (
                                            <div>
                                                <Button variant="contained"> Subscribed </Button>
                                                <Button variant="contained" >Cancel</Button>
                                            </div>
                                            ) : (
                                            <Button variant="contained">
                                                Subscribe
                                            </Button>
                                        )} */}
                                        <Button variant="contained" >Subscribe</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Stack>
                </Paper>
            </div>
        </div>
    );
}
