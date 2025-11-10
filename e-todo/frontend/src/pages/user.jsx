import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import { AppProvider } from '@toolpad/core/AppProvider';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';


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
        setSession({
          user: {
            name: '',
            email: '',
            image: <AccountCircleIcon />,
          },
        });
      },
      signOut: () => {
        setSession(null);
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
        <DashboardLayout>
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
