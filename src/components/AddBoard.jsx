import { useContext, useState } from "react";
import { BoardContext, DataContext, ModalContext } from "../App";

export default function AddBoard({}) {
  const { data, setData } = useContext(DataContext);
  const { setCurrentBoardId } = useContext(BoardContext);
  const { setIsModalOpen } = useContext(ModalContext);

  const [newColumns, setNewColumns] = useState([{ id: 0, name: "", tasks: [] }]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!e.target.boardName.value.trim()) return;

    const newColumnsNames = newColumns.map((x, index) => ({
      id: x.id,
      name: e.target.columnName.value ? e.target.columnName.value : e.target.columnName[index].value,
      tasks: [],
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
        <h3>Board Name</h3>
        <input className="editTask-title-input" type="text" placeholder="e.g. Web Design" name="boardName" />
        <div className="editTask-subtasksContainer">
          <h3>Board Columns</h3>
          {newColumns.map((x) => (
            <div className="editTask-subtask" key={x.id}>
              <input name="columnName" type="text" />
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
