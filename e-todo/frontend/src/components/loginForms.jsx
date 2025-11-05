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
  Check,
  Login
} from '@mui/icons-material';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { blue } from '@mui/material/colors';
import { Link as RouterLink } from "react-router-dom";


export default function LoginForm() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  function login(e){
    e.preventDefault();
    console.log(email, password);
    
  }

  return (
    <form onSubmit={login}> 
      <Container maxWidth='xs'sx={{}}>
        <Paper elevation={20} sx={{marginTop: 8, padding:2, position: "absolute", top: "40%" ,left: "50%", transform: 'translate(-50%, -50%)'}}>
          <Avatar sx={{mx: 'auto', bgcolor: blue[500]}}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component='h1' sx={{marginTop: 2, textAlign: "center"}}>Login E-ToDo</Typography>
          <Box sx={{mt: 1}}>
            <TextField placeholder= 'Enter login-name' label="Login-name" id="outlined-input" fullWidth autoFocus sx={{mb: 2}}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
            </TextField>
            <TextField placeholder='Enter password' label="Password" id="outlined-password-input" fullWidth type="password" >
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe"/>
            </TextField>
  
            <FormControlLabel  control={<Checkbox value="remember" />}label="Remember me"/>
            
            <Button type="submit" variant="contained" fullWidth sx={{mt: 1}}>Login</Button>
          </Box>
          <Grid container justifyContent='space-between' sx={{mt:1}}>
            <Grid>
              <Link component={Link} to ="/forgot">
                Forgot password?
              </Link>
            </Grid>
            <Grid>
              <Link component={Link} to='/register'>
                SignUp 
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </form>
  );
}

