import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import Navbar from './patientComponents/Navbar'

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import VideocamIcon from '@mui/icons-material/Videocam';
import Button from '@mui/material/Button';


import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import io from 'socket.io-client';
const socket = io.connect("http://localhost:3000");

function Chats() {
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState(false);
    const [chats, setChats] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [index, setIndex] = useState(-1);
    const [isPatient, setIsPatient] = useState(false);
    const [text, setText] = useState("");
    const chatsRef = useRef(chats);
    const indexRef = useRef(index);
    const contactsRef = useRef(contacts);

    //video
    const [incoming, setIncoming] = useState(false);
    const [outgoing, setOutgoing] = useState(false);
    const [caller, setCaller] = useState("caller");
    const [room, setRoom] = useState("")
    const roomRef = useRef(room);

    const call = async () => {
        setCaller(chats[index].name);
        setOutgoing(true);

        setRoom(chats[index].room)

        let data = {
            room: chats[index].room,
        }

        await socket.emit("outgoing", data)
    }

    const answer = async () => {
        console.log('accept');
        setIncoming(false);
        console.log("go to ", room)

        let data = {
            room: room,
        }

        await socket.emit("answered", data)

        let url = "https://gotalk.to/" + room.substring(0, 24);

        window.open(url, '_blank');
    }

    const decline = async () => {
        console.log('decline')
        setIncoming(false);

        let data = {
            room
        }

        await socket.emit("declined", data)
    }

    useEffect(() => {
        chatsRef.current = chats;
        indexRef.current = index;
        contactsRef.current = contacts;
        roomRef.current = room
    }, [chats, index, contacts, room])

    useEffect(() => { check(), fetch() }, []);
    async function check() {
        const res = await axios.get("http://localhost:3000/loggedIn", {
            withCredentials: true
        }).then((res) => {
            if (res.data.type != "patient" && res.data.type != 'doctor') {
                window.location.href = "/"
            }
            else {
                setResult(true)
                if (res.data.type == 'patient') {
                    setIsPatient(true);
                }
            }
        }
        ).catch((err) => {
            if (err.response.status == 401) {
                window.location.href = "/"
            }
        })
    }

    const fetch = async () => {
        // fetch chats
        await axios.get("http://localhost:3000/chats", {
            withCredentials: true
        }).then((res) => {
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
                let chat = data[i];
                let groups = [];
                let j = 0;
                while (j < chat.messages.length) {
                    let group = {
                        isPatient: chat.messages[j].isPatient,
                        messages: []
                    };
                    while (j < chat.messages.length && chat.messages[j].isPatient == group.isPatient) {
                        group.messages.push(j++);
                    }
                    groups.push(group);
                }
                data[i].groups = groups;
            }
            setChats(data);
            for (let i = 0; i < data.length; i++) {
                joinRoom(data[i].room);
            }
        }
        ).catch((err) => {
            console.log(err);
        })

        // fetch contacts
        await axios.get("http://localhost:3000/contacts", {
            withCredentials: true
        }).then((res) => {
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
                joinRoom(data[i].room)
            }

            setContacts(data);
        }
        ).catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            data.time = new Date(data.time).getHours() + ":" + new Date(data.time).getMinutes()

            // chats - chatsRef.current
            let tempChats = [...chatsRef.current];

            let found = false;
            for (let i = 0; i < tempChats.length; i++) {
                if (tempChats[i].room == data.room) {
                    tempChats[i].messages.push(data)

                    if (i != indexRef.current) {
                        tempChats[i].unread = tempChats[i].unread + 1;
                    }

                    let n = tempChats[i].groups.length;

                    if (n > 0 && tempChats[i].groups[n - 1].isPatient == data.isPatient) {
                        tempChats[i].groups[n - 1].messages.push(tempChats[i].messages.length - 1)
                    }
                    else {
                        let group = {
                            isPatient: data.isPatient,
                            messages: [tempChats[i].messages.length - 1]
                        }
                        tempChats[i].groups.push(group)
                    }


                    found = true;
                    break;
                }
            }

            if (!found) {
                // create new conversation
                let tempContacts = [...contactsRef.current];
                let name;

                for (let i = 0; i < tempContacts.length; i++) {
                    if (tempContacts[i].room == data.room) {
                        name = tempContacts.splice(i, 1)[0].name;
                        break;
                    }
                }
                setContacts(tempContacts);


                let chat = {
                    room: data.room,
                    groups: [
                        {
                            isPatient: data.isPatient,
                            messages: [0]
                        }
                    ],
                    messages: [data],
                    name,
                    unread: 1
                }

                tempChats.push(chat);
            }

            setChats(tempChats)

        })

        socket.on("incoming", (room) => {
            setIncoming(true);
            setRoom(room);
            // get name
            let name;
            let found = false;

            for (let i = 0; i < chatsRef.current.length; i++) {
                if (room == chatsRef.current[i].room) {
                    name = chatsRef.current[i].name;
                    found = true;
                    break;
                }
            }

            if (!found) {
                for (let i = 0; i < contactsRef.current.length; i++) {
                    if (room == contactsRef.current[i].room) {
                        name = contactsRef.current[i].name;
                        break;
                    }
                }
            }

            setCaller(name);
        })

        socket.on("answered", () => {
            setOutgoing(false);
            console.log("go")
            let url = "https://gotalk.to/" + roomRef.current.substring(0, 24);
            window.open(url, '_blank');
        })

        socket.on("declined", () => {
            console.log("false")
            setOutgoing(false);
        })

    }, [socket])


    const joinRoom = (room) => {
        socket.emit("join_room", room)
    }

    function generate() {
        const characters = '0123456789ABCDEF';
        let result = '';

        for (let i = 0; i < 24; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }


    const send = async () => {
        if (message != "" && index != null) {
            const data = {
                room: chats[index].room,
                text,
                isPatient,
                time: new Date(Date.now())
            }
            await socket.emit("send_message", data)

            delete data.room;
            data._id = generate();
            data.time = data.time.getHours() + ":" + data.time.getMinutes();

            // update chats
            let tempChats = [...chats];

            tempChats[index].messages.push(data)

            let n = tempChats[index].groups.length;

            if (n > 0 && tempChats[index].groups[n - 1].isPatient == isPatient) {
                tempChats[index].groups[n - 1].messages.push(tempChats[index].messages.length - 1)
            }
            else {
                let group = {
                    isPatient,
                    messages: [tempChats[index].messages.length - 1]
                }
                tempChats[index].groups.push(group)
            }
            setChats(tempChats);
            setText("");
        }
    }


    const openConversation = async (room) => {
        let unread = false
        for (let i = 0; i < chats.length; i++) {
            if (chats[i].room == room) {
                if (chats[i].unread > 0) {
                    unread = true;
                    let temp = [...chats];
                    temp[i].unread = 0;
                    for (let j = 1; j <= temp[i].unread; j++) {
                        temp[i].messages[temp[i].messages.length - j].unread = false;
                    }
                    setChats(temp);
                }
                setIndex(i);
            }
        }

        if (unread) {
            await axios.post("http://localhost:3000/read", {
                room
            },
                { withCredentials: true })
                .then(function (res) {

                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    const handleOpen = async () => {
        setOpen(true);
    }



    const start = async (room) => {
        let tempContacts = [...contacts];
        let name;
        for (let i = 0; i < tempContacts.length; i++) {
            if (tempContacts[i].room == room) {
                name = tempContacts.splice(i, 1)[0].name;
                break;
            }
        }
        setContacts(tempContacts);

        await axios.post("http://localhost:3000/start", {
            room
        },
            { withCredentials: true })
            .then(function (res) {

                let tempChats = [...chats];

                let chat = {
                    room: res.data.room,
                    groups: [],
                    messages: [],
                    name,
                    unread: 0
                }

                tempChats.push(chat);
                setChats(tempChats);
                setIndex(tempChats.length - 1);
            })
            .catch(function (error) {
                console.log(error);
            });

        setOpen(false);
    }


    return (
        <>
            {result &&
                <>
                    <Navbar />
                    <Grid container spacing={0} sx={{ minHeight: 'calc(100vh - 64px)' }}>
                        <Grid item xs={4} sx={{ borderRight: 2, borderColor: 'primary.main' }}>
                            <List sx={{ overflowY: 'auto', padding: 0 }}>
                                <ListSubheader
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        py: '8px',
                                        fontSize: 16,
                                        fontWeight: 'medium',
                                        lineHeight: '24px',
                                        bgcolor: 'primary.dark',
                                        color: 'primary.contrastText',
                                    }}
                                >
                                    Chats
                                    <IconButton
                                        size="large"
                                        color="inherit"
                                        onClick={handleOpen}
                                    >
                                        <AddBoxIcon />
                                    </IconButton>
                                </ListSubheader>
                                {
                                    chats.length > 0 &&
                                    chats.map((chat) => (
                                        <ListItem sx={{}} key={chat.room} button divider onClick={() => { openConversation(chat.room) }}>
                                            <ListItemText
                                                primary={chat.name}
                                                secondary={(chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : "start chatting")}
                                            />
                                            {chat.unread > 0 && isPatient != chat.isPatient &&
                                                <ListItemAvatar sx={{ minWidth: '0', padding: '12px' }}>
                                                    <Avatar sx={{ width: 24, height: 24, fontSize: 16, bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
                                                        {chat.unread}
                                                    </Avatar>
                                                </ListItemAvatar>
                                            }
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </Grid>
                        <Grid item xs={8}>
                            {index != -1 &&
                                <>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: 'primary.dark', height: '64px', p: '10px 16px' }}>
                                        <div>
                                            <Typography variant="h6" sx={{ color: 'primary.contrastText', fontSize: "16px" }}>
                                                {chats[index].name}
                                            </Typography>
                                            {isPatient &&
                                                <Typography variant="subtitle1" sx={{ color: 'primary.contrastText', fontSize: '12px', mt: '-3px' }}>
                                                    {chats[index].speciality}
                                                </Typography>
                                            }
                                        </div>
                                        <IconButton onClick={call}>
                                            <VideocamIcon sx={{ color: 'primary.contrastText' }} />
                                        </IconButton>
                                    </Box>
                                    <Box sx={{ overflowY: 'auto', height: 'calc(100vh - 224px)', bgcolor: 'AliceBlue', p: "16px" }}>
                                        {chats[index].messages.length > 0 &&
                                            chats[index].groups.map((group) => (
                                                <Stack key={group.messages[0]} direction="column" alignItems={group.isPatient && isPatient || !group.isPatient && !isPatient ? "flex-end" : "flex-start"} spacing={1}>
                                                    {group.messages.map((message) => (
                                                        <Paper key={message} sx={{ p: '8px 16px' }} >
                                                            <Typography variant="body1">
                                                                {chats[index].messages[message].text}
                                                            </Typography>
                                                            <Typography variant="caption">
                                                                {chats[index].messages[message].time}
                                                            </Typography>
                                                        </Paper>
                                                    ))}
                                                </Stack>
                                            ))
                                        }
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            px: '16px',
                                            height: '96px',
                                            bgcolor: 'primary.light',
                                            color: "white"
                                        }}
                                    >
                                        <TextField value={text} fullWidth id="message" sx={{ input: { color: 'primary.contrastText' }, borderRadius: '5px', bgcolor: "primary.dark", height: '56px', width: '100%', fontSize: '21px' }} onChange={(e) => { setText(e.target.value) }} />
                                        <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '56px', width: '65.67px', ml: '16px', bgcolor: 'primary.dark' }}>
                                            <IconButton onClick={send}>
                                                <SendIcon sx={{ color: 'primary.contrastText' }} />
                                            </IconButton>
                                        </Paper>
                                    </Box>
                                </>
                            }
                        </Grid>
                    </Grid>
                    <Dialog onClose={() => { setOpen(false) }} open={open}>
                        <DialogTitle>start chatting</DialogTitle>
                        {contacts.length > 0 &&
                            <List sx={{ pt: 0 }}>
                                {contacts.map((contact) => (
                                    <ListItem disableGutters key={contact.room}>
                                        <ListItemButton onClick={() => { start(contact.room) }}>
                                            <ListItemText primary={contact.name} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        }
                    </Dialog>
                    <Dialog
                        open={outgoing}
                        onClose={() => {
                            setOutgoing(false);
                        }}
                    >
                        <DialogTitle>
                            {`calling ${caller}`}
                        </DialogTitle>
                    </Dialog>
                    <Dialog
                        open={incoming}
                        onClose={decline}
                    >
                        <DialogTitle>
                            {`${caller} is calling`}
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={decline}>Decline</Button>
                            <Button onClick={answer} autoFocus>
                                Answer
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            }
        </>
    );
}

export default Chats;