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
  Grow,
} from '@mui/material';
import {
  Lock,
  Visibility,
  VisibilityOff,
  Email,
  Bluetooth,
  Check,
  Login,
  EmailTwoTone,
  ContentPasteOffSharp,
  Password
} from '@mui/icons-material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../style/profilePage.css';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#E7E7E7',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
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


export default function ProfilePage(){
    const[isUpdate,setIsUpdate] = useState(false);
    const[user_data,setUser_data] = useState("");
    const[todos,setTodos] = useState([]);

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
        setUser_data(userdata);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
    }, []);

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
        {BoxUserInfo(user_data,todos,isUpdate,setIsUpdate)}
      </>
    )
}




function BoxUserInfo(user_data,todos,isUpdate,setIsUpdate){
    const [newMdp,setNewMdp] = useState(false);

    const [value, setValue] = useState({
      email: "",
      newPassword: "",
      currentPassword: "",
      name: "",
      firstname: ""
    });

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
    


    console.log(user_data.email)
    console.log(value)
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
      }
      } else {
        setIsUpdate(true)
      }
      }
    
    const changeNewMdp = () =>{
      if (newMdp === true){
        setNewMdp(false);
      } else {
        setNewMdp(true)
      }
      }

    const Confirm = () => {
      const token = localStorage.getItem("token");
      
    }
  
    return (
      <Container>
            <Box sx={{width: '100%', minHeight: '100px'}}>
              {user_data.id ? (<>
              <Box className="Container">
                        <Box className="item-left" >
                            <Box className="content">
                              <AccountCircleIcon className='AccountIcon' sx={{minWidth:"100px",maxWidth:"200px",height:"auto"}}></AccountCircleIcon>
                              <Typography sx={{marginTop:2,
                                backgroundColor:"#B6B6B6",
                                borderRadius:10,
                                textTransform:"uppercase",
                                textAlign:"center",
                                marginLeft:"auto",
                                marginRight:"auto",
                                padding:1,
                                textSizeAdjust:1
                                }}>
                                {user_data.name+" "+user_data.firstname}
                              </Typography>
                              <Typography>Total number of Todo : {todos.length}</Typography>
                            </Box>
                      </Box>   
                      <Box className="item-right">
                            <Box sx={{
                                display:"flex",
                                flexDirection:"column",
                                alignItems:"flex-start",
                                padding:1.5,
                                backgroundColor:"#CFCFCF",
                                borderRadius:"20px"
                                }}>
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
                                      <Button sx={{marginTop:2,fontSize:"1.3em"}} onClick={changeUpdate}>Modify</Button>
                                    </>):(<><form onSubmit={Confirm}>
                                      <Typography sx={{fontSize:"2em",fontWeight:"bold",marginBottom:2}} >User Information : Edit</Typography>

                                      <Typography sx={{fontSize:"1.5em",fontWeight:"bold"}}>Email :</Typography>
                                      <TextField className="select" value={value.email} onChange={(e) => setValue(prev => ({...prev, email: e.target.value}))}  sx={{mb: 2}} fullWidth required/>

                                      <Typography sx={{fontSize:"1.5em",fontWeight:"bold"}}>Name : </Typography>
                                      <TextField className="select" value={value.name} onChange={(e) => setValue(prev => ({...prev, name: e.target.value}))}  sx={{mb: 2}} fullWidth required/>

                                      <Typography sx={{fontSize:"1.5em",fontWeight:"bold"}}>Firstname : </Typography>
                                      <TextField className="select" value={value.firstname} onChange={(e) => setValue(prev => ({...prev, firstname: e.target.value}))}  sx={{mb: 2}} fullWidth required/>
                                      {newMdp ? (<>
                                      <Typography sx={{fontSize:"1.5em",fontWeight:"bold"}}>New Password : {<Button onClick={changeNewMdp}>
                                        not new password
                                      </Button>}</Typography>
                                      <TextField className="select" value={value.newPassword} onChange={(e) => setValue(prev => ({...prev, newPassword: e.target.value}))}  sx={{mb: 2}} fullWidth required/>
                                        </>
                                      ):(<Button onClick={changeNewMdp}>
                                        New Password
                                      </Button>)}
                                      <Typography sx={{fontSize:"1.5em",fontWeight:"bold"}}>Actually Password : </Typography>
                                      <TextField className="select" value={value.currentPassword} onChange={(e) => setValue(prev => ({...prev, currentPassword: e.target.value}))} sx={{mb: 2}} fullWidth required/>

                                      <Button sx={{marginTop:2,fontSize:"1.3em"}} onClick={changeUpdate}>Cancel</Button>
                                      <Button type='submit' sx={{marginTop:2,fontSize:"1.3em"}} >Confirm</Button></form>

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

   {/*<Box>
              <Select
                  fullWidth
                  sx={{mb: 2,width:300,float:"center"}}
                  value={isUpdate}
                  onChange={(e)=>setIsUpdate(e.target.value)}
                  
                  >
                  <MenuItem value={"none"}>None</MenuItem>
                  <MenuItem value={"email"}>Email</MenuItem>
                  <MenuItem value={"name"}>Name</MenuItem>
                  <MenuItem value={"firstname"}>Firstname</MenuItem>
                  <MenuItem value={"password"}>Password</MenuItem>
        </Select>
        <TextField className='select'  value={valueUpdate} onChange={(e)=>setValueUpdate(e.target.value)} required/>
      <Button>

      </Button>
    </Box>*/}
