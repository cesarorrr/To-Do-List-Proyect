import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from './redux/store';
import { RootState } from './redux/store'; // Ajusta la ruta según tu estructura
import { fetchLists, createList, saveLists } from './redux/ToDoListSlice';
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
      <div className="flex flex-col items-center justify-start p-6 bg-gradient-to-b from-blue-200 via-green-200 to-teal-200 h-screen">
        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-4">
          Lista de Tareas
        </h1>
        <button
          onClick={() => createListFunc()}
          className="px-6 py-3 bg-orange-300 text-white rounded-lg hover:bg-orange-500 transition duration-200 mb-6">
          Añadir Lista
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-7xl">
          {list.map((item) => (
            <li
              key={item.id}
              className={`p-6 rounded-lg shadow-lg flex items-center justify-center h-40 ${
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
              <div className="text-center">
                <strong className="text-xl font-semibold text-gray-800">
                  {item.title}
                </strong>
              </div>
            </li>
          ))}
        </div>
      </div>

      <List
        isOpen={modalOpen}
        onClose={() => {
          saveDataFunc();
          setModalOpen(false);
        }}
        listId={listId}
      />
    </>
  );
}
