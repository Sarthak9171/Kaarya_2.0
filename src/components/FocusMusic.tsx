import React, { useState, useRef, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  Alert,
  // CircularProgress
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Timer as TimerIcon,
} from '@mui/icons-material';

interface Track {
  id: string;
  title: string;
  category: string;
  url: string;
}

const tracks: Track[] = [
  {
    id: '1',
    title: 'Relaxing Lo-fi',
    category: 'Lo-fi',
    url: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&controls=0&showinfo=0&autohide=1'
  },
  {
    id: '2',
    title: 'Rain Sounds',
    category: 'Nature',
    url: 'https://www.youtube.com/embed/mPZkdNFkNps?autoplay=1&controls=0&showinfo=0&autohide=1'
  },
  {
    id: '3',
    title: 'White Noise',
    category: 'Ambient',
    url: 'https://www.youtube.com/embed/nMfPqeZjc2c?autoplay=1&controls=0&showinfo=0&autohide=1'
  },
  {
    id: '4',
    title: 'Ocean Waves',
    category: 'Nature',
    url: 'https://www.youtube.com/embed/bn9F19Hi1Lk?autoplay=1&controls=0&showinfo=0&autohide=1'
  },
  {
    id: '5',
    title: 'Forest Birds',
    category: 'Nature',
    url: 'https://www.youtube.com/embed/2G8LAiHSCAs?autoplay=1&controls=0&showinfo=0&autohide=1'
  }
];

export const FocusMusic: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timeRemaining !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 0) {
            clearInterval(interval);
            setIsPlaying(false);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timeRemaining]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (iframeRef.current) {
      iframeRef.current.src = isPlaying 
        ? '' 
        : currentTrack.url;
    }
  };

  const handleTrackChange = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(false);
    setError(null);
    if (iframeRef.current) {
      iframeRef.current.src = '';
    }
  };

  const handleTimerChange = (duration: number) => {
    setTimer(duration);
    setTimeRemaining(duration * 60);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box>
      {/* Website Title */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 800,
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
          Focus Music - Stay in the Zone
        </Typography>
      </Box>

      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography variant="h5" gutterBottom>
          Focus Music
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <iframe
                    ref={iframeRef}
                    width="0"
                    height="0"
                    src=""
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ display: 'none' }}
                  />
                  
                  <Typography variant="h6">
                    Now Playing: {currentTrack.title}
                  </Typography>

                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <IconButton 
                      size="large" 
                      onClick={handlePlayPause}
                      color="primary"
                    >
                      {isPlaying ? (
                        <Pause />
                      ) : (
                        <PlayArrow />
                      )}
                    </IconButton>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Timer</InputLabel>
                        <Select
                          value={timer || ''}
                          label="Timer"
                          onChange={(e) => handleTimerChange(Number(e.target.value))}
                        >
                          <MenuItem value="">None</MenuItem>
                          <MenuItem value={15}>15 minutes</MenuItem>
                          <MenuItem value={30}>30 minutes</MenuItem>
                          <MenuItem value={45}>45 minutes</MenuItem>
                          <MenuItem value={60}>60 minutes</MenuItem>
                        </Select>
                      </FormControl>

                      {timeRemaining !== null && (
                        <Chip
                          icon={<TimerIcon />}
                          label={formatTime(timeRemaining)}
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Available Tracks
            </Typography>
            <Grid container spacing={2}>
              {tracks.map((track) => (
                <Grid item xs={12} sm={6} md={4} key={track.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      bgcolor: currentTrack.id === track.id ? 'action.selected' : 'background.paper',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => handleTrackChange(track)}
                  >
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="h6">
                          {track.title}
                        </Typography>
                        <Chip 
                          label={track.category} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}; 