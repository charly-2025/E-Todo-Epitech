import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useState, useMemo, useEffect } from 'react';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import { AppProvider} from '@toolpad/core/AppProvider';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal'; 
import { useNavigate } from 'react-router-dom';

import '../style/user.css'
import { ETodoCalendar } from "./calendar"
import "react-big-calendar/lib/css/react-big-calendar.css";
import { PopperPopupState } from './methodRoute';
import ProfilePage from './Profilepage';
import useUserData from '../utils/getUserData';

  const NAVIGATION = [
  {
    kind: 'header',
    title: 'eTodo',
  },
  {
    segment: 'planning',
    title: 'Schedule',
    icon: <CalendarMonthIcon />,
  },
  {
    segment: 'todos',
    title: 'Todos',
    icon: <AssignmentLateIcon />,
  },
  {
    kind: 'divider',
  },
  
  {
    segment: 'profile',
    title: 'Profile',
    icon: <AccountCircleIcon />,
    children: [
      {
        segment: 'datas',
        title: 'My datas',
        icon: <ManageAccountsIcon />,
      },
      
    ],
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: true,
    dark: {
      palette: {
        background: {
          default: '#15376aff',
          paper: '#183c7aff',
        },
        primary: {
          main: '#000000ff', 
          contrastText: '#fff',
        },
        text: {
          primary: '#fff',
          secondary: '#fff',
        },
      },
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      xl: 1536,
    },
  },
});

function DemoPageContent({pathname, userdata,setUserData}) {
  let content = ''
  console.log("local set item with : "+pathname);
  console.log(pathname)
  switch (pathname) {
        case '/planning':
          content= (
            <>
            <ETodoCalendar />
            </>
          )
          break;
        case '/todos':
          content = (
              <>
              <Typography sx={{marginBottom:"20px",fontSize:"1.6em",fontWeight:"bold"}}>Your Todos</Typography>
              <PopperPopupState/>
              </>
            )
          break;
        case '/profile/datas':
          content = (
            <>
            <ProfilePage 
                user_data={userdata}
                setUser_data={setUserData}/>
            </>
          )
          break;
        }
  return (
    <Box
      sx={{
        py: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        width: '100vw',
        overflowX:"hidden"
       
      }}>
        
      {content}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function CustomAppTitle() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Typography variant="h6">eTodo Charly/Baptiste</Typography>
    </Stack>
  );
}
  
  function DashboardLayoutBasic(props) {
    const navigate = useNavigate();
    const {window} = props;
    const [session, setSession] = useState(null);
    const[userdata,setUserData] = useUserData();

    useEffect(() => {
      if(userdata){
        setSession({
            user: {
              name: userdata.name + ' '+ userdata.firstname,
              email: userdata.email,
              image: <AccountCircleSharpIcon />,
            },
          });
        }
    
    },[userdata]);

  const authentication = useMemo(() => {
    return {
      signOut: () => {
        localStorage.removeItem("auth");
        localStorage.removeItem("token");
        setSession(null);
        navigate('/login')
      },
    };
  },);

  const demoWindow = window !== undefined ? window : undefined;
  

  const router = useDemoRouter("/planning");


    

  return (

    <DemoProvider window={demoWindow}>
    <AppProvider
        session={session}
        authentication={authentication}
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        window={demoWindow}
      >
        <DashboardLayout 
          slots={{
            appTitle: CustomAppTitle,}} defaultSidebarCollapsed >
          <DemoPageContent 
                pathname={router.pathname} 
                userdata={userdata} 
                setUserData={setUserData}/>
        </DashboardLayout>
      </AppProvider>
      
    </DemoProvider>
  );
}

DashboardLayoutBasic.propTypes = {
   
  window: PropTypes.func,
};

export default DashboardLayoutBasic;

