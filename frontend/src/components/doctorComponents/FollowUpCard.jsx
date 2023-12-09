import * as React from 'react';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
function FollowUpCard(props){
    return (
        <Card  sx={{ width: 275,height:100 }}>
            <CardContent sx={{display:'flex',alignItems:'center'}}>
                <DomainVerificationIcon sx={{ fontSize: 61 ,marginRight:3}}/>
                <div>
                <Typography sx={{ fontSize: 18,whiteSpace:"nowrap" }}  gutterBottom>
                 name: {props.name}
                </Typography>   
                <Typography sx={{ fontSize: 18 ,whiteSpace:"nowrap"}}  gutterBottom>
                 date: {props.date}
                </Typography> 
                </div>
                <div>
                    <IconButton aria-label="check" size="small">
                    <CheckIcon sx={{ fontSize: 24 }}/>
                    </IconButton>
                    <IconButton aria-label="close" size="small">
                    <CloseIcon sx={{ fontSize: 24 }}/>
                    </IconButton>
                </div>
            </CardContent>
        </Card>
         
      );
}
export default FollowUpCard;