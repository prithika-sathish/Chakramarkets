import { useState, useLayoutEffect, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getThemeMode, setThemeMode, type ThemeMode } from '../../features/theme/themeSlice';
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import chakraLogo from '../../assets/chakra-logo.svg';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Drawer from "@mui/material/Drawer";
import { useNotifications } from '../../hooks/useNotifications';
import "@fontsource/exo/400.css";

const Header = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector(getThemeMode);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [value, setValue] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { getUnreadCount, getActiveAlertsCount } = useNotifications();

  const changeThemeMode = (mode: ThemeMode) => {
    dispatch(setThemeMode(mode));
  };

  const renderLogo = () => {
    return (
      <>
        <Typography color="inherit" component="div" sx={{ height: "32px", width: "32px", ml: 2, mr: 1 }}>
          <img src={chakraLogo} alt="ChakraMarkets logo" style={{ height: "100%", width: "100%" }}/>
        </Typography>
        <Typography variant="h6" color="inherit" component="div" 
          sx={{ fontWeight: "600", color: "text.primary", fontFamily: "Exo", fontSize: "20px" }}
        >
          ChakraMarkets
        </Typography>
      </>
    );
  };

  const handleChange = (_e: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);

    if (newValue === 0) {
      navigate('/portfolio-manager');
    } else if (newValue === 1) {
      navigate('/');
    } else if (newValue === 2) {
      navigate('/position-tracker');
    } else if (newValue === 3) {
      navigate('/trade-planner');
    } else if (newValue === 4) {
      navigate('/custom-alerts');
    };
  };

  useLayoutEffect(() => {
    if (path === '/portfolio-manager') {
      setValue(0);
    } else if (path === '/') {
      setValue(1);
    } else if (path === '/position-tracker') {
      setValue(2);
    } else if (path === '/trade-planner') {
      setValue(3);
    } else if (path === '/custom-alerts') {
      setValue(4);
    };
  }, [path]);

  useEffect(() => {
    if (isLargeScreen) {
      setDrawerOpen(false);
    };
  }, [isLargeScreen]);

  const totalNotifications = getUnreadCount() + getActiveAlertsCount();

  return (
    <AppBar position='fixed' elevation={0} sx={{ 
      backgroundColor: "background.paper", 
      borderBottom: 1, 
      borderBottomColor: "divider", 
      zIndex: (theme) => theme.zIndex.drawer + 2 
    }}>
      <Toolbar sx={{ minHeight: "64px" }}>
        <div style={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          {renderLogo()}
        </div>
        
        {isLargeScreen && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Tabs value={value} onChange={handleChange} sx={{ minHeight: "48px" }}>
              <Tab 
                disableRipple 
                label="Portfolio Manager" 
                sx={{ 
                  textTransform: "none", 
                  py: 1.5,
                  px: 3,
                  fontSize: "14px",
                  fontWeight: 500
                }} 
              />
              <Tab 
                disableRipple 
                label="Welcome" 
                sx={{ 
                  textTransform: "none", 
                  py: 1.5,
                  px: 3,
                  fontSize: "14px",
                  fontWeight: 500
                }} 
              />
              <Tab 
                disableRipple 
                label="Position Tracker" 
                sx={{ 
                  textTransform: "none", 
                  py: 1.5,
                  px: 3,
                  fontSize: "14px",
                  fontWeight: 500
                }} 
              />
              <Tab 
                disableRipple 
                label="Trade Planner" 
                sx={{ 
                  textTransform: "none", 
                  py: 1.5,
                  px: 3,
                  fontSize: "14px",
                  fontWeight: 500
                }} 
              />
              <Tab 
                disableRipple 
                label="Custom Alerts" 
                sx={{ 
                  textTransform: "none", 
                  py: 1.5,
                  px: 3,
                  fontSize: "14px",
                  fontWeight: 500
                }} 
              />
            </Tabs>
          </div>
        )}
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="notifications"
            sx={{ color: "text.primary" }}
            onClick={() => navigate('/custom-alerts')}
          >
            <Badge badgeContent={totalNotifications} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="toggle theme"
            sx={{ color: "text.primary" }}
            onClick={() => changeThemeMode(themeMode === "light" ? "dark" : "light")}
          >
            {themeMode === "light" ? <DarkModeIcon/> : <LightModeIcon/>}
          </IconButton>
          
          <IconButton
            size="small"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen((prevState) => !prevState)}
            sx={{ 
              display: { xs: 'flex', lg: 'none'}, 
              color: "text.primary" 
            }}
          >
            {drawerOpen ? <ArrowForwardIcon /> : <MenuIcon />}
          </IconButton>
        </div>
        
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <div style={{ width: "280px", paddingTop: "64px" }}>
            <Tabs 
              value={value} 
              onChange={handleChange} 
              orientation="vertical" 
              variant="scrollable" 
              sx={{ mt: 2 }}
              TabIndicatorProps={{ sx: { left: 0, width: "3px" } }}
            >
              <Tab 
                disableRipple 
                label="Portfolio Manager" 
                sx={{ 
                  textTransform: "none", 
                  py: 2,
                  px: 3,
                  fontSize: "14px",
                  fontWeight: 500
                }} 
              />
              <Tab 
                disableRipple 
                label="Welcome" 
                sx={{ 
                  textTransform: "none", 
                  py: 2,
                  px: 3,
                  fontSize: "14px",
                  fontWeight: 500
                }} 
              />
              <Tab 
                disableRipple 
                label="Position Tracker" 
                sx={{ 
                  textTransform: "none", 
                  py: 2,
                  px: 3,
                  fontSize: "14px",
                  fontWeight: 500
                }} 
              />
              <Tab 
                disableRipple 
                label="Trade Planner" 
                sx={{ 
                  textTransform: "none", 
                  py: 2,
                  px: 3,
                  fontSize: "14px",
                  fontWeight: 500
                }} 
              />
              <Tab 
                disableRipple 
                label="Custom Alerts" 
                sx={{ 
                  textTransform: "none", 
                  py: 2,
                  px: 3,
                  fontSize: "14px",
                  fontWeight: 500
                }} 
              />
            </Tabs>
          </div>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;