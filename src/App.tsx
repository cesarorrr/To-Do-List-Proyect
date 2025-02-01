import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './redux/store';
import { increment, decrement, incrementByAmount } from './redux/counterSlice';
import { useState } from 'react';

export default function App() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Aprender React', status: 'todo' },
    { id: 2, text: 'Configurar Redux', status: 'in-progress' },
    { id: 3, text: 'Crear interfaz con Tailwind', status: 'done' },
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim() === '') return;
    setTasks([...tasks, { id: Date.now(), text: newTask, status: 'todo' }]);
    setNewTask('');
  };

  const moveTask = (id, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const columns = [
    { id: 'todo', title: 'Por Hacer', color: 'bg-gray-200' },
    { id: 'in-progress', title: 'En Progreso', color: 'bg-blue-200' },
    { id: 'done', title: 'Completado', color: 'bg-green-200' },
  ];

  return (
    <div className="min-h-screen bg-white-200 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Tablero de Notas 📝</h1>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8 rounded">
        <div className="flex space-x-2 mb-6">
          <input
            type="text"
            className="border p-2 rounded w-64"
            placeholder="Nueva tarea..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
            Agregar
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 w-full max-w-5xl">
          {columns.map((column) => (
            <div
              key={column.id}
              className="w-full p-4 rounded-lg shadow-lg"
              style={{ backgroundColor: column.color }}>
              <h2 className="text-xl font-semibold text-center mb-4">
                {column.title}
              </h2>
              <div className="space-y-2">
                {tasks
                  .filter((task) => task.status === column.id)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-white p-3 rounded shadow flex justify-between items-center">
                      <span>{task.text}</span>
                      <div className="flex space-x-2">
                        {column.id !== 'done' && (
                          <button
                            className="text-blue-500"
                            onClick={() => moveTask(task.id, 'in-progress')}>
                            ▶
                          </button>
                        )}
                        {column.id !== 'done' && (
                          <button
                            className="text-green-500"
                            onClick={() => moveTask(task.id, 'done')}>
                            ✅
                          </button>
                        )}
                        <button
                          className="text-red-500"
                          onClick={() => deleteTask(task.id)}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
