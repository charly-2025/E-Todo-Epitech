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
} from '@mui/material';
import {
  Lock,
  Visibility,
  VisibilityOff,
  Email,
  Bluetooth,
  Check,
  Login,
  EmailTwoTone
} from '@mui/icons-material';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { blue } from '@mui/material/colors';
import { Link } from "react-router-dom";


export default function RegisterForm() {
  const [firstname, setfirstname] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const Register = async (e)=>{
    e.preventDefault();
    console.log(email, password)
    const connection = await fetch("http://localhost:3000/api/auth/register",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        email:email,
        password:password,
        firstname:firstname,
        name:name,
      })
    });
    const data = await connection.json();
    if (connection.ok){
      localStorage.setItem("token",data.token);
      console.log(localStorage.getItem("token"));
      alert("Creation ok");
    } else {
      alert("error creation");
    }
    <Link to="/login"></Link>
    
  };

  return (
    <form onSubmit={Register} > 
      <Container maxWidth='xs'sx={{}}>
        <Paper elevation={20} sx={{marginTop: 8, padding:2, position: "absolute", top: "40%" ,left: "50%", transform: 'translate(-50%, -50%)'}}>
            <Avatar sx={{mx: 'auto', bgcolor: blue[500]}}>
                <LockOutlinedIcon/>
            </Avatar>
            <Typography component='h1' sx={{marginTop: 2, textAlign: "center"}}>Register E-ToDo</Typography>
                <Box sx={{mt: 1}}>
<<<<<<< HEAD
                    <TextField placeholder= 'Enter your firstname' label="Firstname" id="outlined-input" fullWidth autoFocus sx={{mb: 2}} value={firstname} onChange={(e) => setfirstname(e.target.value)} required> 
                    </TextField>
            
                    <TextField placeholder='Enter your lastname' label="Lastname" id="outlined-password-input" fullWidth autoFocus sx={{mb: 2}} value={name} onChange={(e) => setName(e.target.value)} required>
                    </TextField>
  
                    <TextField placeholder= 'Enter login-name' label="Login-name" id="outlined-input" fullWidth autoFocus sx={{mb: 2}} value={email} onChange={(e) => setEmail(e.target.value)} required>
                    </TextField>

                    <TextField placeholder='Enter password' label="Password" id="outlined-password-input" fullWidth type="password" value={password} onChange={(e) => setPassword(e.target.value)} required>
=======
                    <TextField placeholder= 'Enter your firstname' label="firstname"  fullWidth autoFocus sx={{mb: 2}} value={firstname} onChange={(e) => setfirstname(e.target.value)}> 
                    </TextField>
            
                    <TextField placeholder='Enter your lastname' label="lastname"  fullWidth autoFocus sx={{mb: 2}} value={name} onChange={(e) => setName(e.target.value)} >
                    </TextField>
  
                    <TextField placeholder= 'email' label="email" type="email" fullWidth autoFocus sx={{mb: 2}} value={email} onChange={(e) => setEmail(e.target.value)}>
                    </TextField>

                    <TextField placeholder='Enter password' label="Password"  fullWidth type="password" value={password} onChange={(e) => setPassword(e.target.value)} >
>>>>>>> e8b3f7a2e52d7583cc4d8ab725e4e4a9a1d95937
                    </TextField>
            
                    <Button type="submit" variant="contained" fullWidth sx={{mt: 1}}>Register</Button>
                </Box>
            <Grid sx={{marginTop: 2, textAlign: "center"}}>
                <Grid>
                    <Link to="/login">
                        Already have an account ?
                    </Link>
                </Grid>     
            </Grid>
        </Paper>
      </Container>
    </form>
  );
}

