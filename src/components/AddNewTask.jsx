import { useContext, useState } from "react";
import { BoardContext, DataContext } from "../App";

export default function AddNewTask({ setIsModalOpen }) {
  const { data, setData } = useContext(DataContext);
  const { currentBoardId } = useContext(BoardContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([""]);
  const [ isSelecting, setIsSelecting ] = useState(false);
  const [ taskStatus, setTaskStatus ] = useState(data.boards.find(x => x.id == currentBoardId).columns[0].name);
  const [ errorTitle, setErrorTitle ] = useState(false);
  const [ errorIndexes, setErrorIndexes ] = useState([]);


  function handleAddSubtask() {
    setSubtasks([...subtasks, ""]);
  }

  function handleChangeSubtask(index, value) {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = value;
    setSubtasks(newSubtasks);
  }

  function handleRemoveSubtask(index) {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()){
      setErrorTitle(true);
      return;
    }

    const columnInputs = e.target.subtask && Array.from(e.target.subtask);
    const isAnyColumnEmpty = columnInputs && columnInputs.some(input => !input.value.trim());

    setErrorIndexes(e.target.subtask && columnInputs.length > 0 ? columnInputs.reduce((acc, input, index) => !input.value.trim() ? [...acc, index] : acc, []) : e.target.subtask && e.target.subtask.value.trim() ? [] : [0]);

    if (e.target.subtask && columnInputs.length > 0 ? isAnyColumnEmpty : e.target.subtask && !e.target.subtask.value.trim()) return;

    const newTask = {
      id: Date.now(),
      title,
      description,
      status: taskStatus,
      subtasks: subtasks.map((sub) => ({ title: sub, isCompleted: false })),
    };

    const updatedData = {
      ...data,
      boards: data.boards.map((board) =>
        board.id === currentBoardId
          ? {
              ...board,
              columns: board.columns.map((col) =>
                col.name === newTask.status ? { ...col, tasks: [...col.tasks, newTask] } : col
              ),
            }
          : board
      ),
    }

    setData(updatedData);
    setTitle("");
    setDescription("");
    setSubtasks([""]);
    setIsModalOpen(false);
  }

  function handleClick(status){
    setTaskStatus(status);
    setIsSelecting(false)
  }

  function triggerMenu(){
    setIsSelecting(!isSelecting);
  }

  return (
    <div className="addNewTask-container">
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className={`title-input-container ${errorTitle ? 'error' : ''}`}>
          <h3>Title</h3>
          <input
            type="text"
            placeholder="e.g. Take coffee break"
            value={title}
            onChange={(e) => {setTitle(e.target.value); setErrorTitle(false)}}
            className="addNewTask-title-input"
          />
          <p className="error-text">Required</p>
        </div>
        <div className="addNew-description">
        <h3>Description</h3>
        <textarea
          placeholder="e.g. It’s always good to take a break. This 15 minute break will  recharge the batteries a little."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        </div>
        <div className="addNew-subtasksContainer">
        <h3>Subtasks</h3>
        {subtasks.map((subtask, index) => (
          <div key={index} className={`subtask-item ${errorIndexes.find(e => e == index) || index == 0 && errorIndexes.includes(0) ? 'error' : ''}`}>
            <input
              type="text"
              name="subtask"
              value={subtask}
              onChange={(e) => {handleChangeSubtask(index, e.target.value); setErrorIndexes(errorIndexes.filter(i => i !== index))}}
              className={`input-subtask`}
            />
            <p className="error-text">Required</p>
            <button type="button" onClick={() => handleRemoveSubtask(index)} className="btn-remove-subtask">
            <img src="/images/deleteBtn.svg" alt="" />
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddSubtask} className="btn-add-subtask">
          + Add New Subtask
        </button>
        </div>
        <div className={`form-actions ${isSelecting ? 'selecting' : ''}`}>
          <h3>Status</h3>
          <button type="button" onClick={triggerMenu} className={`task-detail-trigger ${isSelecting ? 'selecting' : ''}`}>{taskStatus} <img src="/images/arrow-down.svg" alt="Icon" /></button>
            <div className="task-detail-options">
              {data.boards.find(x => x.id == currentBoardId).columns.map(x => x.name).map((x, index) => (
                <p onClick={() => handleClick(x)} key={index}>{x}</p>
              ))}
            </div>
          <button type="submit" className="addNewTask-createTask">
            Create Task
          </button>
          
        </div>
      </form>
    </div>
  );
}
