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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AccessAlarm, FireTruck, ThreeDRotation } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
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




function formatTimestamp(timestamp) {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  return date.toLocaleString("fr-FR", {
    timeZone:"Europe/Paris", 
    dateStyle: "short",
    timeStyle: "short",
  });
}


export function MyTable({data_todos, onDelete}) {
  const [editId,setEditId] = useState(null)
  const [todos, setTodos] = useState([])
  const [editTodo, setEditTodo] = useState({title:"",description:"",due_time:"",status:""})
  const [user_id, setUserId] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/todos", {
        headers: { "Authorization": "Bearer " +token }
      });
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : []); 
    };
    fetchTodos();
  }, []);


  const fetchDataUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/user", {
        method: "GET",
        headers: {
          "Authorization": "Bearer "+token,
          "Content-Type": "application/json",
        }
      });
      const userData = await response.json();
      setUserId(userData.id);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchDataUser();  
  }, []);

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

  const formatDateTime = (date)=>{
    let formatDate = "";
    formatDate += date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":00";
    return formatDate;
   }

  const update = async (todo_id) => {
    setEditId(todo_id);
    todos.forEach(todo=>{
      if (todo.id === todo_id){
        setEditTodo({
          title:todo.title,
          description:todo.description,
          due_time:new Date(todo.due_time),
          status:todo.status
        })
        console.log(editTodo)
      }
    })
    }
    
  const close = () => {
    setEditId(null);
    console.log("close");
  }

  const save = async (todo_id) => {
    setEditId(null);
    console.log("save");
    const token = localStorage.getItem("token");
    const connection = await fetch("http://localhost:3001/todos/" +todo_id, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " +token,
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
                title:editTodo.title,
                description:editTodo.description,
                due_time:formatDateTime(editTodo.due_time),
                user_id:user_id,
                status:editTodo.status
              })
      });
      const data = await connection.json();
      console.log(data);
  }
  const suppr = async (todo_id) => {
    const token = localStorage.getItem("token");
    try {
      const connection = await fetch("http://localhost:3001/todos/" +todo_id, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " +token,
          "Content-Type": "application/json",
        },
      });
      const data = await connection.json();
      console.log(data);
      onDelete(todo_id);
    } catch (error) {
      console.error(error);
      
    }
  };

  if (!Array.isArray(data_todos) || data_todos.length === 0  ) {
    return ;
  }
    
  return (
      <TableContainer sx={{ minWidth: '100%' }} component={Paper}>
        <Table  aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Due Time</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data_todos.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {editId === row.id ? (<TextField value={editTodo.title} onChange={(e)=>setEditTodo({...editTodo,title:e.target.value})}>
                </TextField>):(row.title)}
                </TableCell>
                
                <TableCell align="right">
                  {editId === row.id ? (<TextField value={editTodo.description} onChange={(e)=>setEditTodo({...editTodo,description:e.target.value})}>
                </TextField>):(row.description)}

                </TableCell>
                
                <TableCell align="right">{editId === row.id ? (
                                <DatePicker
                                  selected={editTodo.due_time}
                                  onChange={(date) => setEditTodo({...editTodo,due_time:date})}
                                  showTimeSelect
                                  timeFormat="HH:mm"
                                  timeIntervals={5}
                                  minDate={new Date()}
                                  minTime={getMinDate(new Date(editTodo.due_time))}
                                  maxTime={new Date().setHours(23, 59)}
                                  dateFormat="dd/MM/yyyy HH:mm"
                                  placeholderText="Choose Due Time"
                                  customInput={<TextField fullWidth  disabled />}
                                />
                                ):(formatTimestamp(row.due_time))}
                </TableCell>
                  
                
                <TableCell align="right">
                             {editId === row.id ? (   
                                 <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={editTodo.status}
                                    onChange={(e) => setEditTodo({...editTodo,status:e.target.value})}
                                    fullWidth
                                    
                                  >
                                    <MenuItem value={"not started"}>Not Started</MenuItem>
                                    <MenuItem value={"todo"}>To Do</MenuItem>
                                    <MenuItem value={"in progress"}>In Progress</MenuItem>
                                    <MenuItem value={"done"}>Done</MenuItem>
                                  </Select>
                                ):(row.status)}
                </TableCell>
                <TableCell align="right">
                {editId === row.id ? (<>
                    <Button onClick={() => save(row.id)}><SaveIcon></SaveIcon></Button>
                    <Button onClick={() => close(row.id)}><CloseIcon></CloseIcon></Button></>
                        ):(<>
                    <Button onClick={() => update(row.id)}><EditIcon /></Button>
                    <Button onClick={() => suppr(row.id)}><DeleteIcon /></Button></>)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );  
}   





export function PopperPopupState() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [status, setStatus] = useState('not started');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [user_id, setUserId] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/todos", {
        headers: { "Authorization": "Bearer " +token }
      });
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : []); 
    };
    fetchTodos();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/user", {
        method: "GET",
        headers: {
          "Authorization": "Bearer "+ token,
          "Content-Type": "application/json",
        }
      });
      const Userdata = await response.json();
      setUserId(Userdata.id);
    };

    useEffect(() => {
        fetchUser(); 
    }, []);

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

  const formatDateTime = (date)=>{
    let formatDate = "";
    formatDate += date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":00";
    return formatDate;
   }

  return (
    
    <PopupState variant="popper" popupId="demo-popup-popper">
      
      {(popupState) => {
          const close =()=>{
            popupState.close();
            setTitle("");
            setDescription("");
            setSelectedDate(new Date());
            setStatus("not started");
            };

          const create = async(e) =>{
            e.preventDefault();
            popupState.close();
            console.log(formatDateTime(selectedDate),status,title,description,user_id);
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3001/todos",{
              method:"POST",
              headers: {
                "Authorization": "Bearer "+ token,
                "Content-Type": "application/json",
              },
              body:JSON.stringify({
                title:title,
                description:description,
                due_time:formatDateTime(selectedDate),
                user_id:user_id,
                status:status
              })
            });
            const data = await response.json();
            console.log('data : ', data)

            setTodos(prev => Array.isArray(prev) ? [...prev, data] : [data]);

            setTitle("");
            setDescription("");
            setSelectedDate(new Date());
            setStatus("not started");

           }
          
      return (
        <div>
          <Container sx={{ overflowX: 'auto', width: '100vw' }}>
          <Button variant="contained" sx={{backgroundColor:"#147375",color:"white",margin:"10px",float:'center'}} 
          {...bindToggle(popupState)}>
            Create a New Todo +
          </Button>
          <Popper {...bindPopper(popupState)} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                
                 <form onSubmit={create} > 
                     <Container maxWidth='xs'>
                           <Paper elevation={15} sx={{marginTop: 8 , padding: 2}}>
                           <Typography component='h1' sx={{marginTop: 2, textAlign: "center"}}>Create a New Todo</Typography>
                           <Button onClick={close} sx={{color:"black",margin:"2px",float:'right'}}>
                                <CloseIcon></CloseIcon>
                              </Button>
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
                                  timeIntervals={5}
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
                         
                       </Container>
                      
                     </form>
                
              </Fade>
            )}
          </Popper>
           {todos.length === 0 ? (
            <Typography>No todos for you right now</Typography>
           ) : (
            <MyTable
              data_todos={todos}
              onDelete={(id) => setTodos(prev => prev.filter(todo => todo.id !== id))}
            />
          )}
         </Container>
        </div>
        
      );
      }}
    </PopupState>
  
  );

}

