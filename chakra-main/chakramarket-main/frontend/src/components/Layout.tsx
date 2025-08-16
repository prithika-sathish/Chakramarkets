import { useSelector } from 'react-redux';
import { getThemeMode } from '../features/theme/themeSlice';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Header from './Common/Header';
import { lightTheme, darkTheme } from '../theme';

const Layout = () => {
  const themeMode = useSelector(getThemeMode);

  return (
    <ThemeProvider theme={themeMode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <Header />
      <Box sx={{ 
        height: "calc(100vh - 64px)", 
        position: "relative", 
        width: "100%",
        mt: "64px"
      }}>
        <Container maxWidth="xl" sx={{ 
          py: 3,
          px: { xs: 2, sm: 3, md: 4 }
        }}>
          <Outlet />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;