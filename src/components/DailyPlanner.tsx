import React, { useState, useEffect } from 'react';
import {
  // Paper,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  // Divider
} from '@mui/material';
import {
  Delete as DeleteIcon,
  // Timer as TimerIcon,
  Assignment as TaskIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingIcon,
  // Dashboard as DashboardIcon
} from '@mui/icons-material';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  timestamp: number;
  category: string;
  completedAt?: number;
}

export const DailyPlanner: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('work');

  const categories = ['work', 'personal', 'study', 'health'];

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        completed: false,
        timestamp: Date.now(),
        category: selectedCategory,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? Date.now() : undefined
        };
      }
      return task;
    }));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const byCategory = categories.map(category => ({
      category,
      count: tasks.filter(t => t.category === category).length
    }));
    return { total, completed, pending, byCategory };
  };

  const stats = getTaskStats();

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
          Daily Planner - Organize Your Day
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Stats Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <TaskIcon fontSize="large" />
                    <Box>
                      <Typography variant="h4">{stats.total}</Typography>
                      <Typography>Total Tasks</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <CheckCircleIcon fontSize="large" />
                    <Box>
                      <Typography variant="h4">{stats.completed}</Typography>
                      <Typography>Completed</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <PendingIcon fontSize="large" />
                    <Box>
                      <Typography variant="h4">{stats.pending}</Typography>
                      <Typography>Pending</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Add Task Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add New Task
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label="Task description"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button variant="contained" onClick={addTask}>
                  Add Task
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Tasks List */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Tasks
              </Typography>
              <List>
                {tasks.map((task) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      bgcolor: 'background.paper',
                      mb: 1,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <Checkbox
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      color="primary"
                    />
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip 
                            label={task.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(task.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Stack>
                      }
                      sx={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                      }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        onClick={() => deleteTask(task.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                {tasks.length === 0 && (
                  <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                    No tasks added yet. Start by adding a new task above!
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Stats */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tasks by Category
              </Typography>
              <Grid container spacing={2}>
                {stats.byCategory.map(({ category, count }) => (
                  <Grid item xs={6} sm={3} key={category}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h4" color="primary">
                          {count}
                        </Typography>
                        <Typography color="text.secondary">
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 