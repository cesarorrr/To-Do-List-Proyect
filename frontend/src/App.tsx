import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from './redux/store';
import { RootState } from './redux/store'; // Ajusta la ruta según tu estructura
import {
  fetchLists,
  deleteList,
  createList,
  saveLists,
} from './redux/ToDoListSlice';
import Swal from 'sweetalert2';
import List from './components/list';

export default function App() {
  const dispatch = useAppDispatch();
  const list = useSelector((state: RootState) => state.toDoList.Lists);
  const [modalOpen, setModalOpen] = useState(false);
  const [listId, setlistId] = useState(-1);

  useEffect(() => {
    dispatch(fetchLists());
  }, []);

  const deleteListFunc = async (listId: number, listTitle: string) => {
    const { value, isConfirmed } = await Swal.fire({
      title: 'Eliminar lista ' + listTitle,
      input: 'text',
      text:
        'Estas seguro de que desea eliminar ' +
        listTitle +
        '. Para eliminar la lista introduzca: Eliminar ' +
        listTitle,
      showCancelButton: true,
      confirmButtonText: 'Añadir',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (value !== 'Eliminar ' + listTitle) {
          return 'El valor introducido no es el pedido';
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
        dispatch(deleteList({ listId }));
      } catch (error) {
        console.error('Error al eliminar la lista', error);
      }
    }
  };
  const createListFunc = async () => {
    const { value, isConfirmed } = await Swal.fire({
      title: 'Crear nueva lista',
      input: 'text',
      text: 'Introduce el nombre de la lista',
      inputPlaceholder: 'Nombre de la lista',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (value === '') {
          return 'La tabla tiene que tener un titulo';
        }
      },
    });

    if (isConfirmed && value) {
      try {
        // Aquí puedes llamar a tu acción para agregar la nueva tarea a la lista correspondiente
        dispatch(createList({ listTitle: value }));
      } catch (error) {
        console.error('Error al crear la lista:', error);
      }
    }
  };
  const saveDataFunc = async () => {
    try {
      // Aquí puedes llamar a tu acción para agregar la nueva tarea a la lista correspondiente
      dispatch(saveLists(list));
    } catch (error) {
      console.error('Error al guardar la lista:', error);
    }
  };

  return (
    <>
      <div className="p-6">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Lista de Tareas
        </h1>
        <button
          onClick={() => createListFunc()}
          className="px-4 py-2 bg-orange-300 text-white rounded-lg hover:bg-orange-500 transition duration-200">
          Añadir Lista
        </button>
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
              } hover:shadow-xl transition duration-300 ease-in-out`}
              onClick={() => {
                setlistId(item.id);
                setModalOpen(true);
              }}>
              <div className="flex justify-between items-center mb-4">
                <strong className="text-xl font-semibold text-gray-800">
                  {item.title}
                </strong>
                <button
                  onClick={() => deleteListFunc(item.id, item.title)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-200">
                  Eliminar Lista
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <List
        isOpen={modalOpen}
        onClose={() => {
          saveDataFunc(), setModalOpen(false);
        }}
        listId={listId}></List>
    </>
  );
}
