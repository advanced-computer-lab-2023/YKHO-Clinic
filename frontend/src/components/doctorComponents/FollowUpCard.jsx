import * as React from 'react';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import dayjs from 'dayjs';
function FollowUpCard(props){
    const adjustedTime = props.time
    ? dayjs(`2000-01-01T${props.time}`).add(2, 'hours').format('HH:mm')
    : null;
    return (
        <Card  sx={{ width: 275,height:120 }}>
            <CardContent sx={{display:'flex',alignItems:'center'}}>
                <DomainVerificationIcon sx={{ fontSize: 61 ,marginRight:3}}/>
                <div>
                <Typography sx={{ fontSize: 18,whiteSpace:"nowrap" }}  gutterBottom>
                 name: {props.name}
                </Typography>   
                <Typography sx={{ fontSize: 18 ,whiteSpace:"nowrap"}}  gutterBottom>
                 date: {props.date}
                </Typography> 
                <Typography sx={{ fontSize: 18 ,whiteSpace:"nowrap"}}  gutterBottom>
                 time: {adjustedTime}
                </Typography>
                </div>
                <div>
                    <IconButton aria-label="check" size="small" onClick={()=>{props.accept(props.id,"accept")}}>
                    <CheckIcon sx={{ fontSize: 24 }}/>
                    </IconButton>
                    <IconButton aria-label="close" size="small" onClick={()=>{props.reject(props.id,"reject")}}>
                    <CloseIcon sx={{ fontSize: 24 }}/>
                    </IconButton>
                </div>
            </CardContent>
        </Card>
         
      );
}
export default FollowUpCard;