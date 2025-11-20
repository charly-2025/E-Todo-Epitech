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
import { AccessAlarm, FireTruck, Search, ThreeDRotation } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import Autocomplete from '@mui/material/Autocomplete';
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


import TableSortLabel from '@mui/material/TableSortLabel';

import { visuallyHidden } from '@mui/utils';

function formatTimestamp(timestamp) {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  return date.toLocaleString("fr-FR", {
    timeZone:"Europe/Paris", 
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function MyTable({data_todos, onDelete, onUpdate,onDisableAll,editId,setEditId}) {
  const [todos, setTodos] = useState([])
  const [editTodo, setEditTodo] = useState({title:"",description:"",due_time:"",status:""})
  const [user_id, setUserId] = useState("");

  const updateTodo = (editTodo) => {
    setTodos(
      prev=> prev.map(
        todo =>(todo.id === editTodo.id ? editTodo : todo)
      )
    );
  }

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/todos", {
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
      const response = await fetch("http://localhost:3000/user", {
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
    const connection = await fetch("http://localhost:3000/todos/" +todo_id, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " +token,
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
          id: editTodo.id,
          title:editTodo.title,
          description:editTodo.description,
          due_time:formatDateTime(editTodo.due_time),
          user_id:user_id,
          status:editTodo.status
        })
      });
      const data = await connection.json();
      console.log(data);
      onUpdate(data);
      updateTodo(data);
  }



  const suppr = async (todo_id) => {
    const token = localStorage.getItem("token");
    try {
      const connection = await fetch("http://localhost:3000/todos/" +todo_id, {
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
                                  customInput={<TextField fullWidth disabled InputProps={{ readOnly: true }}/>}
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
                <TableCell align="center">
                {editId === row.id ? (<>
                    <Button onClick={() => save(row.id)} disabled={onDisableAll}><SaveIcon></SaveIcon></Button>
                    <Button onClick={() => close(row.id) } disabled={onDisableAll}><CloseIcon></CloseIcon></Button></>
                        ):(<>
                    <Button onClick={() => update(row.id)} disabled={onDisableAll}><EditIcon /></Button>
                    <Button onClick={() => suppr(row.id)} disabled={onDisableAll}><DeleteIcon /></Button></>)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    
    );  
  
  }


export function PopperPopupState() {
  const [searchTodo,setSearchTodo] = useState("")
  const [editId,setEditId] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [status, setStatus] = useState('not started');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [user_id, setUserId] = useState("");
  const [todos, setTodos] = useState([]);
  const [allDisable,setDisableAll] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/todos", {
        headers: { "Authorization": "Bearer " +token }
      });
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : []); 
    };
    fetchTodos();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/user", {
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

  const updateTodo = (editTodo) => {
    setTodos(
      prev=> prev.map(
        todo =>(todo.id === editTodo.id ? editTodo : todo)
      )
    );
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
            setDisableAll(false);
            };

          const create = async(e) =>{
            e.preventDefault();
            popupState.close();
            console.log(formatDateTime(selectedDate),status,title,description,user_id);
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/todos",{
              method:"POST",
              headers: {
                "Authorization": "Bearer "+ token,
                "Content-Type": "application/json",
              },
              body:JSON.stringify({
                title: title.charAt(0).toUpperCase() + title.slice(1),
                description: description.charAt(0).toUpperCase() + description.slice(1),
                due_time:formatDateTime(selectedDate),
                user_id:user_id,
                status: status,
              })
            });
            const data = await response.json();
            console.log('data : ', data)

            setTodos(prev => Array.isArray(prev) ? [...prev, data] : [data]);

            setTitle("");
            setDescription("");
            setSelectedDate(new Date());
            setStatus("not started");
            setDisableAll(false);
           }
          
      return (
        <div>
          <Container sx={{ overflowX: 'auto', width: '100vw' }}>
          <Button disabled={allDisable || editId !== null } variant="contained" sx={{backgroundColor:"#147375",color:"white",margin:"10px",float:'right'}} 
          onClick={()=>{setDisableAll(true);popupState.open()}}>
            Create a New Todo +
          </Button>
          <Popper  {...bindPopper(popupState)} transition modifiers={[
                              {
                                name: "offset",
                                options: {
                                  offset: [0, 20],
                                },
                              },
                              {
                                name: "flip",
                                enabled: false,
                              }
                            ]}
                            sx={{
                              left: "50% !important",
                              top: "20px !important",
                              transform: "translateX(-50%) !important"
                            }}
                          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                
                 <form onSubmit={create} > 
                    < div style={{ minWidth:"250px",maxWidth:"420px"}}>  
                           <Paper elevation={15} sx={{marginTop: 10 , padding: 2,position:"relative"}}>
                            <Button onClick={close} sx={{color:"black",position:"absolute",top:10,right:10,fontWeight:"bold"}}>
                                <CloseIcon></CloseIcon></Button>
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
                                  timeIntervals={5}
                                  minDate={new Date()}
                                  minTime={getMinDate(selectedDate)}
                                  maxTime={new Date().setHours(23, 59)}
                                  dateFormat="dd/MM/yyyy HH:mm"
                                  placeholderText="Choose Due Time"
                                  customInput={<TextField label="Due Time" fullWidth sx={{mb: 2}} disabled InputProps={{ readOnly: true }}/>}
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
                                    <MenuItem value={"Todo"}>To Do</MenuItem>
                                    <MenuItem value={"In progress"}>In Progress</MenuItem>
                                    <MenuItem value={"Done"}>Done</MenuItem>
                                  </Select>
                                  
                             <Button className="select" type="submit" variant="contained" fullWidth sx={{mt: 1}}>Create New Todo</Button>
                             
                           </Box>
                         </Paper>
                        </div>
                     </form>
                
              </Fade>
            )}
          </Popper>
           {todos.length === 0 ? (
            <Typography>No todos for you right now</Typography>
           ) : (<>
           <ComboBox 
            Options={todos}
            setSearchTodo={setSearchTodo}
            searchTodo={searchTodo}
            allDisable={allDisable}

            />
            <MyTable
              data_todos={todos}
              onDelete={(id) => setTodos(prev => prev.filter(todo => todo.id !== id))}
              onUpdate={updateTodo}
              onDisableAll={allDisable}
              editId={editId}
              setEditId={setEditId}
              sx={{marginTop:"20px"}}
  
            />
            </>
          )}
         </Container>
        </div>
        
      );
      }}
    </PopupState>
  
  );

}

export function ComboBox({Options, searchTodo, setSearchTodo,allDisable}) {
  const SearchingTodo = (event, option) => {
    if (option) {
      setSearchTodo(option.id);
    } else {
      setSearchTodo("");
  };
  }
  if(Options != undefined && !allDisable){
      return (
        <Autocomplete
          disablePortal
          options={Options}
          getOptionLabel={(option)=>option.title+"; "+option.description+"; "+formatTimestamp(option.due_time)+"; "+option.status}
          sx={{minWidth:350,maxWidth:650,marginTop:10,float:"center"}}
          onChange={SearchingTodo}
          renderInput={(params) => <TextField {...params} label="Search Todo"/>}
        />
      );
    } else {
      return <div>Aucune option n'est valide</div>
    } 
}
