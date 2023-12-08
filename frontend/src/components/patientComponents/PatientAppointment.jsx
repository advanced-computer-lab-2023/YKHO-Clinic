import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientAppointments = () => {
    const [result, setResult] = useState(false);
    useEffect(() => { check(), loadAppointments() }, []);
    useEffect(() => { setSearchBox(); }, [result]);
    const [appointments, setAppointments] = useState([]);
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

    async function loadAppointments() {
        await axios.get("http://localhost:3000/patient/Appointments", { withCredentials: true }).then((res) => {

            setAppointments(res.data.result);
        }
        ).catch((err) => {
            console.log(err);
        });
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
            const radioButtons = document.querySelectorAll('input[type="radio"][name="filters"]');
            radioButtons.forEach(function (radioButton) {
                let prevChecked = false; // Initialize a variable to track the previous checked state

                radioButton.addEventListener('click', function () {
                    if (prevChecked) {
                        // Deselect the clicked radio button
                        this.checked = false;
                    }
                    prevChecked = this.checked; // Update the previous checked state
                });
            });
        }
    }
    async function searchAppointments() {
        const searchValueInput = document.getElementById('searchvalue');
        const filterDropdown = document.getElementById('filter');
        const radioButtons = document.querySelectorAll('input[type="radio"][name="filters"]');

        let searchvalue = searchValueInput.value;
        let filter = filterDropdown.value;
        let status;
        radioButtons.forEach(function (radioButton) {
            if (radioButton.checked) {
                status = radioButton.value;
            }
        })

            ;
        await axios.get(`http://localhost:3000/patient/AppointmentsFilter/?filter=${filter}&searchvalue=${searchvalue}&filters=${status}`, { withCredentials: true }).then((res) => {
            setAppointments(res.data.result);
        }
        ).catch((err) => {
            console.log(err);
        });
    }
    async function SchedFollow(e) {
        window.location.href = `/patient/followup/${e.target.id}`
    }
    return (
        <div>
            {result && <div>
                <h1>Your Appointments</h1>
                <label htmlFor="filter">Search By</label>
                <select id="filter" name="filter">
                    <option value="Status">Status</option>
                    <option value="Date">Date</option>
                </select>
                <label htmlFor="searchvalue">With value</label>
                <input id="searchvalue" type="text" name="searchvalue" />
                <br />
                <input type="radio" id="upcoming" name="filters" value="upcoming" />
                <label htmlFor="upcoming">Upcoming Appointments</label>
                <br />
                <input type="radio" id="past" name="filters" value="past" />
                <label htmlFor="past">Past Appointments</label>
                <br />
                <button type="submit" onClick={searchAppointments} style={{ display: "block" }}>
                    Search
                </button>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment) => (
                            <tr>
                                <td id={appointment._id}> {appointment.doctorID.name} </td>
                                <td id={appointment._id}> {appointment.date.split('T')[0]} </td>
                                <td id={appointment._id}> {appointment.status} </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>}
        </div>
    );
}

export default PatientAppointments;