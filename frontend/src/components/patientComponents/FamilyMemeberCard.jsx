import React from 'react';
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material'
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { set } from 'mongoose';
import Paper from '@mui/material/Paper';



export default function FamilyMemberCard(props) {
  return (
    <Paper>
        {props.healthPackage !== "none"  && <Typography sx={{ fontSize: 18,whiteSpace:"nowrap",marginLeft: "1%" }}  gutterBottom>
            {props.name},Your {props.relation}, is subscribed to <Button variant="text" size="small" sx={{font: "bold", fontSize:"15px"}}>{props.healthPackage}</Button>
        </Typography>}
        {props.healthPackage === "none"  && <Typography sx={{ fontSize: 18,whiteSpace:"nowrap",marginLeft: "1%" }}  gutterBottom>
            {props.name},Your {props.relation}, is not subscribed to any health package
        </Typography>}
    </Paper>
  );
}