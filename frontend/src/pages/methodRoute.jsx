import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Popper from '@mui/material/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';

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

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  width: 200,
}));


function formatTimestamp(timestamp) {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  return date.toLocaleString("fr-FR", {
    timeZone:"Europe/Paris", 
    dateStyle: "short",
    timeStyle: "short",
  });
}


export function MyTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchUserTodo = async () => {
      const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/user/todos", {
          method: "GET",
          headers: {
            "Authorization": "Bearer "+ token,
            "Content-Type": "application/json",
          }
        });
        const Tododata = await response.json();
        setData(Tododata);
    }
    fetchUserTodo();
  }, []);
  console.log(data);
  
  if (data.length > 0 && Array.isArray(data)) return (
      
      <TableContainer component={Paper} sx={{}}>
      <Table sx={{ minWidth: 450 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Due Time</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">{row.title}</TableCell>
              <TableCell align="right">{row.description}</TableCell>
              <TableCell align="right">{formatTimestamp(row.due_time)}</TableCell>
              <TableCell align="right">{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
  return (<Typography>No todos for you right now</Typography>)
}   

export function PopperPopupState() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [status, setStatus] = useState('not started');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const getMinDate = (selectedDate) => {
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    if(isToday){
      return now;
    } else {
      const newDate = new Date(selectedDate);
      newDate.setHours(0,0,0,0);
      return newDate;
    }
  }

  const update = async(e) =>{
    e.preventDefault();
    console.log(selectedDate,status,title,description);

  }

  return (
    <PopupState variant="popper" popupId="demo-popup-popper">
      {(popupState) => (
        <div>
          <Button variant="contained" sx={{backgroundColor:"#147375",color:"white",margin:"10px",float:'left'}} 
          {...bindToggle(popupState)}>
            Create a New Todo +
          </Button>
          <Popper {...bindPopper(popupState)} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                 <form onSubmit={update} > 
                     <Container maxWidth='xs'>
                         <Box sx={{width:"300px", marginTop: 8, padding:2, position: "absolute", top: "40%" ,left: "50%", transform: 'translate(-50%, -50%)'}}>
                           <Paper elevation={15} sx={{marginTop: 8 , padding: 2}}>
                           <Typography component='h1' sx={{marginTop: 2, textAlign: "center"}}>Create a New Todo</Typography>
                           <Box sx={{mt: 1}}>
                             <TextField className="select"  placeholder= 'Enter Title' label="Title"  value={title} onChange={(e) => setTitle(e.target.value)} fullWidth autoFocus sx={{mb: 2}}required>  
                             </TextField>
                             <TextField className="select" placeholder='Enter Description' label="Description" value={description} onChange={(e) => setDescription(e.target.value)}  sx={{mb: 2}} fullWidth required>
                             </TextField>
                              <DatePicker
                                  selected={selectedDate}
                                  onChange={(date) => setSelectedDate(date)}
                                  showTimeSelect
                                  timeFormat="HH:mm"
                                  timeIntervals={1}
                                  minDate={new Date()}
                                  minTime={getMinDate(selectedDate)}
                                  maxTime={new Date().setHours(23, 59)}
                                  dateFormat="dd/MM/yyyy HH:mm"
                                  placeholderText="Choose Due Time"
                                  customInput={<TextField label="Due Time" fullWidth sx={{mb: 2}} disabled />}
                                />
                                <InputLabel id="demo-simple-select-label">Status : </InputLabel>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    fullWidth
                                    sx={{mb: 2}}
                                  >
                                    <MenuItem value={"not started"}>Not Started</MenuItem>
                                    <MenuItem value={"todo"}>To Do</MenuItem>
                                    <MenuItem value={"in progress"}>In Progress</MenuItem>
                                    <MenuItem value={"done"}>Done</MenuItem>
                                  </Select>
                             <Button className="select" type="submit" variant="contained" fullWidth sx={{mt: 1}}>Create New Todo</Button>
                           </Box>
                         </Paper>
                         </Box>
                       </Container>
                      
                     </form>
                </Paper>
              </Fade>
            )}
          </Popper>
        </div>
      )}
    </PopupState>
  );
}

