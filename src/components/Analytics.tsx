import React, { useMemo } from 'react';
import {
  Paper,
  Grid,
  Typography,
  Box,
  Card,
  CardContent
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Task {
  id: string;
  title: string;
  completed: boolean;
  timestamp: number;
  category: string;
  completedAt?: number;
}

export const Analytics: React.FC = () => {
  const tasks = useMemo(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) as Task[] : [];
  }, []);

  // Get last 7 days data
  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const lastWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    const completedByDay = lastWeek.map(date => {
      return tasks.filter(task => {
        if (!task.completedAt) return false;
        const taskDate = new Date(task.completedAt);
        return taskDate.toDateString() === date.toDateString();
      }).length;
    });

    return {
      labels: lastWeek.map(date => days[date.getDay()]),
      datasets: [{
        label: 'Tasks Completed',
        data: completedByDay,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
      }]
    };
  }, [tasks]);

  // Calculate today's time distribution
  const todayData = useMemo(() => {
    const today = new Date().toDateString();
    const todayTasks = tasks.filter(task => {
      const taskDate = new Date(task.timestamp).toDateString();
      return taskDate === today;
    });

    const total = todayTasks.length;
    const completed = todayTasks.filter(t => t.completed).length;
    const inProgress = total - completed;

    return {
      labels: ['Completed', 'In Progress', 'Not Started'],
      datasets: [{
        data: [completed, inProgress, Math.max(0, 5 - total)], // Assuming 5 tasks is a good daily target
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(255, 99, 132, 0.8)'
        ]
      }]
    };
  }, [tasks]);

  // Calculate productivity by hour
  const hourlyData = useMemo(() => {
    const today = new Date().toDateString();
    const completedTasks = tasks.filter(task => {
      if (!task.completedAt) return false;
      const taskDate = new Date(task.completedAt).toDateString();
      return taskDate === today;
    });

    const hourCounts = Array(9).fill(0); // 9AM to 5PM
    completedTasks.forEach(task => {
      const hour = new Date(task.completedAt!).getHours();
      if (hour >= 9 && hour <= 17) { // 9AM to 5PM
        hourCounts[hour - 9]++;
      }
    });

    return {
      labels: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'],
      datasets: [{
        label: 'Tasks Completed',
        data: hourCounts,
        backgroundColor: 'rgba(153, 102, 255, 0.5)'
      }]
    };
  }, [tasks]);

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
          Analytics - Track Your Progress
        </Typography>
      </Box>

      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography variant="h5" gutterBottom>
          Productivity Analytics
        </Typography>

        <Grid container spacing={3}>
          {/* Weekly Task Completion */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Weekly Task Completion
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Line
                    data={weeklyData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Today's Distribution */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Today's Task Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Pie
                    data={todayData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom' as const
                        }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Productivity by Hour */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Productivity by Hour
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={hourlyData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'top' as const
                        }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}; 