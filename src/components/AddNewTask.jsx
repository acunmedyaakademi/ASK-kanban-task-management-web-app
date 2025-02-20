import { useContext, useState } from "react";
import { BoardContext, DataContext } from "../App";

export default function AddNewTask() {
  const { data, setData } = useContext(DataContext);
  const { currentBoardId } = useContext(BoardContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([""]);
  const [status, setStatus] = useState("Todo");
  const [ isSelecting, setIsSelecting ] = useState(false);
  const [ taskStatus, setTaskStatus ] = useState(data.boards.find(x => x.id == currentBoardId).columns[0].name);

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
    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      title,
      description,
      status: taskStatus,
      subtasks: subtasks.map((sub) => ({ title: sub, isCompleted: false })),
    };

    const updatedBoards = data.boards.map((board) => {
      if (board.id === 0) {
        return {
          ...board,
          columns: board.columns.map((col) => (col.name === status ? { ...col, tasks: [...col.tasks, newTask] } : col)),
        };
      }
      return board;
    });

    setData({ ...data, boards: updatedBoards });
    setTitle("");
    setDescription("");
    setSubtasks([""]);
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
        <h3>Title</h3>
        <input
          type="text"
          placeholder="e.g. Take coffee break"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="addNewTask-title-input"
        />
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
          <div key={index} className="subtask-item">
            <input
              type="text"
              value={subtask}
              onChange={(e) => handleChangeSubtask(index, e.target.value)}
              className="input-subtask"
            />
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
          <button onClick={triggerMenu} className={`task-detail-trigger ${isSelecting ? 'selecting' : ''}`}>{taskStatus} <img src="/images/arrow-down.svg" alt="Icon" /></button>
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
