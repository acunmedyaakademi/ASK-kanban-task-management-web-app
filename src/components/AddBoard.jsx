import { useContext, useState } from "react";
import { BoardContext, DataContext, ModalContext } from "../App";

export default function AddBoard({}) {
  const { data, setData } = useContext(DataContext);
  const { setCurrentBoardId } = useContext(BoardContext);
  const { setIsModalOpen } = useContext(ModalContext);

  const [newColumns, setNewColumns] = useState([{ id: 0, name: "", tasks: [] }]);
  const [ errorIndexes, setErrorIndexes ] = useState([]);
  const [ errorBoardName, setErrorBoardName ] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!e.target.boardName.value.trim()){
      setErrorBoardName(true);
      return;
    }

    const columnInputs = e.target.columnName && Array.from(e.target.columnName);
    const isAnyColumnEmpty = columnInputs && columnInputs.some(input => !input.value.trim());

    setErrorIndexes(e.target.columnName && columnInputs.length > 0 ? columnInputs.reduce((acc, input, index) => !input.value.trim() ? [...acc, index] : acc, []) : e.target.columnName && e.target.columnName.value.trim() ? [] : [0]);


    if (e.target.columnName && columnInputs.length > 0 ? isAnyColumnEmpty : e.target.columnName && !e.target.columnName.value.trim()) return;
    

    const newColumnsNames = newColumns.map((x, index) => ({
      id: x.id,
      name: e.target.columnName.length > 0 ? columnInputs[index].value : e.target.columnName.value,
      tasks: []
    }));


    const newBoard = {
      id: data.boards[data.boards.length - 1].id + 1,
      name: e.target.boardName.value,
      columns: [...newColumnsNames],
    };

    setData({ ...data, boards: [...data.boards, newBoard] });
    setCurrentBoardId(newBoard.id);
    setIsModalOpen(false);
  }

  function handleClick() {
    const newColumn = { id: newColumns.length > 0 ? newColumns[newColumns.length - 1].id + 1 : 0, name: "", tasks: [] };
    setNewColumns([...newColumns, newColumn]);
  }

  function deleteInput(id) {
    setNewColumns(newColumns.filter((x) => x.id !== id));
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="editTask-container">
        <h2>Add New Board</h2>
        <div className={`board-name-input ${errorBoardName ? 'error' : ''}`}>
          <h3>Board Name</h3>
          <input onChange={() => setErrorBoardName(false)} className="editTask-title-input" type="text" placeholder="e.g. Web Design" name="boardName" />
          <p className="error-text">Required</p>
        </div>
        <div className="editTask-subtasksContainer">
          <h3>Board Columns</h3>
          {newColumns.map((x, index) => (
            <div className={`editTask-subtask ${errorIndexes.find(e => e == index) || index == 0 && errorIndexes.includes(0) ? 'error' : ''}`} key={x.id}>
              <input onChange={() => setErrorIndexes(errorIndexes.filter(i => i !== index))} name="columnName" type="text" />
              <p className="error-text">Required</p>
              <button type="button" onClick={() => deleteInput(x.id)}>
                <img src="/images/deleteBtn.svg" />
              </button>
            </div>
          ))}
          <button type="button" onClick={handleClick}>
            + Add New Column
          </button>
        </div>
        <div className="task-detail-status">
        <button type="submit">Create New Board</button>
        </div>
      </div>
    </form>
  );
}
