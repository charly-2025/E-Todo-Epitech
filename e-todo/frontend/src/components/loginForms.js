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
  Link
} from '@mui/material';
import {
  Lock,
  Visibility,
  VisibilityOff,
  Email,
  Bluetooth,
  Check
} from '@mui/icons-material';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { blue } from '@mui/material/colors';
import { Link as RouterLink } from "react-router-dom";


export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const handleSubmit = async (e) => {
    console.log('Email:', email, 'Password:', password);
    e.preventDefault();
    const connection = await fetch("https://localhost:3000/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({email,password})
    });
    const data = await connection.json();
    if (connection.ok){
      localStorage.setItem("token",data.token);
      alert("Connection ok");
    } else {
      alert("error connection")
    }
};

  return (
    <Container maxWidth='xs'sx={{}}>
        <Paper elevation={20} sx={{marginTop: 8, padding:2, position: "absolute", top: "40%" ,left: "50%", transform: 'translate(-50%, -50%)'}}>
          <Avatar sx={{mx: 'auto', bgcolor: blue[500]}}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component='h1' sx={{marginTop: 2, textAlign: "center"}}>Login E-ToDo</Typography>
          <Box component='form' sx={{mt: 1}}>
            <TextField placeholder= 'Enter login-name' label="Login-name" id="outlined-input" fullWidth autoFocus sx={{mb: 2}}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
            </TextField>
            <TextField placeholder='Enter password' label="Password" id="outlined-password-input" fullWidth type="password" >
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe"/>
            </TextField>
  
            <FormControlLabel  control={<Checkbox value="remember" />}label="Remember me"/>
            
            <Button type="submit" variant="contained" fullWidth sx={{mt: 1}} onClick={handleSubmit}>Login</Button>
          </Box>
          <Grid container justifyContent='space-between' sx={{mt:1}}>
            <Grid item>
              <Link component={Link} to ="/forgot">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={Link} to='/register'>
                SignUp 
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </Container>
  );
}
