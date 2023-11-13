import { React, useState, useEffect } from "react";
import axios from "axios";

function DoctorUploadedInfo() {
    const [error, setError] = useState("");
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        getRequests();
    }, []);

    async function getRequests() {
        try {
            const res = await axios.get("http://localhost:3000/getRequests", {
                withCredentials: true
            });
          
            setRequests(res.data.requests);
        } catch (err) {
            setError(err.data.message);
        }
    }

    async function AcceptButton(e) {
        try {
            const res = await axios.post("http://localhost:3000/admin/acceptRequest", {
                email: e.target.id
            }, {
                withCredentials: true
            });
            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    }
    async function RejectButton(e) {
        try {
            const res = await axios.post("http://localhost:3000/admin/rejectRequest", {
                email: e.target.id
            }, {
                withCredentials: true
            });
            window.location.reload();
        } catch (err) {
            setError(err.data.message);
        }
    }

    return (
      <div>
        <table>
            <tr>
            <th>name</th>
            <th>email</th>
            <th>DOB</th>
            <th>mobile</th>
            <th>rate</th>
            <th>affiliation</th>
            <th>education</th>
            </tr>
            {requests.map((requestsTable) => (
          <tr>
            <td>{requestsTable.name}</td>
            <td>{requestsTable.email}</td>
            <td>{new Date(requestsTable.DOB).toISOString().split('T')[0]}</td>
            <td>{requestsTable.mobile}</td>
            <td>{requestsTable.rate}</td>
            <td>{requestsTable.affiliation}</td>
            <td>{requestsTable.education}</td>
            <td>
                <a href={`http://localhost:3000/admin/uploadedInfo/${requestsTable._id}/${"id"}`} download>
                    Download
                </a>
            </td>
            <td>
                <a href={`http://localhost:3000/admin/uploadedInfo/${requestsTable._id}/${"medicalLicense"}`} download>
                    Download
                </a>
            </td>
            <td>
                <a href={`http://localhost:3000/admin/uploadedInfo/${requestsTable._id}/${"medicalDegree"}`} download>
                    Download
                </a>
            </td>      
            <td>
              <button id={requestsTable.email} onClick={AcceptButton}>Accept</button>
              <button id={requestsTable.email} onClick={RejectButton}>Reject</button>
            </td>
          </tr>
        ))}
        </table>
        <p>{error}</p>
      </div>
    );
  }

export default DoctorUploadedInfo;