import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Stack, Chip, createChainedFunction } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useState, useMemo, useEffect } from 'react';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import Button from '@mui/material/Button';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal'; 
import { useNavigate } from 'react-router-dom';

import '../style/user.css'
import { ETodoCalendar } from "./calendar"
import "react-big-calendar/lib/css/react-big-calendar.css";
import { MyTable,PopperPopupState } from './methodRoute';

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
          default: '#0a192f',
          paper: '#112240',
        },
        primary: {
          main: '#64ffda', 
          contrastText: '#ffffff',
        },
        text: {
          primary: '#e6f1ff',
          secondary: '#8892b0',
        },
      },
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({pathname}) {
  let content = ''
  console.log(pathname)
  switch (pathname) {
        case '/planning':
          content= <ETodoCalendar />
          break;
        case '/todos':
          content = (
              <>
              <Typography>Your Todos</Typography>
              <PopperPopupState/>
              <MyTable />
              </>
            )
          break;
        case '/profile/datas':
          content = <Typography>datas</Typography>
          break;
        }
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
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
  const { window } = props;
  const [session, setSession] = useState(null);


  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3001/user", {
          method: "GET",
          headers: {
            "Authorization": "Bearer "+ token,
            "Content-Type": "application/json",
          },
        });
        const userdata = await response.json();
        setSession({
          user: {
            name: userdata.name + ' '+ userdata.firstname,
            email: userdata.email,
            image: <AccountCircleSharpIcon />,
          },
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, []);

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

  const router = useDemoRouter('/planning');

  const demoWindow = window !== undefined ? window() : undefined;

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
            appTitle: CustomAppTitle,}}>
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
      </AppProvider>
      
    </DemoProvider>
  );
}

DashboardLayoutBasic.propTypes = {
   
  window: PropTypes.func,
};

export default DashboardLayoutBasic;
