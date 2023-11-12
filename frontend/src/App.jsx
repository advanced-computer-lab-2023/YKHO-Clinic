import { useState } from 'react'
import reactLogo from './assets/react.svg'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/Login'
import DoctorHome from './components/doctorComponents/DoctorHome'
import AdminHome from './components/AdminHome'
import PatientHome from './components/patientComponents/PatientHome'
import DoctorRegister from './components/doctorComponents/DoctorRegister'
import PatientRegister from './components/PatientRegister'
import DoctorInfo from './components/doctorComponents/DoctorInfo'
import DoctorPatients from './components/doctorComponents/DoctorPatients'
import DoctorAppointments from './components/doctorComponents/DoctorAppointments'
import PatientPrescriptions from './components/patientComponents/PatientPrescriptions'
import PatientAppointment from './components/patientComponents/PatientAppointment'
import PatientHealthRecords from './components/patientComponents/PatientHealthRecords'
import PatinetHistory from './components/patientComponents/PatientHistory'
import PatientLinkFamily from './components/patientComponents/PatientLinkFamily'
import PatientManageFamily from './components/patientComponents/PatientManageFamily'

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/doctor/home" element={<DoctorHome/>} />
        <Route path="/doctor/edit" element={<DoctorInfo/>} />
        <Route path="/doctor/patients" element={<DoctorPatients/>} />
        <Route path="/doctor/appointments" element={<DoctorAppointments/>} />
        <Route path="/admin/home" element={<AdminHome/>} />
        <Route path="/patient/home" element={<PatientHome/>} />
        <Route path="/patient/Prescriptions" element={<PatientPrescriptions/>} />
        <Route path="/patient/Appointments" element={<PatientAppointment/>} />
        <Route path="/patient/HealthRecords" element={<PatientHealthRecords/>} />
        <Route path="/patient/medicalHistory" element={<PatinetHistory/>} />
        <Route path="/patient/LinkFamily" element={<PatientLinkFamily/>} />
        <Route path="/patient/readFamilyMembers" element={<PatientManageFamily/>} />
        <Route path="/register/doctor" element={<DoctorRegister/>} />
        <Route path="/register/patient" element={<PatientRegister/>} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
