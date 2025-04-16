import React, { useEffect, useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import Column from "../components/Column";
import {
  deleteTaskEndpoint,
  fetchTasksEndpoint,
  updateTaskEndpoint,
} from "../http/taskEndpoint";
import useTaskStore from "../store/taskModalStore";
import ModalTask from "../components/ModalTask";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";
import { changeRoleEndpoint } from "../http/authEndpoint";

export const statuses = ["TODO", "INPROGRESS", "COMPLETED"] as const;

export interface TaskType {
  id: string;
  title: string;
  description: string;
  status: number;
  statusString: string;
  dueDate: string;
}

const TaskManagerPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const { setIsModalOpen } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState(""); // State cho thanh tìm kiếm
  const userInfo =
    localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user")!)
      : null;

  useEffect(() => {
    fetchTasksEndpoint().then((data) => {
      if (data) {
        const updatedTasks = data.map((task: TaskType) => {
          return {
            ...task,
            statusString: statuses[task.status],
          };
        });
        setTasks(updatedTasks);
      }
    });
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;

    const newStatusIndex = statuses.indexOf(
      over.id as (typeof statuses)[number]
    );

    if (task.status === newStatusIndex) return;

    if (statuses.includes(over.id as (typeof statuses)[number])) {
      task.status = statuses.indexOf(over.id as (typeof statuses)[number]);
    }

    updateTaskEndpoint(task.id, task).then((updatedTask) => {
      if (updatedTask) {
        const newTasks = tasks.map((t) => {
          if (t.id === task.id) {
            return { ...t, statusString: over.id as string };
          }
          return t;
        });
        setTasks(newTasks);
      }
    });
  };

  // Lọc danh sách công việc dựa trên searchQuery
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTask = (task: TaskType) => {
    //check if task exists in tasks
    const existingTask = tasks.find((t) => t.id === task.id);
    if (existingTask) {
      // Update existing task
      const updatedTasks = tasks.map((t) =>
        t.id === task.id ? { ...t, ...task } : t
      );
      setTasks(updatedTasks);
    } else {
      // Add new task
      setTasks((prevTasks) => [...prevTasks, task]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    // Hiển thị dialog xác nhận
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    deleteTaskEndpoint(taskId)
      .then(() => {
        toast.success("Task deleted successfully!");
        // Xóa task khỏi danh sách
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
      })
      .catch((error) => {
        toast.error("Failed to delete task: " + error.message);
      });
  };

  const handleChangeRole = () => {
    changeRoleEndpoint().then((res) => {
      if (res) {
        const { data } = res;
        localStorage.setItem("user", JSON.stringify(data));
        window.location.reload();
      }
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            {/* Hiển thị thông tin người dùng */}
            <div>
              <p className="text-lg font-semibold text-gray-800">
                Welcome, {userInfo?.username}
              </p>
              <p className="text-sm text-gray-500">
                Role: {userInfo?.roleName}
              </p>
            </div>
            {/* Nút Change Role và Logout */}
            <div className="flex gap-4">
              <button
                onClick={handleChangeRole}
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Change Role
              </button>
              <button
                onClick={() => {
                  // Xử lý logout
                  localStorage.removeItem("user");
                  window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
                }}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Task Manager
          </h1>
          {/* Thanh tìm kiếm */}
          <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              + Add Task
            </button>
          </div>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {statuses.map((status) => (
                <Column
                  key={status}
                  id={status}
                  tasks={filteredTasks}
                  handleDeleteTask={handleDeleteTask}
                />
              ))}
            </div>
          </DndContext>
        </div>
      </div>
      {/* Modal */}
      <ModalTask onSubmitTask={handleSubmitTask} />
    </>
  );
};

export default TaskManagerPage;
