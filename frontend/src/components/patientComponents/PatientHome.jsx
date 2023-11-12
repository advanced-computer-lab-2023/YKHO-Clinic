import React from 'react';
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'



const PatientHome = () => {
    const [result, setResult] = useState(false);
    useEffect(() => { check() }, []);
    async function check() {

        const res = await axios.get("http://localhost:3000/loggedIn", {
            withCredentials: true
        }).then((res) => {

            if (res.data.type != "patient") {

                window.location.href = "/"
            }
            else {
                setResult(true)
            }
        }
        ).catch((err) => {
            if (err.response.status == 401) {
                window.location.href = "/"
            }
        })
    }
    function handlePrescriptions() {
        window.location.href = "/patient/Prescriptions"
    }
    function handleHealthRecords() {
        window.location.href = "/patient/HealthRecords"
    }
    function handleAppointments() {
        window.location.href = "/patient/Appointments"
    }
    function handleHistory() {
        window.location.href = "/patient/medicalHistory"
    }
    function handleLinkFamily() {
        window.location.href = "/patient/LinkFamily"
    }
    function handleManageFamily() {
        window.location.href = "/patient/readFamilyMembers"
    }
    return (
        <div>
            {result && <div>
                <button id="infoButton" onClick={handlePrescriptions}>
                    View Prescriptions
                </button>
                <br />
                <button id="patientsButton" onClick={handleAppointments}>
                    View Appointments
                </button>
                <br />
                <button id="Allapp" onClick={handleHealthRecords}>
                    View HealthRecords
                </button>
                <br />
                <button id="time" onClick={handleHistory}>
                    View my medical history
                </button>
                <br />
                <button id="time" onClick={handleLinkFamily}>
                    Link Family Members
                </button>
                <br />
                <button id="time" onClick={handleManageFamily}>
                    manage family members
                </button>
                <br />
            </div>}
        </div>
    );
};

export default PatientHome;
