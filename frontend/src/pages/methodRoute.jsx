import React from 'react';
import Popper from '@mui/material/Popper';
import PopupState, { bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import { useState, useEffect, useCallback } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CloseIcon from '@mui/icons-material/Close';

import Snackbar from '@mui/material/Snackbar';

import DeleteIcon from '@mui/icons-material/Delete';

import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,


} from '@mui/material';
import Badge from '@mui/material/Badge';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  FilterPanelTrigger,

} from '@mui/x-data-grid';  



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
  const [editedTodos, setEditedTodos] = useState({});
  const [editIds, setEditIds] = useState([]);
  const [user_id, setUserId] = useState("");

  const [selectedRows, setSelectedRows] = useState({
    type: 'include',
    ids: new Set(),
  });

  const [snackbar, setSnackbar] = useState(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const useFakeMutation = () => {
    return useCallback(
      (user) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (user.title?.trim() === '' && (user.status.toLowerCase() == 'not started' || user.status.toLowerCase() == 'in progress' || user.status.toLowerCase() == 'todo' || user.status.toLowerCase() == 'done')){
              reject(new Error('Error while updating'));
            } else {
              resolve({ ...user, title: user.title?.toUpperCase() });
            }
          }, 200);
        }),
      [],
    );
  };


  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/user/todos", {
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



  const formatDateTime = (date)=>{
    let formatDate = "";
    formatDate += date[6]+date[7]+date[8]+date[9]+'-'+date[3]+date[4]+'-'+date[0]+date[1]+date[10]+date[11]+date[12]+date[13]+date[14]+date[15]+':00'
    return formatDate;
   }


  const mutateRow = useFakeMutation();

  const processRowUpdate = useCallback(
    async (todoedit, data_todos) => {
      if (new Date(todoedit.due_time) < new Date() === true && todoedit.due_time != data_todos.due_time) {
        setSnackbar({ children: "Error during the update , The date cannot be earlier than the date the todo was created.", severity: 'info'});
        return todoedit;
      }
      console.log('Editing todo:', todoedit);
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3000/todos/" + todoedit.id, {
          method: "PUT",
          headers: {
            "Authorization": "Bearer " +token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: todoedit.title,
            description: todoedit.description,
            due_time: todoedit.due_time,
            user_id: todoedit.user_id,
            status: todoedit.status,
          })
        });
        
        if (!response.ok) {
          throw new Error(response.status)
        }
        
        const Todoupdated = await response.json();
        onUpdate(Todoupdated);
        
        const result = await mutateRow(Todoupdated);
        setSnackbar({ children: "Todo updated and saved!", severity: "success" });
        
        return {
          id: Todoupdated.id,
          title: Todoupdated.title,
          description: Todoupdated.description,
          due_time: formatDateTime(formatTimestamp(Todoupdated.due_time)),
          status: Todoupdated.status,
          user_id: Todoupdated.user_id
        };
        
      } catch (error) {
        console.error(error);
        setSnackbar({ children: 'Error during the update , check if text fields are all correct.', severity: 'error' });
        return todoedit;
      }
    },
    [mutateRow, onUpdate] 
  );

  const handleProcessRowUpdateError = React.useCallback((error) => {
    setSnackbar({ children: error.message, severity: 'error' });
  }, []);


  const suppr = async (todo_id) => {
    console.log('delete '+ todo_id)
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

  const columns = [
    { field: 'id', headerName: 'ID', type: 'number',flex: 0.3,  minWidth: 70,editable: false},
    { field: 'title', headerName: 'Title', flex: 1,  minWidth: 150 ,editable: true},
    { field: 'description', headerName: 'Description', flex: 1.5,  minWidth: 200 ,editable: true},
    { field: 'due_time', headerName: 'Due_Time' , flex: 1.5,  minWidth: 160 ,editable: true},
    { field: 'status', headerName: 'Status', flex: 1,  minWidth: 150 ,type: 'singleSelect',
      valueOptions: ['not started', 'todo', 'in progress', 'done'], editable: true},
  ];

      const rows = data_todos.map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        due_time: formatDateTime(formatTimestamp(row.due_time)),
        status: row.status,  
        user_id: row.user_id,
        create_at: formatDateTime(formatTimestamp(row.create_at))
    })
  ); 

  
  const paginationModel = { page: 0, pageSize: 10 };

  const CustomToolbar = ({ selectedRows, onDelete }) => (
    <Toolbar>
      {selectedRows.ids.size > 0 ? (
        <>        
          <ToolbarButton onClick={() => onDelete(selectedRows.ids)}>
            <Badge>
              <DeleteIcon />
            </Badge>
          </ToolbarButton>   
        </>
      ) : (
      <>
      <FilterPanelTrigger
        render={(props, state) => (
          <ToolbarButton {...props} color="default">
            <Badge badgeContent={state.filterCount} color="primary" variant="dot">
              <FilterListIcon />
            </Badge>
          </ToolbarButton>
        )}
      />
      
      </>
    )}
  </Toolbar>
);
  

  const handleDelete = (ids) => {
    const idArray = Array.isArray(ids) ? ids : Array.from(ids);
    idArray.forEach(id => suppr(id));
  };

  
  return (

    <Box>
      <Paper sx={{ height: '70vh', width: '100%'}}>
        <DataGrid
          sx={{
            boxShadow: 2,
            border: 1,
            borderColor: 'light',
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
          }}
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        checkboxSelection
        pageSizeOptions={[0, 10]}
        rowSelectionModel={selectedRows}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        editMode="row"
        disableRowSelectionOnClick 
        onRowSelectionModelChange={(selection) => {
          setSelectedRows(selection ?? { type: 'include', ids: new Set() });
        }}
        slots={{
          toolbar: CustomToolbar,
        }}
        slotProps={{
           toolbar: { selectedRows, onDelete: handleDelete },
        }}
        showToolbar
      />
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={2000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
      </Paper>
    </Box>
    );  
  
  }


export function PopperPopupState() {
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
      const res = await fetch("http://localhost:3000/user/todos", {
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
          <Button disabled={allDisable || editId !== null } variant="contained" sx={{backgroundColor:"#147375",color:"white",margin:"10px",float:'center'}} 
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
            <MyTable
              data_todos={todos}
              onDelete={(id) => setTodos(prev => prev.filter(todo => todo.id !== id))}
              onUpdate={updateTodo}
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


