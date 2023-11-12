import { useState } from 'react'
import reactLogo from './assets/react.svg'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/Login'
import DoctorHome from './components/doctorComponents/DoctorHome'
import AdminHome from './components/AdminHome'
import PatientHome from './components/PatientHome'
import DoctorRegister from './components/doctorComponents/DoctorRegister'
import PatientRegister from './components/PatientRegister'
import DoctorInfo from './components/doctorComponents/DoctorInfo'
import DoctorPatients from './components/doctorComponents/DoctorPatients'
import DoctorAppointments from './components/doctorComponents/DoctorAppointments'
import DoctorFollowUp from './components/doctorComponents/DoctorFollowUp'
function App() {
  let id=0;
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/doctor/home" element={<DoctorHome/>} />
        <Route path="/doctor/edit" element={<DoctorInfo/>} />
        <Route path="/doctor/patients" element={<DoctorPatients/>} />
        <Route path="/doctor/appointments" element={<DoctorAppointments/>} />
        <Route path="/doctor/followup/:id" element={<DoctorFollowUp  />}/>
        <Route path="/admin/home" element={<AdminHome/>} />
        <Route path="/patient/home" element={<PatientHome/>} />
        <Route path="/register/doctor" element={<DoctorRegister/>} />
        <Route path="/register/patient" element={<PatientRegister/>} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
