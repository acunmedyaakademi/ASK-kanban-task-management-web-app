import { useContext, useState } from "react";
import { BoardContext, DataContext, ModalContext } from "../App";

export default function EditBoard() {
  const { data, setData } = useContext(DataContext);
  const { currentBoardId } = useContext(BoardContext);
  const { setIsModalOpen } = useContext(ModalContext);

  const [ newColumns, setNewColumns ] = useState([]);
  const [newData, setNewData] = useState(data);

  function handleClick(){
    const newColumn = { id: newColumns.length > 0 ? newColumns[newColumns.length - 1].id + 1 : data.boards.find(x => x.id == currentBoardId).columns[data.boards.find(x => x.id == currentBoardId).columns.length - 1].id + 1, name: '', tasks: [] };
    setNewColumns([...newColumns, newColumn]);
  }

  function handleSubmit(e){
    e.preventDefault();
    if (!e.target.boardName.value.trim()) return;

    const newColumnsNames = newColumns.map((x, index) => (
      { id: x.id, 
        name: e.target.newColumnName.value ? e.target.newColumnName.value : e.target.newColumnName[index].value, 
        tasks: [] 
      }
    ));


    const updatedData = {
      ...newData,
      boards: newData.boards.map(board => board.id == currentBoardId 
        ? {
          ...board,
          name: e.target.boardName.value,
          columns: [
            ...board.columns,
            ...newColumnsNames
          ]
        } 
        : board)
    }
    setData(updatedData);
    setIsModalOpen(false);
  }

  function deleteColumn(x){
    if(confirm('Are you sure you want to delete this column?')){
      const updatedData = {
        ...data,
        boards: data.boards.map(board => board.id == currentBoardId 
          ? {
            ...board,
            columns: 
            board.columns.filter(column => column.name !== x.name)
          } 
          : board)
      }
      setNewData(updatedData);
    }
  }

  function editCurrentBoardName(e, x){
    const updatedData = {
      ...data,
      boards: data.boards.map(board => board.id == currentBoardId 
        ? {
          ...board,
          columns: 
          board.columns.map(column => column.id == x.id
            ? {
              ...column,
              name: e.target.value
            }
            : column)
        } 
        : board)
    }
    setNewData(updatedData);
  }

  return (
    <div className="edit-board-container">
      <form onSubmit={handleSubmit}>
        <h2>Edit Board</h2>
        <p>Board Name</p>
        <input className="board-name-input" type="text" name="boardName" defaultValue={data.boards.find(x => x.id == currentBoardId).name} placeholder="e.g. Project Management" />
        <div className="new-columns-input-container">
            <p>Columns</p>
            {newData.boards.find(x => x.id == currentBoardId).columns.map(x => (
              <div className="new-column-input" key={x.id}>
                <input className="editBoard-column-input" name="columnName" type="text" defaultValue={x.name} onChange={(e) => editCurrentBoardName(e, x)} />
                <img onClick={() => deleteColumn(x)} src="/images/deleteBtn.svg" />
              </div>
            ))}
            {newColumns.map(x => (
              <div className="new-column-input" key={x.id}>
                <input name="newColumnName" type="text" />
                <img onClick={() => setNewColumns(newColumns.filter(c => c.id !== x.id))} src="/images/deleteBtn.svg" />
              </div>
            ))}
            <button className="cancel-btn" type="button" onClick={handleClick}>+ Add New Column</button>
          </div>
        <button className="save-btn" type="submit">Save Changes</button>
      </form>
    </div>
  );
}