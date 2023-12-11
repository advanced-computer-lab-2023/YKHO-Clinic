import { useState } from 'react'
import reactLogo from './assets/react.svg'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/Login'
import DoctorHome from './components/doctorComponents/DoctorHome'
import AdminHome from './components/adminComponents/AdminHome'
import AdminRegister from './components/adminComponents/AdminRegister'
import AdminDeleteUser from './components/adminComponents/AdminDeleteUser'
import AdminHealthPackages from'./components/adminComponents/adminHealthPackages'
import DoctorUploadedInfo from './components/adminComponents/DoctorUploadedInfo'
import PatientHome from './components/patientComponents/PatientHome'
import DoctorRegister from './components/doctorComponents/DoctorRegister'
import PatientRegister from './components/patientComponents/PatientRegister'
import DoctorInfo from './components/doctorComponents/DoctorInfo'
import DoctorPatients from './components/doctorComponents/DoctorPatients'
import DoctorAppointments from './components/doctorComponents/DoctorAppointments'
import DoctorFollowUp from './components/doctorComponents/DoctorFollowUp'
import PatientPrescriptions from './components/patientComponents/PatientPrescriptions'
import PatientAppointment from './components/patientComponents/PatientAppointment'
import PatientHealthRecords from './components/patientComponents/PatientHealthRecords'
import PatinetHistory from './components/patientComponents/PatientHistory'
import PatientLinkFamily from './components/patientComponents/PatientLinkFamily'
import PatientManageFamily from './components/patientComponents/PatientManageFamily'
import ChangePassword from './components/adminComponents/changePassword'

import DoctorTimeSlots from './components/doctorComponents/DoctorTimeSlots'
import DoctorContract from './components/doctorComponents/DoctorContract'
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
        <Route path="/doctor/followup/:id" element={<DoctorFollowUp  />} />
        <Route path="/doctor/timeslots" element={<DoctorTimeSlots/>} />
        <Route path="/doctor/contract" element={<DoctorContract/>} />
        <Route path="/admin/home" element={<AdminHome/>}/>
        <Route path="/admin/register" element={<AdminRegister/>}/>
        <Route path="/admin/deleteUser" element={<AdminDeleteUser/>}/>
        <Route path="/admin/uploadedInfo" element={<DoctorUploadedInfo/>}/>
        <Route path="/patient/home" element={<PatientHome/>} />
        <Route path="/patient/Prescriptions" element={<PatientPrescriptions/>} />
        <Route path="/patient/Appointments" element={<PatientAppointment/>} />
        <Route path="/patient/HealthRecords" element={<PatientHealthRecords/>} />
        <Route path="/patient/medicalHistory" element={<PatinetHistory/>} />
        <Route path="/patient/LinkFamily" element={<PatientLinkFamily/>} />
        <Route path="/patient/readFamilyMembers" element={<PatientManageFamily/>} />
        <Route path="/register/doctor" element={<DoctorRegister/>} />
        <Route path="/register/patient" element={<PatientRegister/>} />
        <Route path="/admin/healthPackages" element={<AdminHealthPackages/>} />
        <Route path='/admin/changePassword' element={<ChangePassword/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
