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
import HowToRegIcon from '@mui/icons-material/HowToReg';
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
  const [registerisinvalid, setregisterinvalid] = useState(false);


  const Register = async (e)=>{
    e.preventDefault();
    console.log(email, password)
    const connection = await fetch("http://localhost:3000/register",{
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
      navigate('/login')
    } else {
      setregisterinvalid(true)
    }
    
  };

  return (
    <form onSubmit={Register} > 
      <div className="cercle1"></div>
      <Container maxWidth='xs'>
        <Box sx={{marginTop: 8, padding:2, position: "absolute", top: "40%" ,left: "50%", transform: 'translate(-50%, -50%)',  width: '90vw',maxWidth: '650px'}}>
          <Paper elevation={15} sx={{marginTop: 8 , padding: 2}}>
            <Avatar sx={{mx: 'auto', bgcolor: blue[500]}}>
                <HowToRegIcon/>
            </Avatar>
            <Typography component='h1' sx={{marginTop: 2, textAlign: "center"}}>Register eTodo</Typography>
                <Box sx={{mt: 1}}>
                    <TextField className="select" placeholder= 'Enter your firstname' label="Firstname"  fullWidth autoFocus sx={{mb: 2}} value={firstname} onChange={(e) => setfirstname(e.target.value)} required> 
                    </TextField>
            
                    <TextField className="select" placeholder='Enter your lastname' label="Lastname" fullWidth autoFocus sx={{mb: 2}} value={name} onChange={(e) => setName(e.target.value)} required>
                    </TextField>
  
                    <TextField className="select" placeholder= 'Email' label="Email" id="outlined-input" fullWidth autoFocus sx={{mb: 2}} value={email} onChange={(e) => setEmail(e.target.value)} required>
                    </TextField>

                    <TextField className="select" placeholder='Enter password' label="Password" fullWidth type="password" value={password} onChange={(e) => setPassword(e.target.value)} required>
                    </TextField>
            
                    <Button className="select" type="submit" variant="contained" fullWidth sx={{mt: 1}}>Register</Button>
                </Box>
            
            {registerisinvalid && (
              <Alert severity="error">Error during your account's creation. Please try again later.</Alert>
            )}
            <Grid sx={{marginTop: 2, textAlign: "center"}}>
                <Grid>
                    <Link to="/login">
                        Already have an account ?
                    </Link>
                </Grid>     
            </Grid>
            </Paper>
          </Box>
      </Container>
    </form>
  );
}

