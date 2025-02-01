import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { List } from '../models/list';

interface ToDoList {
  Lists: List[];
}

const initialState: ToDoList = {
  Lists: [],
};

const ToDoListSlice = createSlice({
  name: 'toDoList',
  initialState,
  reducers: {
    toggleTaskFinished: (
      state,
      action: PayloadAction<{ listId: number; taskId: number }>
    ) => {
      const { listId, taskId } = action.payload;

      // Encuentra la lista correspondiente
      const list = state.Lists.find((list) => list.id === listId);
      if (list) {
        // Encuentra la tarea correspondiente
        const task = list.tasks.find((task) => task.id === taskId);
        if (task) {
          // Cambia el valor de isFinished
          task.isFinished = !task.isFinished;
        }
        // Verifica si todas las tareas en la lista están marcadas como terminadas
        const allTasksFinished = list.tasks.every((task) => task.isFinished);

        // Si todas las tareas están terminadas, marca la lista como terminada
        list.isFinished = allTasksFinished;
      }
    },
    deleteTask: (
      state,
      action: PayloadAction<{ listId: number; taskId: number }>
    ) => {
      const { listId, taskId } = action.payload;

      // Encuentra la lista correspondiente
      const list = state.Lists.find((list) => list.id === listId);
      if (list) {
        // Encuentra la tarea correspondiente
        const task = list.tasks.find((task) => task.id === taskId);
        if (task) {
          list.tasks = list.tasks.filter((task) => task.id !== taskId);

          // Verifica si todas las tareas en la lista están marcadas como terminadas
          const allTasksFinished = list.tasks.every((task) => task.isFinished);

          // Si todas las tareas están terminadas, marca la lista como terminada
          list.isFinished = allTasksFinished;
        }
      }
    },
    addNewTask: (
      state,
      action: PayloadAction<{ listId: number; taskText: string }>
    ) => {
      const { listId, taskText } = action.payload;

      // Encuentra la lista correspondiente
      const list = state.Lists.find((list) => list.id === listId);
      if (list) {
        // Obtén el ID de la última tarea en la lista (si existe)
        const lastTaskId =
          list.tasks.length > 0 ? Math.max(...list.tasks.map((t) => t.id)) : 0;

        // Asigna el nuevo ID a la tarea sumando 1 al ID más alto
        const newTask = {
          id: lastTaskId + 1, // ID de la nueva tarea es el último ID + 1
          text: taskText,
          isFinished: false,
        };

        // Añade la nueva tarea a la lista
        list.tasks.push(newTask);

        // Verifica si todas las tareas en la lista están terminadas
        const allTasksFinished = list.tasks.every((task) => task.isFinished);

        // Si todas las tareas están terminadas, marca la lista como terminada
        list.isFinished = allTasksFinished;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLists.fulfilled, (state, action) => {
      state.Lists = action.payload;
    });
  },
});

// Crear un thunk para cargar los datos de manera asíncrona
export const fetchLists = createAsyncThunk('toDoList/fetchLists', async () => {
  const response = await fetch('/data/data.json');
  const data = await response.json();
  return data;
});
export const { toggleTaskFinished, deleteTask, addNewTask } =
  ToDoListSlice.actions;
export default ToDoListSlice.reducer;
