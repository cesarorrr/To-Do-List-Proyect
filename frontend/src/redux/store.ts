import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import toDoListReducer from './ToDoListSlice';

// Configuración del store de Redux
export const store = configureStore({
  reducer: {
    toDoList: toDoListReducer, // Reducer de tus listas de tareas
  },
});

// Tipos para TypeScript
export type RootState = ReturnType<typeof store.getState>; // Tipo del estado global
export type AppDispatch = typeof store.dispatch; // Tipo del dispatch de Redux

// Hook tipado para el dispatch
export const useAppDispatch: () => AppDispatch = useDispatch;

// Hook tipado para el selector (para acceder al estado global)
export const useAppSelector = useSelector;
