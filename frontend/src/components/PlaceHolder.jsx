import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const PlaceHolder = ({ message, description, width, height }) => {
    return (
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column", width:parseInt(width), height:parseInt(height) }}>
            <SentimentVeryDissatisfiedIcon
                style={{ fontSize: 100, marginBottom: 10 }}
            />
            <Typography variant="h5" component="div">
                {message}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {description}
            </Typography>
        </div>
    );
};

export default PlaceHolder;
