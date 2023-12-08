import axios from 'axios'
import { React, useState } from "react";

export default function AdminRegister() {
    const [error,setError]=useState("")

    async function CreateAdminButton() {
        const username=document.getElementsByName("username")[0].value
        const email=document.getElementsByName("email")[0].value
        const password=document.getElementsByName("password")[0].value
        await axios.post("http://localhost:3000/admin/register",{ 
            username:username, 
            email:email, 
            password:password,  
        },{withCredentials:true}).then((res)=>{ 
            setError(res.data.message) 
        }) 
    } 

  return (
    <div>
        <h1>New Admin Interface</h1>
        <input name="username" class="adminData" type="text" placeholder="username"/>
        <input name="email" class="adminData" type="email" placeholder="email"/>
        <input name="password" class="adminData" type="password" placeholder="password"/>
        <button onClick={CreateAdminButton} id="createAdminButton">Create Admin</button>
        <p>{error}</p>
    </div>
  )
}