import React from "react";
import { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Alert,
  Avatar,
  Grid,
  Card,

} from '@mui/material';
import {
  Lock,
  Visibility,
  VisibilityOff,
  Email,
  Bluetooth,
  Check,
  Login,
  EmailTwoTone,
  Password
} from '@mui/icons-material';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { blue } from '@mui/material/colors';
import { Link, useNavigate } from "react-router-dom";
import '../style/forms.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';



function sendEmail(){
    Email.send({
        Host:"smtp.gmail.com",
        Username:"E-Todo",
        Password:"Epitech***REMOVED***",
        To:"charly.richardfromont@gmail.com",
        From:"etodo.project@gmail.com",
        Subject:"Forgot Password",
        Body:"Hello customers you have forgot your password"
    })
    .then(function(message){
        alert("email envoyé ave succès")
    })
}



export default function LoginForm() {
  const [showPassword,setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [valide, setinvalide] = useState(false);
  const navigate = useNavigate();


  const login = async (e)=>{
    e.preventDefault();
    const connection = await fetch("http://localhost:3000/login",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        email:email,
        password:password
      })
    });
    const data = await connection.json();
    if (connection.ok){
      localStorage.setItem('auth' , true);
      localStorage.setItem("token",data.token);
      navigate('/user')
    } else {
      setinvalide(true)
    }
  };


  const changeShowPassword = () => {
    if(showPassword){
      setShowPassword(false)
    } else {
      setShowPassword(true)
    }
  }

  return (

    <form onSubmit={sendEmail}> 
     <div className="cercle1"></div>
    <Container sx={{}}>
        <Box sx={{marginTop: 8, padding:2, position: "absolute", top: "40%" ,left: "50%", transform: 'translate(-50%, -50%)', width: '90vw',maxWidth: '650px'}}>
          <Paper elevation={15} sx={{marginTop: 8 , padding: 2}}>
          <Avatar sx={{mx: 'auto', bgcolor: blue[500]}}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component='h1' sx={{marginTop: 2, textAlign: "center"}}>Login eTodo</Typography>
          <Box sx={{mt: 1}}>
            <TextField className="select"  placeholder= 'Enter your email' label="Email" fullWidth autoFocus sx={{mb: 2}} value={email} onChange={(e) => setEmail(e.target.value)} required> 
            </TextField>

            {valide && (
              <Alert severity="warning">email are incorrect.</Alert>
            )}
            <Button className="select" type="submit" variant="contained" fullWidth sx={{mt: 1}}>Send Email</Button>
          </Box>
          <Grid container justifyContent='space-between' sx={{mt:1}}>
            <Grid>
              <Link to="/login">
                Login
              </Link>
            </Grid>
            <Grid>
              <Link to='/register'>
                Register 
              </Link>
            </Grid>
          </Grid>
        </Paper>
        </Box>
      </Container>
     
    </form>
  );
}
