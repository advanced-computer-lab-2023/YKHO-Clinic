import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientPrescriptions = () => {
    const [result, setResult] = useState(false);
    const [prescriptions, setPrescriptions] = useState([]);
    const [onePatient, setOnePatient] = useState(false);
    useEffect(() => { check(), getPrescriptions()}, []);
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
    async function getPrescriptions() {
        try {
            const res = await axios.get("http://localhost:3000/patient/prescriptions", {
                withCredentials: true
            });
            setPrescriptions(res.data.result);
            setOnePatient(true);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div>
            {result && <div>
                <h1>Your prescriptions</h1>
                {onePatient && <div>
                    <label htmlFor="filter">Search By</label>
                    <select id="filter" name="filter">
                        <option value="DoctorName">DoctorName</option>
                        <option value="Date">Date</option>
                        <option value="Filled">Filled</option>
                    </select>
                    <label htmlFor="searchvalue">With value</label>
                    <input id="searchvalue" input="text" name="searchvalue" />
                    <button type="submit">Search</button>
                </div>
                }
                <table>
                    <thead>
                        <tr>
                            <th>name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prescriptions.map((prescription) => {
                            return (
                                <tr>
                                    <td id={prescription._id}> {prescription.prescriptionName} </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>}
        </div>
    )
}

export default PatientPrescriptions;