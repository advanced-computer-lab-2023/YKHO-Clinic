import axios from 'axios';
import { React, useState } from 'react';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


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
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };
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
  

  //dynamically retrieve the username from the backend
  return (
    <div>

      <title>Home</title>
      <h1>Welcome , Admin Home page</h1>
      <Box bgcolor="primary.main" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ width: '70px' }}
        animate={{ width: '310px' }}
        exit={{ width: '70px' }}
        transition={{ duration: 0.3 }}
        style={{ backgroundColor: 'secondary.main', overflow: 'hidden' }}
      >
        <div style={{ marginLeft: 8 }}>
          <IconButton onClick={toggleFilter}>
            <MenuIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</Box>
{/* <div>
  <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>name</TableCell>
            <TableCell>email</TableCell>
            <TableCell>DOB</TableCell>
            <TableCell>mobile</TableCell>
            <TableCell>rate</TableCell>
            <TableCell>affiliation</TableCell>
            <TableCell>education</TableCell>
            </TableRow>
            </TableHead>
          <TableBody>
            {requests.map((requestsTable) => (
              <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
            
            <TableRow key={requestsTable._id}>
              <TableCell>{requestsTable.name}</TableCell>
              <TableCell>{requestsTable.email}</TableCell>
              <TableCell>{new Date(requestsTable.DOB).toISOString().split('T')[0]}</TableCell>
              <TableCell>{requestsTable.mobile}</TableCell>
              <TableCell>{requestsTable.rate}</TableCell>
              <TableCell>{requestsTable.affiliation}</TableCell>
              <TableCell>{requestsTable.education}</TableCell>
              <TableCell>
                <a href={`http://localhost:3000/admin/uploadedInfo/${requestsTable._id}/${"id"}`} download>
                  Download
                </a>
              </TableCell>
              <TableCell>
                <a href={`http://localhost:3000/admin/uploadedInfo/${requestsTable._id}/${"medicalLicense"}`} download>
                  Download
                </a>
              </TableCell>
              <TableCell>
                <a href={`http://localhost:3000/admin/uploadedInfo/${requestsTable._id}/${"medicalDegree"}`} download>
                  Download
                </a>
              </TableCell>      
              <TableCell>
                <button id={requestsTable.email} onClick={AcceptButton}>Accept</button>
                <button id={requestsTable.email} onClick={RejectButton}>Reject</button>
              </TableCell>
            </TableRow>
          ))}
          
          </TableBody>
        </Table>
      </TableContainer>
        <p>{error}</p>
    </div> */}
      <Button variant='contained' style={{marginRight: '190px'}} id="createAdminButton" onClick={createAdminButton}>Create A New Admin</Button>
      <Button variant='contained' style={{marginRight: '190px'}} id="deleteUserButton" onClick={deleteUserButton}>Delete A Doctor/Patient/Admin</Button>
      <button onClick={uploadedInfoButton} id="uploadedInfoButton">View doctors uploaded info</button>
      <button onClick={healthPackagesButton} id="healthPackagesButton">health packages</button>
      <button id="logoutButton">Logout</button>
    </div>
  );
}
