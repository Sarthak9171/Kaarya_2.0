import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

// Types
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  timestamp: number;
  category: string;
  completedAt?: number;
  userId: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
  userId: string;
}

// Tasks Operations
export const addTask = async (task: Omit<Task, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), task);
    return { ...task, id: docRef.id };
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, updates);
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const getUserTasks = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[];
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
};

export const subscribeToTasks = (userId: string, callback: (tasks: Task[]) => void) => {
  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const tasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[];
    callback(tasks);
  });
};

// Notes Operations
export const addNote = async (note: Omit<Note, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'notes'), note);
    return { ...note, id: docRef.id };
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
};

export const updateNote = async (noteId: string, updates: Partial<Note>) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, updates);
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

export const deleteNote = async (noteId: string) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

export const getUserNotes = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', userId),
      orderBy('lastModified', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Note[];
  } catch (error) {
    console.error('Error getting notes:', error);
    throw error;
  }
};

export const subscribeToNotes = (userId: string, callback: (notes: Note[]) => void) => {
  const q = query(
    collection(db, 'notes'),
    where('userId', '==', userId),
    orderBy('lastModified', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const notes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Note[];
    callback(notes);
  });
}; 