import React, { useEffect, useState } from "react";
import { z } from "zod";
import { statuses, TaskType } from "../pages/TaskManagerPage";
import useTaskStore from "../store/taskModalStore";
import { formatDateToInput } from "../utils/commonUtils";
import { createTaskEndpoint, updateTaskEndpoint } from "../http/taskEndpoint";

interface ModalTaskProps {
  onSubmitTask: (task: TaskType) => void;
}

// Define Zod schema for validation
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.number().int().min(0, "Invalid status"),
});

type TaskFormData = z.infer<typeof taskSchema>;

// Helper function to get today's date in "YYYY-MM-DD" format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ModalTask: React.FC<ModalTaskProps> = ({ onSubmitTask }) => {
  const { editingTask, setEditingTask, isModalOpen, setIsModalOpen } =
    useTaskStore();

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    dueDate: getTodayDate(),
    status: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form data if editingTask exists
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        dueDate: editingTask.dueDate,
        status: editingTask.status,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        dueDate: getTodayDate(),
        status: 0,
      });
    }
  }, [editingTask]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data using Zod
    const result = taskSchema.safeParse(formData);
    if (!result.success) {
      // Map Zod errors to a simple object
      const validationErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          validationErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(validationErrors);
      return;
    }

    //If validation passes, add or update the task
    const isEditing = !!editingTask;
    if (isEditing) {
      updateTaskEndpoint(editingTask.id, formData)
        .then((updatedTask) => {
          if (updatedTask) {
            onSubmitTask(updatedTask);
          }
        })
        .catch((error) => {
          console.error("Error updating task:", error);
        });
    } else {
      createTaskEndpoint(formData)
        .then((newTask) => {
          if (newTask) {
            onSubmitTask(newTask);
          }
        })
        .catch((error) => {
          console.error("Error creating task:", error);
        });
    }

    setIsModalOpen(false); // Close modal after submission
    setEditingTask(null); // Clear editingTask after submission
    setFormData({
      title: "",
      description: "",
      dueDate: getTodayDate(),
      status: 0,
    }); // Reset form
    setErrors({}); // Clear errors
  };

  if (!isModalOpen) return null; // Don't render if modal is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editingTask ? "Edit Task" : "Add New Task"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.title ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.description
                  ? "focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formatDateToInput(formData.dueDate)}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.dueDate ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.dueDate ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.status ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.status ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            >
              {statuses.map((status, index) => (
                <option key={status} value={index}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false); // Close modal
                setEditingTask(null); // Clear editingTask when closing modal
              }}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editingTask ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTask;
