import React, { useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { TaskType } from "../pages/TaskManagerPage";
import Task from "./Task";

interface ColumnProps {
  id: string;
  tasks: TaskType[];
  handleDeleteTask: (taskId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ id, tasks, handleDeleteTask }) => {
  const { setNodeRef } = useDroppable({ id });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Hàm sắp xếp danh sách công việc theo dueDate
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Hàm thay đổi thứ tự sắp xếp
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <div ref={setNodeRef} className="p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          {id === "TODO"
            ? "To-Do"
            : id === "INPROGRESS"
            ? "In Progress"
            : "Completed"}
        </h2>
        <button
          onClick={toggleSortOrder}
          className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Sort ({sortOrder === "asc" ? "Asc" : "Desc"})
        </button>
      </div>
      <ul className="space-y-4">
        {sortedTasks
          .filter((task) => task.statusString === id)
          .map((task) => (
            <Task
              key={task.id}
              task={task}
              handleDeleteTask={handleDeleteTask}
            />
          ))}
      </ul>
    </div>
  );
};

export default Column;
