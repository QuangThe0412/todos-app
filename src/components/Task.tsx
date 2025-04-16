import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { TaskType } from "../pages/TaskManagerPage";
import useTaskStore from "../store/taskModalStore";
import { formatDate } from "../utils/commonUtils";

interface TaskProps {
  task: TaskType;
  handleDeleteTask: (taskId: string) => void;
}

const Task: React.FC<TaskProps> = ({ task, handleDeleteTask }) => {
  const { setIsModalOpen, setEditingTask } = useTaskStore();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  const handleEdit = () => {
    setEditingTask(task); // Set task hiện tại vào editingTask
    setIsModalOpen(true); // Mở modal
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDeleteTask(task.id);
  };

  return (
    <div className="relative">
      <li
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="p-4 border rounded-lg shadow-sm bg-white hover:bg-gray-50 flex flex-col gap-2"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
          <p className="text-sm text-gray-500">{formatDate(task.dueDate)}</p>
        </div>
      </li>
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Ngăn chặn sự kiện click bị chặn bởi draggable
            handleEdit();
          }}
          className="px-2 py-1 text-sm text-white bg-purple-500 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Task;
