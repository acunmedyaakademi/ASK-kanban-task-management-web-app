import { useContext, useState } from "react"
import { BoardContext, DataContext, IsOpenContext, ModalContext, ThemeContext } from "../App"
import TaskDetails from "./TaskDetails";
import EditTask from "./EditTask";
import DeleteModal from "./DeleteModal";
import AddBoard from "./AddBoard";
import AddNewTask from "./AddNewTask";
import AddNewColumn from "./AddNewColumn";
import EditBoard from "./EditBoard";

export default function Container(){

  const { data, setData } = useContext(DataContext);
  const { currentBoardId, setCurrentBoardId } = useContext(BoardContext);
  const { modalContent, setModalContent, isModalOpen, setIsModalOpen } = useContext(ModalContext);
  const { isOpen, setIsOpen } = useContext(IsOpenContext);

  const [ selectedTask, setSelectedTask ] = useState(null);

  if (!data || data.length === 0) return <p>Loading data...</p>;


  function handleClick(task){
    setSelectedTask(task);
    setIsModalOpen(true);
    setModalContent('detail');
  }

  function addNewColumn(){
    setModalContent('addColumn');
    setIsModalOpen(true);
  }

  function modalCloseClick(e){
    if(e.target.classList.contains('modal')){
      setIsModalOpen(false);
      setSelectedTask(null);
    }
  }

  return(
  <div className={`container ${isOpen ? 'shift-right' : ''}`}>
      {data?.boards.find(x => x.id == currentBoardId).columns.length === 0 ? 
        <div className="empty-columns-screen">
          <p>This board is empty. Create a new column to get started.</p>
          <button onClick={addNewColumn}>+ Add New Column</button>
        </div> : 
        <div className="task-columns-container">
          {data?.boards.find(x => x.id == currentBoardId).columns?.map(x => (
            <div className="task-column" key={x.id}>
              <h2><span></span> {x.name.toUpperCase()}({x.tasks.length})</h2>
              <div className="task-column-container">
                {x.tasks.length > 0 ? x.tasks.map(x => (
                  <div className="task-column-item" key={x.id} onClick={() => handleClick(x)}>
                    <h3>{x.title}</h3>
                    <p>{x.subtasks.filter(x => x.isCompleted).length} of {x.subtasks.length} subtasks</p>
                  </div>
                )) : <div className="empty-task-column"></div> }
              </div>
            </div>
          ))}
          <div onClick={addNewColumn} className="new-column">
            <p>+ New Column</p>
          </div>
        </div>
      }
      {isModalOpen && (
        <div onClick={modalCloseClick} className="modal">
          {modalContent === 'detail' ? <TaskDetails task={selectedTask} setSelectedTask={setSelectedTask} setModalContent={setModalContent} /> :
           modalContent === 'edit' ? <EditTask task={selectedTask} setSelectedTask={setSelectedTask} setIsModalOpen={setIsModalOpen} /> : 
           modalContent === 'delete' ? <DeleteModal task={selectedTask} setSelectedTask={setSelectedTask} setIsModalOpen={setIsModalOpen} /> :
           modalContent === 'add' ? <AddNewTask setIsModalOpen={setIsModalOpen} /> :
           modalContent === 'addBoard' ? <AddBoard /> :
           modalContent === 'editBoard' ? <EditBoard /> :
           modalContent === 'addColumn' ? <AddNewColumn /> :
           ''}
        </div>
      )}
    </div>
  )
}