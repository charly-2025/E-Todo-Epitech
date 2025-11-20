import { useState, useEffect } from 'react';
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
  colors,
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

export default function ProfilePage(){

    useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3000/user", {
          method: "GET",
          headers: {
            "Authorization": "Bearer "+ token,
            "Content-Type": "application/json",
          },
        });
        const userdata = await response.json();  
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
    }, []);

    return (

        <Container>
            <Box sx={{width: '100vw', height: '100px', bgcolor: 'grey'}}>
            </Box>
            <Box>
                
            </Box>
        </Container>
    )

}