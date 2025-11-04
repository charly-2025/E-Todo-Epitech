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
  Alert
} from '@mui/material';
import {
  Lock,
  Visibility,
  VisibilityOff,
  Email
} from '@mui/icons-material';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email, 'Password:', password);
};

  return (
    <div>
        <h1>Connexion E-ToDo</h1>
        <TextField id="standard-basic" label="Identifiant" variant="standard">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
        </TextField>
        <br></br>
        <TextField id="standard-basic" label="Password" variant="standard" type="password">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe"/>
        </TextField>
        <br></br>
        <button onClick={handleSubmit}>Se connecter</button>
        
    </div>
  );
}
