import { useContext, useEffect, useState } from "react"
import { BoardContext, DataContext } from "../App"

export default function TaskDetails({ task, setModalContent, setSelectedTask, modalCloseClick }){

  const { data, setData } = useContext(DataContext);
  const { currentBoardId } = useContext(BoardContext);
  const [ isSelecting, setIsSelecting ] = useState(false);
  const [ isDropDownMenuOpen, setIsDropDownMenuOpen ] = useState(false);

  if (!task || undefined) return;


  function handleChange(subtask, index){
    const updatedTask = {
      ...task,
      subtasks: task.subtasks.map((x, i) => x === subtask ? { ...x, isCompleted: !x.isCompleted } : x)
    }
    setSelectedTask(updatedTask);
    const updatedData = {
      ...data,
      boards: data.boards.map(board =>
        board.id === currentBoardId
          ? {
              ...board,
              columns: board.columns.map(column =>
                column.name === task.status
                  ? {
                      ...column,
                      tasks: column.tasks.map(t =>
                        t === task
                          ? updatedTask : t
                      ),
                    }
                  : column
              ),
            }
          : board
      ),
    };
    setData(updatedData);
  }

  function handleClick(x){
    console.log(task.id, data.boards.find(b => b.id == currentBoardId).columns.find(c => c.name === task.status).tasks.find(t => t.id == task.id))
    const updatedTask = {
      ...task,
      status: x
    }
    const updatedData = {
      ...data,
      boards: data.boards.map(board =>
        board.id === currentBoardId
          ? {
              ...board,
              columns: board.columns.map(column =>
                column.name === x && task.status !== x
                  ? {
                      ...column,
                      tasks: [
                        ...column.tasks,
                        updatedTask
                      ]
                      ,
                    }
                  :
                    column.name === task.status
                    ? task.status == x
                      ? {
                        ...column,
                        tasks: column.tasks.map(t => t.id == task.id ? updatedTask : t),
                      }
                      : {
                        ...column,
                        tasks: column.tasks.filter(t => t.id !== task.id),
                      }
                  : column
              ),
            }
          : board
      ),
    };
    setSelectedTask(updatedTask);
    setData(updatedData);
    setIsSelecting(false)
  }

  function editTask(){
    setModalContent('edit');
    setIsDropDownMenuOpen(false);
  }

  function deleteTask(){
    setModalContent('delete');
    setIsDropDownMenuOpen(false);
  }

  function triggerMenu(){
    setIsSelecting(!isSelecting);
  }

  function toggleDropDownMenu(){
    setIsDropDownMenuOpen(!isDropDownMenuOpen);
  }

  return(
      <div className="task-details-container">
        <div className="task-details-container-top">
          <h2>{task.title}</h2>
          <div className={`drop-down-menu-container ${isDropDownMenuOpen && 'open-menu'}`}>
            <img onClick={toggleDropDownMenu} src="/images/detail-icon.svg" alt="Icon" />
            <div className="drop-down-menu">
              <p onClick={editTask}>Edit Task</p>
              <p onClick={deleteTask} className="delete">Delete Task</p>
            </div>
          </div>
        </div>
        <p className="description">{task.description === '' ? 'No description' : task.description}</p>
        <div className="task-details-subtasks-container">
          <h3>Subtasks ({task.subtasks.filter(x => x.isCompleted).length} of {task.subtasks.length})</h3>
          <div className="task-details-subtasks">
            {task.subtasks.length > 0 ? 
            task.subtasks.map((x, index) => (
              <div className="task-details-subtask" key={index}>
                <label htmlFor={`subtask-checkbox-${index}`}>
                  <input checked={x.isCompleted} type="checkbox" id={`subtask-checkbox-${index}`} onChange={() => handleChange(x, index)}/>
                  <span></span>
                  <p className={x.isCompleted ? 'completed' : null}>{x.title}</p>
                </label>
              </div>
            )) :
            <p className="no-subtask-txt">No subtasks</p>}
          </div>
          <div className={`task-detail-status ${isSelecting ? 'selecting' : ''}`}>
            <h3>Current Status</h3>
            <button onClick={triggerMenu} className={`task-detail-trigger ${isSelecting ? 'selecting' : ''}`}>{task.status} <img src="/images/arrow-down.svg" alt="Icon" /></button>
            <div className="task-detail-options">
              {data.boards.find(x => x.id == currentBoardId).columns.map(x => x.name).map((x, index) => (
                <p onClick={() => handleClick(x)} key={index}>{x}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
  )
}