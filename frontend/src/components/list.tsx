import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux/store';
import {
  addNewTask,
  deleteTask,
  toggleTaskFinished,
} from '../redux/ToDoListSlice';
import Swal from 'sweetalert2';

interface ListProps {
  isOpen: boolean;
  onClose: () => void;
  listId: number;
}

export default function List({ isOpen, onClose, listId }: ListProps) {
  const dispatch = useAppDispatch();
  const item = useSelector((state: RootState) =>
    state.toDoList.Lists.find((item) => item.id === listId)
  );

  if (!isOpen || !item) return null;
  const handleToggleTaskFinished = async (listId: number, taskId: number) => {
    try {
      // Aquí puedes llamar a tu acción para agregar la nueva tarea a la lista correspondiente
      dispatch(toggleTaskFinished({ listId, taskId }));
    } catch (error) {
      console.error('Error al cambiar el estado de la tarea:', error);
    }
  };
  const deleteTaskFunc = async (listId: number, taskId: number) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Estas seguro de que desea eliminar la tarea',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (isConfirmed) {
      // Aquí puedes llamar a tu acción para agregar la nueva tarea a la lista correspondiente
      try {
        // Aquí puedes llamar a tu acción para agregar la nueva tarea a la lista correspondiente
        dispatch(deleteTask({ listId: listId, taskId: taskId }));
      } catch (error) {
        console.error('Error al eliminar la tarea:', error);
      }
    }
  };
  const addTaskFunc = async (listId: number, listTitle: string) => {
    const { value, isConfirmed } = await Swal.fire({
      title: 'Añadir Nueva Tarea A ' + listTitle,
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
      try {
        // Aquí puedes llamar a tu acción para agregar la nueva tarea a la lista correspondiente
        dispatch(addNewTask({ listId, taskText: value }));
      } catch (error) {
        console.error('Error al añadir la tarea:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl">
          ✖
        </button>
        <div
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
            <div className="flex space-x-4">
              <button
                onClick={() => addTaskFunc(item.id, item.title)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200">
                Añadir Tarea
              </button>
            </div>
          </div>

          <ul className="ml-4 space-y-4">
            {item.tasks.map((task) => (
              <li
                key={task.id}
                className="p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition duration-200">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => handleToggleTaskFinished(item.id, task.id)} // Se activa al hacer clic en el div
                >
                  <p
                    className={`text-gray-800 ${
                      task.isFinished ? 'line-through text-gray-500' : ''
                    }`}>
                    {task.text}
                  </p>

                  <button
                    onClick={(event) => {
                      event.stopPropagation(); // Evita que el evento llegue al div
                      deleteTaskFunc(item.id, task.id);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200">
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
