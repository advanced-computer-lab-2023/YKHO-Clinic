import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './Navbar'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';


import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';

import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

const PatientManageFamily = () => {
    const [result, setResult] = useState(false);
    const [members, setMembers] = useState([]);
    const [add, setAdd] = useState(false);
    const [link, setLink] = useState(false)

    useEffect(() => { check(), fetch() }, []);
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

    async function fetch() {

        const res = await axios.get("http://localhost:3000/patient/readFamilyMembersSubscriptions", {
            withCredentials: true
        }).then((res) => {
            console.log(res.data)
            setMembers(res.data);
        }
        ).catch((err) => {
            console.log(err);
        })
    }

    const subscribe = (nationalID) => {
        window.location.href = `/patient/healthPackages/${nationalID}`
    }

    const cancel = (nationlID) => {

    }

    const view = async (name) => {

    }

    return (
        <>
            {result &&
                <>
                    <Navbar />
                    <Stack spacing={2} sx={{ p: '32px' }} >
                        <Paper elevation={1} onClick={() => { setAdd(true) }} sx={{ height: '144px', px: "32px", display: 'flex', alignItems: 'center' }}>
                            <IconButton aria-label="delete" size="large" >
                                <AddCircleOutlineIcon />
                            </IconButton>
                            <Typography variant="h6" gutterBottom>
                                Add a family member
                            </Typography>
                        </Paper>
                        <>
                            {members.length > 0 &&
                                members.map((member) => (
                                    <Paper key={member.nationalID} elevation={1} onClick={() => { setAdd(true) }} sx={{ px: '32px', height: '144px', display: 'flex', alignItems: 'center' }}>
                                        <Grid container spacing={0} >
                                            <Grid item xs={3} sx={{ borderRight: 2, borderColor: 'primary.main' }}>
                                                <Box sx={{ px: '32px' }}>
                                                    <Typography variant="h5" gutterBottom>
                                                        {member.name}
                                                    </Typography>
                                                    <Typography variant="subtitle" sx={{ color: 'primary.dark' }}>
                                                        {member.relation}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item>
                                                <Box sx={{ px: '32px' }}>
                                                    <Typography variant="h6" gutterBottom>
                                                        {member.state == "unsubscribed" &&
                                                            "not subscribed for a package yet!"
                                                        }
                                                        {(member.state == "subscribed" || member.state == "cancelled") &&
                                                            `enojoying ${member.healthPackage} till ${member.endDate}`
                                                        }
                                                    </Typography>
                                                    <Stack direction='row'>
                                                        {member.state == "unsubscribed" &&
                                                            <Button variant="contained" onClick={() => { subscribe(member.nationalID) }}>
                                                                subscribe
                                                            </Button>
                                                        }
                                                        {(member.state == "subscribed" || member.state == "cancelled") &&
                                                            <Button variant="contained" onClick={() => { view(member.nationalID) }}>
                                                                view package
                                                            </Button>
                                                        }
                                                        {member.state == "subscribed" &&
                                                            <Button variant="contained" onClick={() => { cancel(member.nationalID) }}>
                                                                cancel
                                                            </Button>
                                                        }
                                                    </Stack>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                ))
                            }
                        </>

                    </Stack>
                    <Dialog open={add} onClose={() => { setAdd(false) }}>
                        <DialogTitle>Subscribe</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To subscribe to this website, please enter your email address here. We
                                will send updates occasionally.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Email Address"
                                type="email"
                                fullWidth
                                variant="standard"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { setAdd(false) }}>Cancel</Button>
                            <Button onClick={() => { setAdd(false) }}>Subscribe</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={link} onClose={() => { setLink(false) }}>
                        <DialogTitle>Subscribe</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To subscribe to this website, please enter your email address here. We
                                will send updates occasionally.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Email Address"
                                type="email"
                                fullWidth
                                variant="standard"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { setLink(false) }}>Link</Button>
                        </DialogActions>
                    </Dialog>
                </>
            }
        </>
    )
}

export default PatientManageFamily;