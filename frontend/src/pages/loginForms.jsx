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
  EmailTwoTone
} from '@mui/icons-material';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { blue } from '@mui/material/colors';
import { Link, useNavigate } from "react-router-dom";
import '../style/forms.css';





export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [valide, setinvalide] = useState(false);
  const navigate = useNavigate();

  const login = async (e)=>{
    e.preventDefault();
    const connection = await fetch("http://localhost:3001/login",{
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

  return (

    <form onSubmit={login}> 
     <div className="cercle1"></div>
    <Container maxWidth='xs'>
        <Box sx={{marginTop: 8, padding:2, position: "absolute", top: "40%" ,left: "50%", transform: 'translate(-50%, -50%)'}}>
          <Paper elevation={15} sx={{marginTop: 8 , padding: 2}}>
          <Avatar sx={{mx: 'auto', bgcolor: blue[500]}}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component='h1' sx={{marginTop: 2, textAlign: "center"}}>Login eTodo</Typography>
          <Box sx={{mt: 1}}>
            <TextField className="select"  placeholder= 'Enter login-name' label="Login-name" fullWidth autoFocus sx={{mb: 2}} value={email} onChange={(e) => setEmail(e.target.value)} required>
                
            </TextField>
            <TextField className="select" placeholder='Enter password' label="Password"  fullWidth type="password" value={password} onChange={(e) => setPassword(e.target.value)} required>
            </TextField>
            {valide && (
              <Alert severity="warning">Login name or password are incorrect.</Alert>
            )}
            <Button className="select" type="submit" variant="contained" fullWidth sx={{mt: 1}}>Login</Button>
          </Box>
          <Grid container justifyContent='space-between' sx={{mt:1}}>
            <Grid>
              <Link to="/forgot">
                Forgot password?
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


