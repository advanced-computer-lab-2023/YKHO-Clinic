import * as React from 'react';
import TodayIcon from '@mui/icons-material/Today';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { motion, AnimatePresence } from 'framer-motion';

function AppointmentCard(props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ display: 'flex', alignItems: 'center',justifyContent:"center",width: 270, height: 140 }}>
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
        </CardContent>
      </Card>
    </motion.div>
  );
}


export default AppointmentCard;
