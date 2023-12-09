import * as React from 'react';
import TodayIcon from '@mui/icons-material/Today';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton } from '@mui/material';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
function AppointmentCard(props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{width: 270, height: 140 }}>
        <div style={{display: 'flex', alignItems: 'center',justifyContent:"center",width: 270, height: 140}}>
        <CardContent sx={{ display: 'flex', alignItems: 'center',justifyContent:"center" }}>
          <TodayIcon sx={{ fontSize: 71, marginRight: 3 }} />
          <div>
            <Typography sx={{ fontSize: 18, whiteSpace: 'nowrap' }} gutterBottom>
              name: {props.name}
            </Typography>
            <Typography sx={{ fontSize: 18, whiteSpace: 'nowrap' }} gutterBottom>
              date: {props.date}
            </Typography>
          
          </div>
          {props.isFull&&<IconButton sx={{marginTop:"-80px"}} id={props.ids} onClick={()=>props.whenClicked(props.ids)}>
            <EditCalendarIcon sx={{ fontSize: 24 }} />
          </IconButton>}
        
        </CardContent>
        </div>
        {props.isFull &&<CardActions sx={{marginTop:-6}}>
              <Button size='small' variant="text" id={props.ids}>schedule follow up</Button>
          </CardActions>}
      </Card>
    </motion.div>
  );
}


export default AppointmentCard;
