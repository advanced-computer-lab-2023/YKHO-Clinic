import axios from 'axios'
import { React, useState } from 'react'

export default function AdminHome() {
  const [error,setError]=useState("")

  function createAdminButton(){
    window.location.href="/admin/register"
  }

  function deleteUserButton(){
    window.location.href="/admin/deleteUser"
  }

  function uploadedInfoButton(){
    window.location.href="/admin/uploadedInfo"
  }

  function healthPackagesButton(){
    window.location.href="/admin/healthPackages"
  }

  function LogoutButton(){
    window.location.href="/"
  }

  //dynamically retrieve the username from the backend
  return (
    <div>

      <title>Home</title>
      <h1>Welcome , Admin Home page</h1>
      <button onClick={createAdminButton} id="createAdminButton">Create a new admin</button>
      <button onClick={deleteUserButton} id="deleteUserButton">Delete a doctor/patient/admin</button>
      <button onClick={uploadedInfoButton} id="uploadedInfoButton">View doctors' uploaded info</button>
      <button onClick={healthPackagesButton} id="healthPackagesButton">health packages</button>
      <button id="logoutButton">Logout</button>
    </div>
  );
}
