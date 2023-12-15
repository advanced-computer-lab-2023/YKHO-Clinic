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
function TimeSlotCard(props) {
  
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
                From: {props.from}
              </Typography>
              <Typography sx={{ fontSize: 18, whiteSpace: 'nowrap' }} gutterBottom>
                To: {props.to}
              </Typography>
              
            </div>
            
              <div>
              <IconButton sx={{ marginBottom: '-80px' }} color="error" id={props.ids} onClick={() => props.cancel(props._id)}>
              <DeleteForeverIcon sx={{ fontSize: 24 }} />
            </IconButton>
            </div>
            
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}

export default TimeSlotCard;
