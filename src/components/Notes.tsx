import React, { useState, useCallback } from 'react';
import { 
  Paper, 
  Box, 
  Typography,
  IconButton,
  Tooltip,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
}

export const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const saveNotes = useCallback((updatedNotes: Note[]) => {
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  }, []);

  const addNote = () => {
    if (!title.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      lastModified: new Date()
    };

    saveNotes([...notes, newNote]);
    setTitle('');
    setContent('');
    setCurrentNote(null);
  };

  const updateNote = () => {
    if (!currentNote || !title.trim()) return;

    const updatedNotes = notes.map(note => 
      note.id === currentNote.id 
        ? {
            ...note,
            title: title.trim(),
            content: content.trim(),
            lastModified: new Date()
          }
        : note
    );

    saveNotes(updatedNotes);
    setTitle('');
    setContent('');
    setCurrentNote(null);
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(note => note.id !== id));
    if (currentNote?.id === id) {
      setTitle('');
      setContent('');
      setCurrentNote(null);
    }
  };

  const editNote = (note: Note) => {
    setCurrentNote(note);
    setTitle(note.title);
    setContent(note.content);
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
          Notes - Capture Your Thoughts
        </Typography>
      </Box>

      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography variant="h5" gutterBottom>
          Quick Notes
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <TextField
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            placeholder="Note Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            multiline
            rows={4}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={currentNote ? updateNote : addNote}
              disabled={!title.trim()}
            >
              {currentNote ? 'Update Note' : 'Add Note'}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List>
          {notes.map((note) => (
            <ListItem 
              key={note.id}
              sx={{
                borderLeft: 4,
                borderColor: 'primary.main',
                mb: 1,
                bgcolor: 'background.paper',
              }}
            >
              <ListItemText 
                primary={note.title}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ 
                        display: 'block',
                        mb: 1,
                        maxHeight: '3em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {note.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Last modified: {new Date(note.lastModified).toLocaleString()}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton 
                  edge="end" 
                  onClick={() => editNote(note)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  edge="end" 
                  onClick={() => deleteNote(note.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}; 