import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Stack, Chip } from '@mui/material';
import { createTheme } from '@mui/material/styles';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import { AppProvider } from '@toolpad/core/AppProvider';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';
import { useNavigate } from 'react-router-dom';


  const NAVIGATION = [
  {
    kind: 'header',
    title: 'E-TODO',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <CalendarMonthIcon />,
  },
  {
    segment: 'Todos',
    title: 'Todos',
    icon: <AssignmentLateIcon />,
  },
  {
    kind: 'divider',
  },
  
  {
    segment: 'Profile',
    title: 'Profile',
    icon: <AccountCircleIcon />,
    children: [
      {
        segment: 'Datas',
        title: 'Datas',
        icon: <ManageAccountsIcon />,
      },
      
    ],
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
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

function DemoPageContent({  }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>ok</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function CustomAppTitle() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Typography variant="h6">E-ToDo Charly/Baptiste</Typography>
      <Chip size="small" label="Test" color="info" />
    </Stack>
  );
}
  

function DashboardLayoutBasic(props) {
  const { window } = props;
  const [session, setSession] = React.useState({
    user: {
      name: '',
      email: '',
      image: <AccountCircleIcon />,
    },
  });

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
      const token = localStorage.getItem("token");
      const response = fetch("http://localhost:3000/api/users/user",{
        method : "GET",
        headers:{
          "Authorization":"Bearer "+token,
          "Content-Type":"application/json"
        }
      })
      const userdata = response.json();
      console.log(userdata);
        setSession({
          user: {
            name: userdata.name,
            email: userdata.email,
            image: <AccountCircleIcon />,
          },
        });
      },
      signOut: () => {
        
      },
    };
  }, []);
  const router = useDemoRouter('/dashboard');

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
