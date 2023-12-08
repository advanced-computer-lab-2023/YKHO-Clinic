import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientPrescriptions = () => {
    const [result, setResult] = useState(false);
    const [prescriptions, setPrescriptions] = useState([]);
    const [onePatient, setOnePatient] = useState(false);
    const [filtered, setFiltered] = useState(false);
    useEffect(() => { check(), getPrescriptions() }, []);
    useEffect(() => { setSearchBox(); }, [result]);
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
            setFiltered(false);
        } catch (err) {
            console.log(err);
        }
    }
    function setSearchBox() {

        const searchValueInput = document.getElementById('searchvalue');
        const filterDropdown = document.getElementById('filter');
        if (searchValueInput) {
            filterDropdown.addEventListener('change', function () {
                if (filterDropdown.value === 'Date') {
                    // Show the date input field when Date is selected
                    searchValueInput.type = 'date';

                } else {
                    // Show the text input field for other options
                    searchValueInput.type = 'text';
                }
            }
            );
        }
    }
    async function prescriptionFiltered() {
        try {
            const searchValueInput = document.getElementById('searchvalue');
            const filterDropdown = document.getElementById('filter');
            const res = await axios.get(`http://localhost:3000/Patient/PrescriptionsFiltered?filter=${filterDropdown.value}&searchvalue=${searchValueInput.value}`, {
                withCredentials: true
            });
            setPrescriptions(res.data.result);
            setOnePatient(false);
            setFiltered(false);
        } catch (err) {
            console.log(err);
        }
    }
    async function showThis(e) {
        try {
            const res = await axios.get(`http://localhost:3000/patient/Prescriptions/${e.target.id}`, {
                withCredentials: true
            });
            setPrescriptions(res.data.result);
            setOnePatient(false);
            setFiltered(true);
            // window.location.href = `/patient/Prescriptions/${e.target.id}`;
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
                    <select id="filter" name="filter" onInput={setSearchBox}>
                        <option value="DoctorName">DoctorName</option>
                        <option value="Date">Date</option>
                        <option value="Filled">Filled</option>
                    </select>
                    <label htmlFor="searchvalue">With value</label>
                    <input id="searchvalue" input="text" name="searchvalue" />
                    <button type="submit" onClick={prescriptionFiltered}>Search</button>
                </div>
                }

                {!filtered && <table>
                    <thead>
                        <tr>
                            <th>name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prescriptions.map((prescription) => {
                            return (
                                <tr>
                                    <td id={prescription._id} onClick={showThis}> {prescription.prescriptionName} </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>}
                {filtered && <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Doctor Name</th>
                            <th>Filled</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td> {prescriptions[0].prescriptionName} </td>
                            <td> {prescriptions[0].date.split("T")[0]} </td>
                            <td> {prescriptions[0].doctorName} </td>
                            <td> {prescriptions[0].filled? 'True' : 'False'}</td>
                        </tr>
                    </tbody>
                </table>}


            </div>}
        </div>
    )
}

export default PatientPrescriptions;