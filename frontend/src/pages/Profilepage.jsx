import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Alert,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../style/profilePage.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Snackbar from '@mui/material/Snackbar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';



function formatTimestamp(timestamp) {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  return date.toLocaleString("fr-FR", {
    timeZone:"Europe/Paris", 
    dateStyle: "short",
    timeStyle: "short",
  });
}


export default function ProfilePage({user_data,setUser_data}){
    const[isUpdate,setIsUpdate] = useState(false);
    const[todos,setTodos] = useState([]);
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
    return(
      <>
        {BoxUserInfo(user_data,setUser_data,todos,isUpdate,setIsUpdate)}
      </>
    )
}




function BoxUserInfo(user_data,setUser_data,todos,isUpdate,setIsUpdate){
    const [newMdp,setNewMdp] = useState(false);
    const [showPassword1,setShowPassword1] = useState(false);
    const [showPassword2,setShowPassword2] = useState(false);
    const [invalide,setInvalide] = useState(false);
    const [value, setValue] = useState({
      email: "",
      newPassword: "",
      currentPassword: "",
      name: "",
      firstname: ""
    });

    const [snackbar, setSnackbar] = useState(null);
    const handleCloseSnackbar = () => setSnackbar(null);

    useEffect(() => {
      if (user_data && user_data.id) {
        setValue({
          email: user_data.email,
          newPassword: "",
          currentPassword: "",
          name: user_data.name,
          firstname: user_data.firstname
        });
      }
    }, [user_data]);
    
    const changeUpdate = () =>{
      if (isUpdate === true){
        setIsUpdate(false);
        if (newMdp) {setNewMdp(false);}
        if (user_data && user_data.id) {
        setValue({
          email: user_data.email,
          newPassword: "",
          currentPassword: "",
          name: user_data.name,
          firstname: user_data.firstname
        });
        setInvalide(false);
        HidePass();
      }
      } else {
        setIsUpdate(true)
      }
      }
    
      const changeNewMdp = () =>{
        if (newMdp === true){
          setNewMdp(false);
          setValue(prev => ({...prev, newPassword: ""}));
        } else {
          setNewMdp(true)
        }
      }

      const changeShowPassword1 = () => {
      if(showPassword1){
        setShowPassword1(false)
      } else {
        setShowPassword1(true)
      }
    }

    const changeShowPassword2 = () => {
      if(showPassword2){
        setShowPassword2(false)
      } else {
        setShowPassword2(true)
      }
    }
    
    const HidePass = () => {
      setShowPassword1(false);
      setShowPassword2(false);
    }


    const Confirm = async(e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const connection = await fetch("http://localhost:3000/login",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        email:user_data.email,
        password:value.currentPassword})
      })
      if (connection.ok) {
          const response = await fetch("http://localhost:3000/users/" + user_data.id, {
            method: "PUT",
            headers: {
              "Authorization": "Bearer " +token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: value.email,
              password: newMdp ? value.newPassword : value.currentPassword,
              name: value.name,
              firstname: value.firstname,
            })
          });
          
          if (!response.ok) {
            throw new Error(response.status)
          }
          setSnackbar({ children: "Your datas has been updated and saved", severity: 'success'})
          const data = await response.json();
          setUser_data(data);
          setIsUpdate(false);
          setNewMdp(false);
          setInvalide(false);
          setValue({
            email: data.email,
            newPassword: "",
            currentPassword: "",
            name: data.name,
            firstname: data.firstname
          });
          HidePass();
          setInvalide(false);
      } else {
        setInvalide(true);
        setSnackbar({ children: "Password Incorrect. Try again.", severity: 'error'})
      }
    }

    return (
      <Container>
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
            <Box sx={{width: '100%', minHeight: '100px'}}>
              {user_data.id ? (<>
              <Box className="Container">
                        <Box className="item-left" >
                            <Box className="contenti">
                              <AccountCircleIcon className='AccountIcon' >
                                <form className='editImage'>
                                  <label for="imageUplaod" ><EditIcon></EditIcon></label>
                                  <input type='file' id="imageUpload" name="image" accept='image/*' required />
                                </form>
                              </AccountCircleIcon>
                              <Typography 
                                className='Name'
                              >
                                {user_data.name+" "+user_data.firstname}
                              </Typography>

                              <Typography className='todo'>{todos.length} Todos</Typography>
                            </Box>
                      </Box>   
                      <Box className="item-right">
                            <Box className="contenti">
                                  {!isUpdate ? (<>
                                      <Typography sx={{fontSize:"2em",fontWeight:"bold",marginBottom:2}} >User Information : Read</Typography>

                                      <Typography sx={{fontSize:"1.5em",fontWeight:"bold"}}>Account created on : </Typography>
                                      <Typography>{formatTimestamp(user_data.created_at)}</Typography>

                                      <Typography sx={{fontSize:"1.5em",fontWeight:"bold"}}>Email :</Typography>
                                      <Typography> {user_data.email}</Typography>

                                      <Typography sx={{fontSize:"1.5em",fontWeight:"bold"}}>Name : </Typography>
                                      <Typography>{user_data.name}</Typography>

                                      <Typography sx={{fontSize:"1.5em",fontWeight:"bold"}}>Firstname : </Typography>
                                      <Typography>{user_data.firstname}</Typography>
                
                                      <Button variant="contained" sx={{marginTop:2,fontSize:"1.3em"}} onClick={changeUpdate}>Modify</Button>
                                    </>):(<><form className="updateForm" onSubmit={Confirm}>
                                      <Typography sx={{fontSize:"2em",fontWeight:"bold",marginBottom:2}} >User Information : Edit</Typography>

                                      <Typography sx={{fontSize:"1.5em",fontWeight:"bold"}}>Email :</Typography>
                                      <TextField className="select" type='email' value={value.email} onChange={(e) => setValue(prev => ({...prev, email: e.target.value}))}  sx={{mb: 2}} fullWidth required/>

                                      <Typography sx={{fontSize:"1.5em",fontWeight:"bold"}}>Name : </Typography>
                                      <TextField className="select" value={value.name} onChange={(e) => setValue(prev => ({...prev, name: e.target.value}))}  sx={{mb: 2}} fullWidth required/>

                                      <Typography sx={{fontSize:"1.5em",fontWeight:"bold"}}>Firstname : </Typography>
                                      <TextField className="select" value={value.firstname} onChange={(e) => setValue(prev => ({...prev, firstname: e.target.value}))}  sx={{mb: 2}} fullWidth required/>
                                      {newMdp ? (<>
                                      <Typography sx={{fontSize:"1.5em",fontWeight:"bold"}}>New Password : {<Button variant="contained" onClick={changeNewMdp}>
                                        not new password
                                      </Button>}</Typography>
                                      <TextField className="select" type={ showPassword1 ? "text" :"password"} value={value.newPassword} onChange={(e) => setValue(prev => ({...prev, newPassword: e.target.value}))}  sx={{mb: 2}} fullWidth required slotProps={{
                                                        input:{
                                                          endAdornment:(
                                                            <InputAdornment position="end">
                                                              <Button onClick={changeShowPassword1}>
                                                                  { showPassword1 ? (
                                                                    <VisibilityOffIcon></VisibilityOffIcon>
                                                                    ):(
                                                                    <VisibilityIcon></VisibilityIcon>)}
                                                                </Button>
                                                            </InputAdornment>
                                                          )
                                                        }
                                                      }}/>
                                        </>
                                      ):(<Button variant="contained" onClick={changeNewMdp}>
                                        New Password
                                      </Button>)}
                                      <Typography sx={{fontSize:"1.5em",fontWeight:"bold"}}>Actual Password : </Typography>
                                      <TextField className="select" type={ showPassword2 ? "text" :"password"} value={value.currentPassword} onChange={(e) => setValue(prev => ({...prev, currentPassword: e.target.value}))} sx={{mb: 2}} fullWidth required slotProps={{
                                                        input:{
                                                          endAdornment:(
                                                            <InputAdornment position="end">
                                                              <Button onClick={changeShowPassword2}>
                                                                  { showPassword2 ? (
                                                                    <VisibilityOffIcon></VisibilityOffIcon>
                                                                    ):(
                                                                    <VisibilityIcon></VisibilityIcon>)}
                                                                </Button>
                                                            </InputAdornment>
                                                          )
                                                        }
                                                      }}/>

                                      <div>
                                      <Button variant="contained" sx={{marginTop:2,fontSize:"1.3em"}} onClick={changeUpdate}>Cancel</Button>
                                      <Button variant="contained"type='submit' sx={{marginTop:2,fontSize:"1.3em"}} >Confirm</Button>
                                      </div>
                                      </form>
                                      
                                </>)}
                            </Box>
                    </Box>
            </Box>
            
              </>):(
                <Typography>No user data</Typography>)}
            </Box>

          </Container>
          
    )

}

