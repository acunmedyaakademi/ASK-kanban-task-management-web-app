import { useContext, useState } from "react";
import { BoardContext, DataContext } from "../App";

export default function EditTask({ task, setSelectedTask, setIsModalOpen }) {
  const [isSelecting, setIsSelecting] = useState(false);
  const { data, setData } = useContext(DataContext);
  const { currentBoardId } = useContext(BoardContext);

  const [newSubtasks, setNewSubtasks] = useState([]);
  const [prevTask, setPrevTask] = useState(task);
  const [ errorTitle, setErrorTitle ] = useState(false);
  const [ errorIndexes, setErrorIndexes ] = useState([]);
  const [ newErrorIndexes, setNewErrorIndexes ] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!e.target.title.value.trim()){
      setErrorTitle(true);
      return;
    }

    const subtaskInputs = e.target.subtaskTitle && Array.from(e.target.subtaskTitle);
    const isAnySubtaskEmpty = subtaskInputs && subtaskInputs.some(input => !input.value.trim());

    setErrorIndexes(e.target.subtaskTitle && subtaskInputs.length > 0 ? subtaskInputs.reduce((acc, input, index) => !input.value.trim() ? [...acc, index] : acc, []) : e.target.subtaskTitle && e.target.subtaskTitle.value.trim() ? [] : [0]);

    const newSubtaskInputs = e.target.newSubtaskTitle && Array.from(e.target.newSubtaskTitle);
    const isAnyNewSubtaskEmpty = newSubtaskInputs && newSubtaskInputs.some(input => !input.value.trim());

    setNewErrorIndexes(e.target.newSubtaskTitle && newSubtaskInputs.length > 0 ? newSubtaskInputs.reduce((acc, input, index) => !input.value.trim() ? [...acc, index] : acc, []) : e.target.newSubtaskTitle && e.target.newSubtaskTitle.value.trim() ? [] : [0]);

    if ((e.target.newSubtaskTitle && newSubtaskInputs.length > 0 ? isAnyNewSubtaskEmpty : e.target.newSubtaskTitle && !e.target.newSubtaskTitle.value.trim()) || (e.target.subtaskTitle && subtaskInputs.length > 0 ? isAnySubtaskEmpty : e.target.subtaskTitle && !e.target.subtaskTitle.value.trim())) return;

    const updatedTask = {
      ...task,
      title: e.target.title.value,
      description: e.target.description.value,
      subtasks: [
        ...task.subtasks.map((sub, index) => ({
          id: sub.id,
          title: e.target.subtaskTitle.length > 0 ? e.target.subtaskTitle[index].value : e.target.subtaskTitle.value,
          isCompleted: sub.isCompleted,
        })),
        ...(e.target.newSubtaskTitle
          ? e.target.newSubtaskTitle.length > 0
            ? Array.from(e.target.newSubtaskTitle).map((sub) => ({
                id: crypto.randomUUID(),
                title: sub.value,
                isCompleted: false,
              }))
            : [{ id: crypto.randomUUID(), title: e.target.newSubtaskTitle.value, isCompleted: false }]
          : []),
      ],
    };

    const updatedData = {
      ...data,
      boards: data.boards.map((board) =>
        board.id === currentBoardId
          ? {
              ...board,
              columns: board.columns.map((column) =>
                column.name === updatedTask.status
                  ? {
                      ...column,
                      tasks: column.tasks.some((t) => t.id === updatedTask.id)
                        ? column.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
                        : [...column.tasks, updatedTask],
                    }
                  : column.name === prevTask.status
                  ? {
                      ...column,
                      tasks: column.tasks.filter((t) => t.title !== task.title),
                    }
                  : column
              ),
            }
          : board
      ),
    };
    setNewSubtasks([]);
    setData(updatedData);
    setIsModalOpen(false);
    setSelectedTask(null);
  }

  function triggerMenu() {
    setIsSelecting(!isSelecting);
  }

  function handleClick(status) {
    const updatedTask = {
      ...task,
      status: status,
    };
    setPrevTask(task);
    setSelectedTask(updatedTask);
    setIsSelecting(false);
  }

  function addNewSubtask() {
    setNewSubtasks([...newSubtasks, { id: crypto.randomUUID(), title: "", isCompleted: false }]);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="editTask-container">
        <h2>Edit Task</h2>
        <div className={`editTask-title ${errorTitle ? 'error' : ''}`}>
          <h3>Title</h3>
          <input className="editTask-title-input" type="text" defaultValue={task.title} name="title" onChange={() => setErrorTitle(false)} />
          <p className="error-text">Required</p>
        </div>
        <div className="editTask-description">
          <h3>Description</h3>
          <textarea
          className="editTask-description-textarea"
            defaultValue={task.description}
            placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
            name="description"
          />
        </div>
        <div className="editTask-subtasksContainer">
          <h3>Subtasks</h3>
          {task.subtasks.map((subtask, index) => (
            <div key={index} className={`editTask-subtask ${errorIndexes.includes(index) ? 'error' : ''}`}>
              <input type="text" defaultValue={subtask.title} name="subtaskTitle" onChange={() => setErrorIndexes(errorIndexes.filter(i => i !== index))} />
              <p className="error-text">Required</p>
              <button
                type="button"
                onClick={() => {
                  const updatedTask = {
                    ...task,
                    subtasks: task.subtasks.filter((sub) => sub.title !== subtask.title),
                  };
                  setSelectedTask(updatedTask);
                }}
              >
                <img className="delete-icon" src="/images/deleteBtn.svg" alt="" />
              </button>
            </div>
          ))}
          {newSubtasks.map((subtask, index) => (
            <div key={index} className={`editTask-subtask ${newErrorIndexes.includes(index) ? 'error' : ''}`}>
              <input type="text" placeholder="New subtask" name="newSubtaskTitle" onChange={() => setNewErrorIndexes(newErrorIndexes.filter(i => i !== index))} />
              <p className="error-text">Required</p>
              <button type="button" onClick={() => setNewSubtasks(newSubtasks.filter((_, i) => i !== index))}>
                <img className="delete-icon" src="/images/deleteBtn.svg" alt="" />
              </button>
            </div>
          ))}
          <button type="button" className="edit-task-add-btn" onClick={addNewSubtask}>
            + Add New Subtask
          </button>
        </div>
        <div className={`task-detail-status ${isSelecting ? "selecting" : ""}`}>
          <h3>Status</h3>
          <button
            onClick={triggerMenu}
            className={`task-detail-trigger ${isSelecting ? "selecting" : ""}`}
            type="button"
          >
            {task.status} <img src="/images/arrow-down.svg" alt="Icon" />
          </button>
          <div className="task-detail-options">
            {data.boards
              .find((x) => x.id == currentBoardId)
              .columns.map((x) => x.name)
              .map((x, index) => (
                <p onClick={() => handleClick(x)} key={index}>
                  {x}
                </p>
              ))}
          </div>
          <button type="submit">Create Task</button>
        </div>
      </div>
    </form>
  );
}
