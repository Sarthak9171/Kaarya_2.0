import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
  CardActionArea,
  Paper,
  Avatar
} from '@mui/material';
import {
  Assignment as TaskIcon,
  Notes as NotesIcon,
  Analytics as AnalyticsIcon,
  MusicNote,
  TrendingUp,
  CheckCircle,
  Timer,
  WbSunny,
  Star
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const currentHour = new Date().getHours();
  
  const getGreeting = () => {
    if (currentHour >= 0 && currentHour < 4) {
      return "It's Late Night! Time to Rest";
    }
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 17) return 'Good Afternoon';
    if (currentHour < 22) return 'Good Evening';
    return "It's Getting Late! Time to Wind Down";
  };

  const getGreetingMessage = () => {
    if (currentHour >= 0 && currentHour < 4) {
      return "Don't forget to get enough sleep for a productive tomorrow!";
    }
    if (currentHour < 12) {
      return "Let's start the day with energy and focus!";
    }
    if (currentHour < 17) {
      return "Keep up the great work today!";
    }
    if (currentHour < 22) {
      return "Time to review your day's achievements!";
    }
    return "Consider wrapping up your tasks for the day.";
  };

  const features = [
    {
      title: 'Daily Planner',
      description: 'Plan your day with tasks and reminders',
      icon: <TaskIcon fontSize="large" />,
      path: '/planner',
      color: 'primary.main'
    },
    {
      title: 'Notes',
      description: 'Keep track of your ideas and thoughts',
      icon: <NotesIcon fontSize="large" />,
      path: '/notes',
      color: 'secondary.main'
    },
    {
      title: 'Analytics',
      description: 'View your productivity insights',
      icon: <AnalyticsIcon fontSize="large" />,
      path: '/analytics',
      color: 'success.main'
    },
    {
      title: 'Focus Music',
      description: 'Stay focused with ambient sounds',
      icon: <MusicNote fontSize="large" />,
      path: '/focus-music',
      color: 'warning.main'
    }
  ];

  const quickStats = [
    {
      title: 'Productivity Score',
      value: '85%',
      icon: <TrendingUp />,
      color: 'primary.main'
    },
    {
      title: 'Tasks Completed',
      value: '12',
      icon: <CheckCircle />,
      color: 'success.main'
    },
    {
      title: 'Focus Time',
      value: '4h 30m',
      icon: <Timer />,
      color: 'warning.main'
    }
  ];

  return (
    <Box>
      {/* Website Title */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h1" 
          sx={{ 
            fontWeight: 800,
            fontSize: { xs: '3rem', md: '4rem' },
            background: 'linear-gradient(45deg, #3674B5 30%, #7FB3E3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.05em',
            mb: 1
          }}
        >
          Kaarya
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary',
            fontWeight: 500,
            letterSpacing: '0.02em'
          }}
        >
          Your Personal Productivity Suite
        </Typography>
      </Box>

      {/* Welcome Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3,
          background: 'linear-gradient(120deg, #3674B5 0%, #7FB3E3 100%)',
          color: 'white'
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
          <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <WbSunny sx={{ fontSize: 40 }} />
          </Box>
          <Box>
            <Typography variant="h4" gutterBottom>
              {getGreeting()}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {getGreetingMessage()}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickStats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ 
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ 
                    bgcolor: `${stat.color}15`,
                    color: stat.color,
                    width: 56,
                    height: 56
                  }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Feature Cards */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Quick Access
      </Typography>
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => `0 8px 24px ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)'}`
                }
              }}
            >
              <CardActionArea 
                onClick={() => navigate(feature.path)}
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent>
                  <Stack spacing={3}>
                    <Avatar sx={{ 
                      bgcolor: `${feature.color}15`,
                      color: feature.color,
                      width: 56,
                      height: 56
                    }}>
                      {feature.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/planner')}
          sx={{ 
            mr: 2,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          Start Planning
        </Button>
        <Button 
          variant="outlined" 
          size="large"
          onClick={() => navigate('/focus-music')}
          sx={{ 
            px: 4,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          Focus Mode
        </Button>
      </Box>
    </Box>
  );
}; 