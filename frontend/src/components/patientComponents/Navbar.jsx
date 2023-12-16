import React, { useState, useEffect, useRef} from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LogoutIcon from '@mui/icons-material/Logout';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FolderIcon from '@mui/icons-material/Folder';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Button, Stack } from '@mui/material';
import { FilledInput } from '@mui/material';
import { useNavigate,useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from "../../../../images/logo_white.png";
// Inside your component

// axios
import axios from 'axios';
// socket
import io from 'socket.io-client';
const socket = io.connect("http://localhost:3000");

const init = async () => {
  await axios.get("http://localhost:3000/rooms", {
    withCredentials: true
  }).then((res) =>{
    let rooms = res.data;
    for(let i = 0; i < rooms.length; i++){
      joinRoom(rooms[i])
    }
  })
}

const joinRoom = (room) => {
  socket.emit("join_room", room)
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function PrimarySearchAppBar({content, openHelp, isChat, goHome, goFiles, handlePrescriptions, handleHealthRecords, handleAppointments, handleHistory, handleLinkFamily
,handleManageFamily, viewAllDoctors, toChats}) {
  const [unread, setUnread] = useState(0);
  const unreadRef = useRef(unread);
  
  useEffect(() => {
    unreadRef.current = unread;
  }, [unread])

  const getUnread = async () => {
    await axios.get("http://localhost:3000/unread", {
      withCredentials: true
    }).then((res) =>{
      setUnread(res.data);
    })
  }

  // socket notiffications
  useEffect(() => {init(), getUnread()}, [])

  useEffect(() => {
    socket.on("update", () => {
      getNotifications()
    })

    socket.on("receive_message", (data) => {
      if (!data.isPatient)
        setUnread(unreadRef.current + 1);
    })

    socket.on("read", (data) => {
      if (data.isPatient)
        setUnread(unreadRef.current - data.read);
    })


  }, [socket])

  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = useState([]);  const [values, setValues] = useState("");
  const [readCount, setReadCount] = useState(0);
  const [notifRead, setNotifRead] = React.useState(false);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  useEffect(()=>{getNotifications()},[notifRead]);
  const { searchvalue } = useParams();

  


  function toggleFilter() {
    setIsOpen(!isOpen);
  }
  const handleSearch = () => {
    if(values != "" && values != null){
      window.location.href = `/patient/search/${values}`
    }
  }
  // function goAllApointments() {
  //   window.location.href= '/patient/Appointments';
  //     const breadcrumb = { label: "Appointments", href: "/patient/Appointments" };
  //     handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
  //   }
  // function goHome() {
  //   window.location.href= '/patient/home';
  //   const breadcrumb = { label: "Home", href: "/patient/home" };
  //   handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
  // }
  // function goPrescriptions() {
  //   window.location.href= '/patient/Prescriptions';
  //   const breadcrumb = { label: "Prescriptions", href: "/patient/Prescriptions" };
  //   handleBreadcrumbClick(new MouseEvent('click'), breadcrumb);
  // }
  // function goSeeFamilyOrDie(){
  //   window.location.href='/patient/readFamilyMembers';
  // }
  // function goFiles(){
  //   window.location.href = '/patient/files'
  // }
  // function goPackages(){
  //   window.location.href='/patient/healthPackages'
  // }
  // function goMedicalHistory(){
  //   window.location.href='/patient/medicalHistory'
  // }

  // function editPatientInfo(){
  //   window.location.href='/patient/editPatientInfo'
  // }

  const [error, setError] = useState('');
  async function LogoutButton() {
    try {
        const res = await axios.get("http://localhost:3000/logout", {
            withCredentials: true
        });
        window.location.href = "/";
        
    } catch (err) {
        setError(err.message);
    }
}

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

async function getNotifications(){
    try {
      const res = await axios.post("http://localhost:3000/patient/getNotifications", {read: notifRead}, {
        withCredentials: true,
      });
      setReadCount(res.data.readCount);
      setNotifications(res.data.result);
      setNotifRead(false);
  } catch (err) {
    console.log(err);
  }
}

const [notificationsState, setNotificationsState] = React.useState({
  top: false,
  left: false,
  bottom: false,
  right: false,
});

const toggleNotifications = (anchor, open) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
  }
  setNotifRead(true);
  setNotificationsState({ ...notificationsState, [anchor]: open });
}

async function deleteNotification(id){
  console.log(id)
  axios.post("http://localhost:3000/patient/deleteNotification", {id: id}, {
    withCredentials: true,
  }).then((res) => {
    if(res.data.message == "Notification deleted successfully"){
      getNotifications();
    }
  }).catch((err) => {
    console.log(err);
  })
}

const notificationsList = (anchor) => (
  <Box
    sx={{ width: 350 }}
    role="presentation"
    onKeyDown={toggleNotifications(anchor, false)}
  >
    <List sx={{display:'flex', flexDirection:'column' , justifyContent:'center', alignItems:'center'}}>
        <Typography><b>Notifications</b></Typography>
            <List>
              {notifications.map((notification) => (
                <Paper elevation={5} style={{margin:'0px 10px 13px 10px'}}>
                  <ListItem>
                      <ListItemIcon>
                        {<NotificationsIcon style={{color:'green'}} />}
                      </ListItemIcon>
                      <ListItemText primary={notification.text} />
                      <ListItemIcon sx={{marginRight:'-30px', paddingTop:'60px'}}>
                      {<DeleteIcon style={{color:'red'}} onClick={() => deleteNotification(notification._id)} />}
                      </ListItemIcon>
                  </ListItem>
                </Paper>
              ))}
            </List>
    </List>
  </Box>
)

const [state, setState] = React.useState({
  top: false,
  left: false,
  bottom: false,
  right: false,
});

const toggleDrawer = (anchor, open) => (event) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    return;
  }

  setState({ ...state, [anchor]: open });
};

const list = (anchor) => (
  <Box
  sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250, height: '100%' }}
  role="presentation"
  onClick={toggleDrawer(anchor, false)}
  onKeyDown={toggleDrawer(anchor, false)}
>
  <List>
    <ListItem disablePadding>
      <ListItemButton onClick={()=>{}} sx={{color:"#FAF5FF"}}>
        <ListItemIcon sx={{color:"#FAF5FF"}}><MenuIcon/></ListItemIcon>
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton onClick={goHome} sx={{color:"#FAF5FF"}}>
        <ListItemIcon sx={{color:"#FAF5FF"}}><HomeIcon/></ListItemIcon>
        <ListItemText primary={'Home'} sx={{color:"#FAF5FF"}} />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton onClick={handleAppointments} sx={{color:"#FAF5FF"}}>
        <ListItemIcon sx={{color:"#FAF5FF"}}><CalendarMonthIcon/></ListItemIcon>
        <ListItemText primary={'Appointments'} sx={{color:"#FAF5FF"}} />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton onClick={handlePrescriptions} sx={{color:"#FAF5FF"}}>
        <ListItemIcon sx={{color:"#FAF5FF"}}><LocalHospitalIcon/></ListItemIcon>
        <ListItemText primary={'Prescriptions'} sx={{color:"#FAF5FF"}} />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton onClick={handleManageFamily} sx={{color:"#FAF5FF"}}>
        <ListItemIcon sx={{color:"#FAF5FF"}}><FamilyRestroomIcon/></ListItemIcon>
        <ListItemText primary={'Family Members'} sx={{color:"#FAF5FF"}}/>
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton onClick={goFiles} sx={{color:"#FAF5FF"}}>
        <ListItemIcon sx={{color:"#FAF5FF"}}><FolderIcon/></ListItemIcon>
        <ListItemText primary={'Your files'} sx={{color:"#FAF5FF"}}/>
      </ListItemButton>
    </ListItem>
      <ListItem disablePadding>
      <ListItemButton onClick={viewAllDoctors} sx={{color:"#FAF5FF"}}>
        <ListItemIcon sx={{color:"#FAF5FF"}}><AssignmentIndIcon /></ListItemIcon>
        <ListItemText primary={'View All Doctors'} sx={{color:"#FAF5FF"}}/>
      </ListItemButton>
    </ListItem>
  </List>
  <Divider />


<List sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
  <ListItem disablePadding>
      <ListItemButton sx={{color:"#FAF5FF"}}>
        <ListItemIcon sx={{color:"#FAF5FF"}}><EditIcon/></ListItemIcon>
        <ListItemText primary={'Edit your info'} style={{ textAlign: 'center' }} />
      </ListItemButton>
  </ListItem>
  <ListItem disablePadding>
    <ListItemButton onClick={LogoutButton} sx={{color:"#FAF5FF"}}>
      <ListItemIcon sx={{color:"#FAF5FF"}}><LogoutIcon/></ListItemIcon>
      <ListItemText primary={'Logout'} style={{ textAlign: 'center', color:"#FAF5FF"}} />
    </ListItemButton>
  </ListItem>
</List>
</Box>

)

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      {/* ma3rfsh meen el element dah lol */}
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={13} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div>
          <Drawer
            anchor={'left'}
            open={state['left']}
            onClose={toggleDrawer('left', false)}
          >
            <Box sx={{bgcolor: 'primary.main',height:"100%"}}>
            {list('left')}
            </Box>
          </Drawer>
          <Drawer
            anchor={'right'}
            open={notificationsState['right']}
            onClose={toggleNotifications('right', false)}
          >
            {notificationsList('right')}
          </Drawer>
       
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={toggleDrawer('left', true)}
          >
          <MenuIcon />
          </IconButton>


            <img style={{height:"56px"}} src={logo} />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search for Doctors…"
              inputProps={{ 'aria-label': 'search' }}
              type='search'
              onChange={(e) => setValues(e.target.value)}
              defaultValue={content}
            />
          </Search>
          <Button variant="contained" color="success" size="small" sx={{ marginLeft: "1%" }} onClick={handleSearch}> Search </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {isChat == undefined &&
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 0 }}
                onClick={() => { window.location.href = "/chats" }}
              >
              <Badge badgeContent={unread} color="error">
                <ChatBubbleIcon />
              </Badge>
              </IconButton>
            }
            <IconButton
              size="large"
              aria-label="13"
              color="inherit"
              onClick={toggleNotifications('right', true)}
            >
            <Badge badgeContent={readCount} color="error">
              <NotificationsIcon />
            </Badge>
            </IconButton>

          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
    </div>
  );
}