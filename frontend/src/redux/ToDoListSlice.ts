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
          id: lastTaskId !== 0 ? lastTaskId + 1 : 100,
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
    deleteList: (state, action: PayloadAction<{ listId: number }>) => {
      const { listId } = action.payload;

      state.Lists = state.Lists.filter((list) => list.id !== listId);
    },
    createList: (state, action: PayloadAction<{ listTitle: string }>) => {
      const { listTitle } = action.payload;
      // Obtén el ID de la última lista en el estado (si existe)
      const lastListId =
        state.Lists.length > 0 ? Math.max(...state.Lists.map((l) => l.id)) : 0;

      // Crea la nueva lista con el ID siguiente al más alto encontrado
      const newList = {
        id: lastListId !== 0 ? lastListId + 1 : 1,
        title: listTitle,
        tasks: [],
        isFinished: false,
        createdAt: new Date().toISOString(),
      };

      // Añade la nueva lista al estado
      state.Lists.push(newList);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLists.fulfilled, (state, action) => {
      state.Lists = action.payload;
    });
  },
});

export const fetchLists = createAsyncThunk('toDoList/fetchLists', async () => {
  const response = await fetch('http://localhost:3001/api/data');

  if (!response.ok) {
    throw new Error('Error al obtener los datos');
  }

  const data = await response.json();

  return data;
});

export const saveLists = createAsyncThunk(
  'toDoList/saveLists',
  async (newData: List[]) => {
    const response = await fetch('http://localhost:3001/api/data', {
      method: 'POST', // Usamos POST para guardar datos
      headers: {
        'Content-Type': 'application/json', // Indicamos que estamos enviando datos JSON
      },
      body: JSON.stringify(newData), // Los datos que queremos guardar
    });

    if (!response.ok) {
      throw new Error('Error al guardar los datos');
    }

    const data = await response.json();
    return data;
  }
);
export const {
  toggleTaskFinished,
  deleteTask,
  addNewTask,
  deleteList,
  createList,
} = ToDoListSlice.actions;
export default ToDoListSlice.reducer;
