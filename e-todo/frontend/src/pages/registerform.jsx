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
import { useNavigate } from 'react-router-dom';
import '../style/forms.css';


export default function RegisterForm() {
  const navigate = useNavigate();
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
      navigate('/login')
    } else {
      alert("error creation");
    }
    <Link to="/login"></Link>
    
  };

  return (
    <form onSubmit={Register} > 
      <div className="cercle1"></div>
      <Container maxWidth='s'sx={{}}>
        <Box sx={{marginTop: 8, padding:2, position: "absolute", top: "40%" ,left: "50%", transform: 'translate(-50%, -50%)'}}>
            <Avatar sx={{mx: 'auto', bgcolor: blue[500]}}>
                <LockOutlinedIcon/>
            </Avatar>
            <Typography component='h1' sx={{marginTop: 2, textAlign: "center"}}>Register E-ToDo</Typography>
                <Box sx={{mt: 1}}>
                    <TextField placeholder= 'Enter your firstname' label="Firstname" id="outlined-input" fullWidth autoFocus sx={{mb: 2}} value={firstname} onChange={(e) => setfirstname(e.target.value)} required> 
                    </TextField>
            
                    <TextField placeholder='Enter your lastname' label="Lastname" id="outlined-password-input" fullWidth autoFocus sx={{mb: 2}} value={name} onChange={(e) => setName(e.target.value)} required>
                    </TextField>
  
                    <TextField placeholder= 'Email' label="Email" id="outlined-input" fullWidth autoFocus sx={{mb: 2}} value={email} onChange={(e) => setEmail(e.target.value)} required>
                    </TextField>

                    <TextField placeholder='Enter password' label="Password" id="outlined-password-input" fullWidth type="password" value={password} onChange={(e) => setPassword(e.target.value)} required>
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
        </Box>
      </Container>
    </form>
  );
}

