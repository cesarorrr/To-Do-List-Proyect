// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from './redux/store';
// import { loadData } from './redux/ToDoListSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from './redux/store';
import { RootState } from './redux/store'; // Ajusta la ruta según tu estructura
import {
  fetchLists,
  toggleTaskFinished,
  deleteTask,
  addNewTask,
} from './redux/ToDoListSlice';
import Swal from 'sweetalert2';

export default function App() {
  // const count = useSelector((state: RootState=> state.counter.value);
  // const dispatch = useDispatch<AppDispatch>();
  // const [list, setList] = useState<List[]>([]);
  const dispatch = useAppDispatch();
  const list = useSelector((state: RootState) => state.toDoList.Lists);

  useEffect(() => {
    dispatch(fetchLists());
  }, []);

  const handleToggleTaskFinished = (listId: number, taskId: number) => {
    dispatch(toggleTaskFinished({ listId, taskId }));
  };
  const deleteTaskFunc = (listId: number, taskId: number) => {
    dispatch(deleteTask({ listId, taskId }));
  };
  const addTaskFunc = async (listId: number) => {
    const { value, isConfirmed } = await Swal.fire({
      title: 'Añadir Nueva Tarea',
      input: 'text',
      inputPlaceholder: 'Escribe la tarea aquí...',
      showCancelButton: true,
      confirmButtonText: 'Añadir',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Por favor, ingresa el texto de la tarea';
        }
      },
      preConfirm: (inputValue) => {
        return inputValue;
      },
    });

    if (isConfirmed && value) {
      // Aquí puedes llamar a tu acción para agregar la nueva tarea a la lista correspondiente
      dispatch(addNewTask({ listId, taskText: value }));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
        Lista de Tareas
      </h1>

      <ul className="space-y-6">
        {list.map((item) => (
          <li
            key={item.id}
            className={`p-4 rounded-lg shadow-lg ${
              item.tasks.length === 0
                ? 'bg-gray-300'
                : item.isFinished
                ? 'bg-lime-400'
                : 'bg-orange-200'
            } hover:shadow-xl transition duration-300 ease-in-out`}>
            <div className="flex justify-between items-center mb-4">
              <strong className="text-xl font-semibold text-gray-800">
                {item.title}
              </strong>
              <button
                onClick={() => addTaskFunc(item.id)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200">
                Añadir Tarea
              </button>
            </div>

            <ul className="ml-4 space-y-4">
              {item.tasks.map((task) => (
                <li
                  key={task.id}
                  className="p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition duration-200">
                  <div className="flex justify-between items-center">
                    <p
                      className={`cursor-pointer text-gray-800 ${
                        task.isFinished ? 'line-through text-gray-500' : ''
                      }`}
                      onClick={() =>
                        handleToggleTaskFinished(item.id, task.id)
                      }>
                      {task.text}
                    </p>

                    <button
                      onClick={() => deleteTaskFunc(item.id, task.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200">
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
