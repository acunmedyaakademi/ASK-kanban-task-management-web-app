import { useContext, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BoardContext, DataContext, IsOpenContext, ModalContext } from "../App";
import TaskDetails from "./TaskDetails";
import EditTask from "./EditTask";
import DeleteModal from "./DeleteModal";
import AddBoard from "./AddBoard";
import AddNewTask from "./AddNewTask";
import AddNewColumn from "./AddNewColumn";
import EditBoard from "./EditBoard";
import { SortableItem } from "./SortableItem";
import DroppableColumn from "./DroppableColumn";

export default function Container() {
  const { data, setData } = useContext(DataContext);
  const { currentBoardId } = useContext(BoardContext);
  const { modalContent, setModalContent, isModalOpen, setIsModalOpen } = useContext(ModalContext);
  const { isOpen } = useContext(IsOpenContext);
  

  const [selectedTask, setSelectedTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  if (!data || data.length === 0) {
    return <p>Loading data...</p>;
  }

  const currentBoard = data.boards.find((x) => x.id === currentBoardId);

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeColumn = currentBoard.columns.find((col) =>
      col.tasks.some((task) => task.id === active.id)
    );
    let overColumn = currentBoard.columns.find((col) =>
      col.tasks.some((task) => task.id === over.id)
    );
  
    if (!overColumn) {
      overColumn = currentBoard.columns.find((col) => col.id === over.id);
    }

    const activeTask = activeColumn.tasks.find((task) => task.id === active.id);

    if (activeColumn.id === overColumn.id) {
      const oldIndex = activeColumn.tasks.findIndex((task) => task.id === active.id);
      const newIndex = activeColumn.tasks.findIndex((task) => task.id === over.id);

      const newTasks = arrayMove(activeColumn.tasks, oldIndex, newIndex);
      activeColumn.tasks = newTasks;
    } else {
      const overIndex = overColumn.tasks.findIndex((task) => task.id === over.id);

      activeColumn.tasks = activeColumn.tasks.filter((task) => task.id !== active.id);
      overColumn.tasks.splice(overIndex, 0, activeTask);
    }

    const updatedTask = {
      ...activeTask,
      status: overColumn.name,
    }
    const updatedData = {
      ...data,
      boards: data.boards.map((board) =>
        board.id === currentBoardId
          ? {
              ...board,
              columns: board.columns.map((column) =>
                column.name === overColumn.name
                  ? {
                      ...column,
                      tasks: column.tasks.map((t) =>
                        t.id === active.id ? updatedTask : t
                      ),
                    }
                  : column
              ),
            }
          : board
      ),
    }

    setData(updatedData);
  }
  

  function handleClick(task) {
    setSelectedTask(task);
    setIsModalOpen(true);
    setModalContent("detail");
  }

  function addNewColumn() {
    setModalContent("addColumn");
    setIsModalOpen(true);
  }

  function modalCloseClick(e) {
    if (e.target.classList.contains("modal")) {
      setIsModalOpen(false);
      setSelectedTask(null);
    }
  }

  return (
    <div className={`container ${isOpen ? "shift-right" : ""}`}>
      {currentBoard.columns.length === 0 ? (
        <div className="empty-columns-screen">
          <p>This board is empty. Create a new column to get started.</p>
          <button onClick={addNewColumn}>+ Add New Column</button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="task-columns-container">
          {currentBoard.columns.map((column) => (
              <DroppableColumn key={column.id} column={column}>
                <h2>
                  <span></span> {column.name.toUpperCase()} ({column.tasks.length})
                </h2>
                <div className={`task-column-container ${column.tasks.length === 0 ? "empty-task-column" : ""}`}>
                  <SortableContext
                    items={column.tasks.map((task) => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {column.tasks.map((task) => (
                      <SortableItem key={task.id} id={task.id} onClick={() => handleClick(task)}>
                        <div className="task-column-item">
                          <h3>{task.title}</h3>
                          <p>
                            {task.subtasks.filter((x) => x.isCompleted).length} of{" "}
                            {task.subtasks.length} subtasks
                          </p>
                        </div>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </div>
              </DroppableColumn>
            ))}
            <div onClick={addNewColumn} className="new-column">
              <p>+ New Column</p>
            </div>
          </div>
        </DndContext>
      )}
      {isModalOpen && (
        <div onClick={modalCloseClick} className="modal">
          {modalContent === "detail" ? (
            <TaskDetails
              task={selectedTask}
              setSelectedTask={setSelectedTask}
              setModalContent={setModalContent}
            />
          ) : modalContent === "edit" ? (
            <EditTask
              task={selectedTask}
              setSelectedTask={setSelectedTask}
              setIsModalOpen={setIsModalOpen}
            />
          ) : modalContent === "delete" ? (
            <DeleteModal
              task={selectedTask}
              setSelectedTask={setSelectedTask}
              setIsModalOpen={setIsModalOpen}
            />
          ) : modalContent === "add" ? (
            <AddNewTask setIsModalOpen={setIsModalOpen} />
          ) : modalContent === "addBoard" ? (
            <AddBoard />
          ) : modalContent === "editBoard" ? (
            <EditBoard />
          ) : modalContent === "addColumn" ? (
            <AddNewColumn />
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
}