import { useContext, useState } from "react";
import { DataContext, BoardContext, ModalContext } from "../App";

export default function AddNewColumn() {

  const { data, setData } = useContext(DataContext);
  const { currentBoardId } = useContext(BoardContext);
  const { setIsModalOpen } = useContext(ModalContext);

  const [ inputValue, setInputValue ] = useState('');
  const [ error, setError ] = useState(false);

  function handleChange(e){
    setInputValue(e.target.value);
    setError(false);
  }

  function handleClick(){
    if(!inputValue.trim()){
      setError(true);
      return;
    }
    const newColumn = {
      id: data.boards.find(x => x.id == currentBoardId).columns[data.boards.find(x => x.id == currentBoardId).columns.length - 1] + 1,
      name: inputValue,
      tasks: []
    }

    setData({
      ...data,
      boards: data.boards.map(x => {
        if(x.id == currentBoardId){
          return {
            ...x,
            columns: [...x.columns, newColumn]
          }
        } else {
          return x;
        }
      })
    });
    setIsModalOpen(false);
    setInputValue('');
  }

  function cancel(){
    setInputValue('');
    setIsModalOpen(false);
  }

  return (
    <div className="new-column-container">
      <h2>Add New Column</h2>
      <p>Name</p>
      <div className={`new-column-input ${error ? 'error' : ''}`}>
        <input onChange={handleChange} value={inputValue} type="text" placeholder="e.g. To Do" />
        <p className="error-text">Required</p>
      </div>
      <div className="new-column-container-buttons">
        <button className="cancel-btn" onClick={cancel}>Cancel</button>
        <button className="save-btn" onClick={handleClick}>Create New Column</button>
      </div>
    </div>
  );
}