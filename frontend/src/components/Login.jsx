
import React from 'react'
import axios from 'axios'
import { useState ,useEffect} from 'react'
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
        //redirect to doctor home page
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
    return(
        <div>
            {result&&<div>
            
                <input name="username" type="text" placeholder="username" />
                <input name="password" type="password" placeholder="password" />
                <button onClick={handleLogin}>Login</button>
                <br/>
                <button onClick={handleDoctor}>register doctor</button>
                <br/>
                <button>register patient</button>
                {error && <p>{error}</p>}
            </div>}
        </div>
    )
}
export default Login