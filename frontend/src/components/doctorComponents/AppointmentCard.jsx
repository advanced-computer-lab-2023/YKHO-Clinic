import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TodayIcon from '@mui/icons-material/Today';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
function AppointmentCard(props) {
  const adjustedTime = props.time
    ? dayjs(`2000-01-01T${props.time}`).add(2, 'hours').format('HH:mm')
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ width: 270, height: 140 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 270, height: 140 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TodayIcon sx={{ fontSize: 71, marginRight: 3 }} />
            <div>
              <Typography sx={{ fontSize: 18, whiteSpace: 'nowrap' }} gutterBottom>
                name: {props.name}
              </Typography>
              <Typography sx={{ fontSize: 18, whiteSpace: 'nowrap' }} gutterBottom>
                date: {props.date}
              </Typography>
              {adjustedTime && (
                <Typography sx={{ fontSize: 18, whiteSpace: 'nowrap' }} gutterBottom>
                  time: {adjustedTime}
                </Typography>
              )}
            </div>
            {props.isFull && (
              <div>
              {props.status!="completed" &&props.status!="cancelled" &&< IconButton sx={{ marginTop: '-60px' }} id={props.ids} onClick={() => props.whenClicked(props.ids)}>
                <EditCalendarIcon sx={{ fontSize: 24 }} />
              </IconButton>}
              {props.status!="cancelled"&&props.status!="completed"&&<IconButton sx={{ marginBottom: '-80px' }} color="error" id={props.ids} onClick={() => props.cancel(props.ids)}>
              <DeleteForeverIcon sx={{ fontSize: 24 }} />
            </IconButton>}
            </div>
            )}
          </CardContent>
        </div>
        {props.isFull && props.status=="completed" && (
          <CardActions sx={{ marginTop: -6 }}>
            <Button size="small" variant="text" onClick={()=>props.schedFollowup(props.ids)}>
              schedule follow up
            </Button>
          </CardActions>
        )}
      </Card>
    </motion.div>
  );
}

export default AppointmentCard;
