import React from 'react';
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import Navbar from './Navbar'
import { Skeleton, Paper, Link, Button,Typography, Grid, Card, CardActions, CardContent } from '@mui/material'
import { set } from 'mongoose';
import FamilyMemberCard from './FamilyMemeberCard';
import { motion, AnimatePresence } from 'framer-motion';

const PatientSearch = () => {
    const [result, setResult] = useState(false);
    const [user, setUser] = useState({});
    
    useEffect(() => { check(), loadUser()}, []);
    async function check() {

        const res = await axios.get("http://localhost:3000/loggedIn", {
            withCredentials: true
        }).then((res) => {

            if (res.data.type != "patient") {

                window.location.href = "/"
            }
            else {
                setResult(true)
            }
        }
        ).catch((err) => {
            if (err.response.status == 401) {
                window.location.href = "/"
            }
        })
    }
    async function loadUser() {
        await axios.get("http://localhost:3000/patient/home", { withCredentials: true }).then((res) => {
            setUser(res.data.result);
        }
        ).catch((err) => {
            console.log(err);
        });
    }
    
    return (
        <div>
            {result && <div>
                
            </div>}
        </div>
    );
};

export default PatientSearch;
