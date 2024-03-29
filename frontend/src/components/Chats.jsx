import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import NavbarPatient from './patientComponents/Navbar'
import NavbarDoctor from './doctorComponents/Navbar'
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
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import io from 'socket.io-client';
import { paginationClasses } from '@mui/material';
const socket = io.connect("http://localhost:3000");
//const socketShared = io.connect("http://localhost:8000");

function Chats() {
    // pharmacistChat
    const [pharmacistChat, setPharmacistChat] = useState();
    const [isFlag, setFlag] = useState(false);
    const [loading, setLoading] = useState(true);
    const pharmacistChatRef = useRef(pharmacistChat);

    useEffect(() => {
        pharmacistChatRef.current = pharmacistChat;
    }, [pharmacistChat])

    useEffect(() => {
        socket/*Shared*/.on("receive_message_pharmacist", (data) => {
            data.time = new Date(data.time).getHours() + ":" + new Date(data.time).getMinutes()
            data.isDoctor = false;


            // chats - chatsRef.current
            let temp = {
                doctorID: pharmacistChatRef.current.doctorID,
                unread: pharmacistChatRef.current.unread,
                messages: pharmacistChatRef.current.messages,
                groups: pharmacistChatRef.current.groups
            }
            
            temp.messages.push(data)
            temp.unread = 1 + temp.unread;

            let n = temp.groups.length;
            
            if (n > 0 && !temp.groups[n - 1].isDoctor) {
                temp.groups[n - 1].messages.push(temp.messages.length - 1)
            }
            else {
                let group = {
                    isDoctor: false,
                    messages: [temp.messages.length - 1]
                }
                temp.groups.push(group)
            }

            setPharmacistChat(temp);
        })

    }, [socket/*Shared*/])

    const fetchpharmacistChat = async () => {
        // fetch chats
        await axios.get("http://localhost:3000/pharmacistChat", {
            withCredentials: true
        }).then((res) => {
            let chat = res.data;

            let groups = [];
            let j = 0;
            while (j < chat.messages.length) {
                let group = {
                    isDoctor: chat.messages[j].isDoctor,
                    messages: []
                };
                while (j < chat.messages.length && chat.messages[j].isDoctor == group.isDoctor) {
                    group.messages.push(j++);
                }
                groups.push(group);
            }
            chat.groups = groups;

            setPharmacistChat(chat);
            setLoading(false)
            socket.emit("join_room", chat.doctorID)
            //socketServer.emit("join_room", chat.doctorID)
        }
        ).catch((err) => {
            console.log(err);
        })

    }

    const openPharmacist = async (room) => {
        setFlag(true);

        let temp = {
            doctorID: pharmacistChat.doctorID,
            unread: pharmacistChat.unread,
            messages: pharmacistChat.messages,
            groups: pharmacistChat.groups
        }
        
        if (temp.unread > 0) {
            for (let j = 1; j <= temp.unread; j++) {
                temp.messages[temp.messages.length - j].unread = false;
            }

            temp.unread = 0;
            setPharmacistChat(temp);

            await axios.get("http://localhost:3000/pharmacistRead", {
            withCredentials: true
        }).then((res) => {
        }
        ).catch((err) => {
            console.log(err);
        })
        }
    }

    const pharmacistSend = async () => {
        if (text != "" ) {
            const data = {
                room: pharmacistChat.doctorID,
                text,
                time: new Date(Date.now())
            }

            await socket.emit("send_message_pharmacist", data)

            delete data.room;
            data._id = generate();
            data.time = data.time.getHours() + ":" + data.time.getMinutes();
            data.unread = true;

            // update chats
            let temp = {
                doctorID: pharmacistChat.doctorID,
                unread: pharmacistChat.unread,
                messages: pharmacistChat.messages,
                groups: pharmacistChat.groups
            }
            
            temp.messages.push(data);
            let n = temp.groups.length;
            
            if (n > 0 && temp.groups[n - 1].isDoctor) {
                temp.groups[n - 1].messages.push(temp.messages.length - 1)
            }
            else {
                let group = {
                    isDoctor: true,
                    messages: [temp.messages.length - 1]
                }
                temp.groups.push(group)
            }

            setPharmacistChat(temp);
        }
    }

    // chat
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
    const [breadcrumbs, setBreadcrumbs] = useState([{}]);
    async function check() {
        const res = await axios.get("http://localhost:3000/loggedIn", {
            withCredentials: true
        }).then((res) => {
            if (res.data.type != "patient" && res.data.type != 'doctor') {
                if (res.data.type == "admin") {
                    window.location.href = "/admin/home"
                } else
                    window.location.href = "/"
            }
            else {
                setResult(true)
                if (res.data.type == 'patient') {
                    setIsPatient(true);
                }
                else {
                    fetchpharmacistChat();
                }
                //breadcrumbs
                let savedBreadcrumbs = JSON.parse(localStorage.getItem('breadcrumbs'));
                setBreadcrumbs(savedBreadcrumbs);

                const healthPackageBreadcrumb = { label: "chats", href: "/chats" };
                const hasHealthPackageBreadcrumb = savedBreadcrumbs.some(
                    (item) => item.label == healthPackageBreadcrumb.label
                );
                // If not, add it to the breadcrumbs
                if (!hasHealthPackageBreadcrumb) {
                    const updatedBreadcrumbs = [healthPackageBreadcrumb];
                    setBreadcrumbs(updatedBreadcrumbs);
                    localStorage.setItem('breadcrumbs', JSON.stringify(updatedBreadcrumbs));
                }
            }
        }
        ).catch((err) => {
            if (err.response.status == 401) {
                window.location.href = "/"
            }
        })
    }

    function handleBreadcrumbClick(event, breadcrumb) {
        event.preventDefault();
        // Find the index of the clicked breadcrumb in the array
        const index = breadcrumbs.findIndex((item) => item.label == breadcrumb.label);
        let updatedBreadcrumbs;
        if (index == -1) {
            updatedBreadcrumbs = ([...breadcrumbs, breadcrumb]);
        } else {
            // Slice the array up to the clicked breadcrumb (inclusive)
            updatedBreadcrumbs = breadcrumbs.slice(0, index + 1);
        }
        console.log(index);
        // Set the updated breadcrumbs
        setBreadcrumbs(updatedBreadcrumbs);

        // Save updated breadcrumbs to localStorage
        localStorage.setItem('breadcrumbs', JSON.stringify(updatedBreadcrumbs));

        console.log(updatedBreadcrumbs)
        // Navigate to the new page
        window.location.href = breadcrumb.href;
    }

    function allAppointments() {
        const breadcrumb = { label: "appointments", href: "/doctor/appointments" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
    }

    function toFollowUp() {
        const breadcrumb = { label: "followUp", href: "/doctor/followup" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
    }

    function goHome() {
        const breadcrumb = { label: "home", href: "/doctor/home" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
    }

    function goPatients() {
        const breadcrumb = { label: "patients", href: "/doctor/patients" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
    }

    function goTimeSlots() {
        const breadcrumb = { label: "timeSlots", href: "/doctor/timeslots" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
    }

    function editDoctorInfo() {
        const breadcrumb = { label: "editInfo", href: "/doctor/edit" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
    }

    //Patient routes

    function goHomePatient() {
        const breadcrumb = { label: "Home", href: "/patient/home" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
    }
    function handlePrescriptions() {
        //window.location.href = "/patient/Prescriptions"
        const breadcrumb = { label: "prescriptions", href: "/patient/Prescriptions" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
    }
    function handleAppointments() {
        //window.location.href = "/patient/Appointments"
        const breadcrumb = { label: "Appointments", href: "/patient/Appointments" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
    }
    function handleFamilyMembers() {
        //window.location.href = "/patient/LinkFamily"
        const breadcrumb = { label: "LinkFamily", href: "/patient/LinkFamily" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
    }
    function handleManageFamily() {
        //window.location.href = "/patient/readFamilyMembers"
        const breadcrumb = { label: "FamilyMembers", href: "/patient/readFamilyMembers" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
    }
    function viewAllDoctors() {
        const breadcrumb = { label: "allDoctors", href: "/patient/search" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
    }
    function toChats() {
        const breadcrumb = { label: "chats", href: "/chats" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
    }
    function goFiles() {
        const breadcrumb = { label: "files", href: "/patient/files" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
    }
    function goHealthPackages() {
        const breadcrumb = { label: "HealthPackages", href: "/patient/healthPackages/-1" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
    }
    function goEditInfo() {
        const breadcrumb = { label: "editInfo", href: "/patient/editInfo" };
        handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
    }
    const handleSearch = (values) => {
        if (values != "" && values != null) {
            const breadcrumb = { label: "allDoctors", href: `/patient/search/${values}` };
            handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
        }
    }
    const [isOpen, setIsOpen] = useState(false);
    function toggleFilter() {
        setIsOpen(!isOpen);
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
            console.log(data);
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
        setFlag(false);
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
                    let data = {
                        room,
                        read: unread,
                        isPatient
                    }
                    socket.emit("read", data)
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
                    {isPatient &&
                        <NavbarPatient goEditInfo={goEditInfo} isChat={true} openHelp={toggleFilter} goHealthPackages={goHealthPackages} goHome={goHome} handleSearch={handleSearch} goFiles={goFiles} handlePrescriptions={handlePrescriptions} handleAppointments={handleAppointments} handleFamilyMembers={handleFamilyMembers} handleManageFamily={handleManageFamily} viewAllDoctors={viewAllDoctors} toChats={toChats} />
                    }
                    {!isPatient && <>
                        <NavbarDoctor isChat={true} goHome={goHome} goPatients={goPatients} goTimeSlots={goTimeSlots} editDoctorInfo={editDoctorInfo} goAppointments={allAppointments} goFollowUp={toFollowUp} />
                    </>
                    }
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
                                    <Breadcrumbs sx={{ color: 'white' }} separator="›" aria-label="breadcrumb">
                                        {breadcrumbs.map((breadcrumb, index) => (
                                            <Link
                                                key={index}
                                                underline="hover"
                                                color="inherit"
                                                href={breadcrumb.href}
                                                onClick={(event) => handleBreadcrumbClick(event, breadcrumb)}
                                            >
                                                {breadcrumb.label}
                                            </Link>
                                        ))}
                                    </Breadcrumbs>
                                    <IconButton
                                        size="large"
                                        color="inherit"
                                        onClick={handleOpen}
                                    >
                                        <AddBoxIcon />
                                    </IconButton>
                                </ListSubheader>
                                {!loading &&
                                    <ListItem button divider onClick={openPharmacist}>
                                        <ListItemText
                                            primary='pharmacy'
                                            secondary={(pharmacistChat.messages.length > 0 ? pharmacistChat.messages[pharmacistChat.messages.length - 1].text : "start chatting")}
                                        />
                                        {pharmacistChat.unread > 0 &&
                                            <ListItemAvatar sx={{ minWidth: '0', padding: '12px' }}>
                                                <Avatar sx={{ width: 24, height: 24, fontSize: 16, bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
                                                    {pharmacistChat.unread}
                                                </Avatar>
                                            </ListItemAvatar>
                                        }
                                    </ListItem>
                                }
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
                            {isFlag &&
                                <>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: 'primary.dark', height: '64px', p: '10px 16px' }}>
                                        <div>
                                            <Typography variant="h6" sx={{ color: 'primary.contrastText', fontSize: "16px" }}>
                                                pharmacy
                                            </Typography>
                                        </div>
                                    </Box>
                                    <Box sx={{ overflowY: 'auto', height: 'calc(100vh - 224px)', bgcolor: 'AliceBlue', p: "16px" }}>
                                        {pharmacistChat.messages.length > 0 &&
                                            pharmacistChat.groups.map((group) => (
                                                <Stack key={group.messages[0]} direction="column" alignItems={group.isDoctor ? "flex-end" : "flex-start"} spacing={1}>
                                                    {group.messages.map((message) => (
                                                        <Paper key={message} sx={{ p: '8px 16px' }} >
                                                            <Typography variant="body1">
                                                                {pharmacistChat.messages[message].text}
                                                            </Typography>
                                                            <Typography variant="caption">
                                                                {pharmacistChat.messages[message].time}
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
                                            <IconButton onClick={pharmacistSend}>
                                                <SendIcon sx={{ color: 'primary.contrastText' }} />
                                            </IconButton>
                                        </Paper>
                                    </Box>
                                </>
                            }

                            {index != -1 && !isFlag &&
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