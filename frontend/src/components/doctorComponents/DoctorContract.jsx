import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Typography from '@mui/material/Typography';
import { Button, Card, CardActions, Checkbox, Snackbar } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
const DoctorContract = () => {
    
    const [result,setResult]=useState(false);
    const [message, setMessage] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    useEffect(() => {
        check();
    }, []);
    async function check(){
        
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
        await axios.get("http://localhost:3000/doctor/contract",{
            withCredentials:true
        }).then((res)=>{
            if(res.data.contract=="acc"){
                window.location.href="/doctor/home"
            }
            else if(res.data.contract=="rej"){
                setResult(true)
            }
        }).catch((err)=>{
            console.log(err);
        }
            )
    }
    function changeCheck(){
        setIsChecked(!isChecked);
    }
    async function acceptContract() {
        if(isChecked){
        const res = await axios.get("http://localhost:3000/doctor/contract?accept=accept", {
            withCredentials: true
        }).then((res) => {
            window.location.href = "/doctor/home"
        }).catch((err) => {
            console.log(err);
        })
        }
    else{
        setMessage("Please accept the contract to continue")
    }
    }
            return (
                result&&<>  
                <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }} 
                open={message != ""}
                autoHideDuration={6000}
                onClose={() => {
                    setMessage("");
                }}
                message={message}>
                    <Alert severity="error">{message}</Alert>
                </Snackbar>  
                <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Card  sx={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",width:"80%",marginTop:"3%"}}>
                <Box bgcolor={"primary.main"} sx={{width:"100%", py:3}}>
                <Typography  variant="h4" sx={{textAlign:"center",color:"white"}}>
                    Welcome to El7a2ny
                </Typography>
                <Typography  variant="h6" sx={{textAlign:"center",color:"white"}}>
                    In order to use our services you have to sign a contract with us
                </Typography>
                </Box>
                <div style={{height:"60vh",overflowY: 'scroll', marginBottom:10}}>
                <Typography>By checking the box below, you agree to the terms and conditions of this contract:</Typography>
                    <Typography style={{ }}>
                        DOCTOR EMPLOYMENT AGREEMENT
                        <br />
                        <br />
                        This Employment Agreement ("Agreement") is entered into on Today's date between El7a2ny (hereinafter referred to as the
                        "Clinic") and Yourself (hereinafter referred to as the "Doctor").
                        <br />
                        <br />
                        1. POSITION
                        <br />
                        <br />
                        The Clinic hereby employs the Doctor as a Practicing Doctor in the Clinic's medical practice.
                        <br />
                        <br />
                        2. COMPENSATION
                        <br />
                        <br />
                        2.1. The Clinic may add a markup on medical services and products provided by the Doctor, which shall be determined
                        by the Clinic and disclosed to the Doctor. The markup is intended to cover clinic operating expenses and generate a
                        reasonable profit.
                        <br />
                        <br />
                        3. RESPONSIBILITIES
                        <br />
                        <br />
                        3.1. The Doctor shall provide medical services to patients in accordance with applicable laws, regulations, and
                        ethical standards.
                        <br />
                        <br />
                        3.2. The Doctor shall abide by all clinic policies, protocols, and quality standards.
                        <br />
                        <br />
                        3.3. The Doctor agrees to maintain appropriate records of patient care and cooperate with the Clinic in billing and
                        insurance-related matters.
                        <br />
                        <br />
                        4. TERM
                        <br />
                        <br />
                        This Agreement shall begin on Today's date and continue until terminated by either party with a written notice of 30
                        days in accordance with the termination provisions outlined below.
                        <br />
                        <br />
                        5. TERMINATION
                        <br />
                        <br />
                        5.1. Termination for Cause: The Clinic may terminate this Agreement immediately for cause, including but not limited
                        to professional misconduct, gross negligence, or violation of clinic policies.
                        <br />
                        <br />
                        5.2. Termination Without Cause: The Clinic or the Doctor may terminate this Agreement without cause upon 30 days'
                        written notice.
                        <br />
                        <br />
                        6. CONFIDENTIALITY
                        <br />
                        <br />
                        The Doctor shall maintain the confidentiality of patient records and other sensitive information in accordance with
                        applicable privacy laws and clinic policies.
                        <br />
                        <br />
                        7. NON-COMPETE
                        <br />
                        <br />
                        During the term of this Agreement and for a period of 3 months following termination, the Doctor shall not engage in
                        any medical practice or clinic that competes with the Clinic within a 10 kilometer radius.
                        <br />
                        <br />
                        8. GOVERNING LAW
                        <br />
                        <br />
                        This Agreement shall be governed by and construed in accordance with the laws of Egypt.
                        <br />
                        <br />
                        9. ENTIRE AGREEMENT
                        <br />
                        <br />
                        This Agreement contains the entire understanding between the parties and supersedes all prior agreements and
                        understandings, whether oral or written.
                        <br />
                        <br />
                        10. AMENDMENTS
                        <br />
                        <br />
                        This Agreement may be amended only in writing and signed by both parties.
                        <br />
                        <br />
                        IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.
                        <br />
                    </Typography>
                </div>
                        
                <FormControlLabel control={<Checkbox onChange={changeCheck} />} label="I agree to the terms and conditions of this contract." />
                <CardActions>
                    <Button variant="contained" onClick={acceptContract}>submit</Button>
                </CardActions>
                </Card>
                
                </div>
                </> 
            );
        };

        export default DoctorContract;

