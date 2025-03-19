import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  ThemeProvider, 
  CssBaseline,
  IconButton,
  useMediaQuery,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  // Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { 
  // DarkMode, 
  // LightMode,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  EventNote,
  Notes as NotesIcon,
  Analytics as AnalyticsIcon,
  MusicNote,
  Brightness4,
  Brightness7,
  ExitToApp
} from '@mui/icons-material';
import { Dashboard } from './components/Dashboard';
import { DailyPlanner } from './components/DailyPlanner';
import { Notes } from './components/Notes';
import { Analytics } from './components/Analytics';
import { FocusMusic } from './components/FocusMusic';
import { Login } from './components/Auth/Login';
import { SignUp } from './components/Auth/SignUp';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { logOut } from './services/auth';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Box>Loading...</Box>;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  return !user ? <>{children}</> : <Navigate to="/" />;
};

const AppContent: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const { user } = useAuth();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#3674B5' : '#7FB3E3',
            light: mode === 'light' ? '#5B8DC9' : '#B4D4F0',
            dark: mode === 'light' ? '#1B5A9C' : '#3674B5'
          },
          secondary: {
            main: mode === 'light' ? '#7FB3E3' : '#5B8DC9',
            light: mode === 'light' ? '#B4D4F0' : '#7FB3E3',
            dark: mode === 'light' ? '#4A92D6' : '#1B5A9C'
          },
          background: {
            default: mode === 'light' ? '#E8F3FC' : '#0A1929',
            paper: mode === 'light' ? '#FFFFFF' : '#132F4C'
          },
          text: {
            primary: mode === 'light' ? '#1B5A9C' : '#FFFFFF',
            secondary: mode === 'light' ? '#3674B5' : '#B4D4F0'
          },
          success: {
            main: mode === 'light' ? '#5B8DC9' : '#7FB3E3'
          },
          warning: {
            main: mode === 'light' ? '#7FB3E3' : '#5B8DC9'
          },
          error: {
            main: mode === 'light' ? '#B4D4F0' : '#3674B5'
          }
        },
        typography: {
          fontFamily: 'Roboto, sans-serif',
          h1: { fontWeight: 700 },
          h2: { fontWeight: 600 },
          h3: { fontWeight: 600 },
          h4: { fontWeight: 600 },
          h5: { fontWeight: 500 },
          h6: { fontWeight: 500 }
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: mode === 'light' 
                  ? '0px 2px 4px rgba(0,0,0,0.05)' 
                  : '0px 4px 8px rgba(0,0,0,0.4)',
                background: mode === 'light' 
                  ? '#FFFFFF'
                  : 'linear-gradient(145deg, #132F4C 0%, #0A1929 100%)'
              }
            }
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                background: mode === 'light' 
                  ? '#FFFFFF'
                  : 'linear-gradient(145deg, #132F4C 0%, #0A1929 100%)'
              }
            }
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 500,
                ...(mode === 'dark' && {
                  background: 'linear-gradient(145deg, #3674B5 0%, #1B5A9C 100%)',
                  '&:hover': {
                    background: 'linear-gradient(145deg, #5B8DC9 0%, #3674B5 100%)'
                  }
                })
              }
            }
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                background: mode === 'light' 
                  ? '#FFFFFF'
                  : 'linear-gradient(180deg, #132F4C 0%, #0A1929 100%)',
                borderRight: mode === 'light' 
                  ? '1px solid rgba(0,0,0,0.05)'
                  : '1px solid rgba(255,255,255,0.05)'
              }
            }
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                background: mode === 'light' 
                  ? '#FFFFFF'
                  : 'linear-gradient(90deg, #132F4C 0%, #0A1929 100%)',
                boxShadow: mode === 'light' 
                  ? '0px 2px 4px rgba(0,0,0,0.05)'
                  : '0px 2px 8px rgba(0,0,0,0.4)',
                color: mode === 'light' ? '#3674B5' : '#FFFFFF'
              }
            }
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                color: mode === 'light' ? '#3674B5' : '#FFFFFF',
                '&:hover': {
                  backgroundColor: mode === 'light' 
                    ? 'rgba(54, 116, 181, 0.08)'
                    : 'rgba(255, 255, 255, 0.08)'
                }
              }
            }
          }
        }
      }),
    [mode]
  );

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logOut();
      setLogoutDialogOpen(false);
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Daily Planner', icon: <EventNote />, path: '/planner' },
    { text: 'Notes', icon: <NotesIcon />, path: '/notes' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'Focus Music', icon: <MusicNote />, path: '/focus-music' }
  ];

  const drawer = user ? (
    <List>
      {menuItems.map((item) => (
        <ListItem 
          button 
          component={Link} 
          to={item.path} 
          key={item.text}
          onClick={() => isMobile && setDrawerOpen(false)}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  ) : null;

  const toggleColorMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {user && (
          <>
            <AppBar position="fixed">
              <Toolbar>
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={() => setDrawerOpen(true)}
                  sx={{ mr: 2, display: { sm: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    flexGrow: 1,
                    fontWeight: 'bold',
                    letterSpacing: 1,
                    color: 'inherit'
                  }}
                >
                  Kaarya
                </Typography>
                <IconButton 
                  onClick={toggleColorMode}
                  sx={{
                    color: 'inherit',
                    mr: 1
                  }}
                >
                  {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
                <Button 
                  onClick={handleLogoutClick}
                  startIcon={<ExitToApp />}
                  sx={{
                    color: 'inherit',
                    '&:hover': {
                      backgroundColor: mode === 'light' 
                        ? 'rgba(54, 116, 181, 0.08)'
                        : 'rgba(255, 255, 255, 0.08)'
                    }
                  }}
                >
                  Logout
                </Button>
              </Toolbar>
            </AppBar>

            <Drawer
              variant={isMobile ? 'temporary' : 'permanent'}
              open={isMobile ? drawerOpen : true}
              onClose={() => setDrawerOpen(false)}
              sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: 240,
                  boxSizing: 'border-box',
                },
              }}
            >
              {drawer}
            </Drawer>

            {/* Logout Confirmation Dialog */}
            <Dialog
              open={logoutDialogOpen}
              onClose={handleLogoutCancel}
            >
              <DialogTitle>
                Confirm Logout
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to logout from Kaarya?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleLogoutCancel} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleLogoutConfirm} color="error" variant="contained">
                  Logout
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: user ? 8 : 0,
            width: user ? { sm: `calc(100% - 240px)` } : '100%'
          }}
        >
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              } 
            />
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/planner" 
              element={
                <PrivateRoute>
                  <DailyPlanner />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/notes" 
              element={
                <PrivateRoute>
                  <Notes />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <PrivateRoute>
                  <Analytics />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/focus-music" 
              element={
                <PrivateRoute>
                  <FocusMusic />
                </PrivateRoute>
              } 
            />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}; 