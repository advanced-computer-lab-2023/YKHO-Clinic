import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientManageFamily = () => {
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
    return (
        <div>
            {result && <div>
                <h1>Manage Family</h1>
            </div>}
        </div>
    )
}

export default PatientManageFamily;