import { TaskType } from "./../pages/TaskManagerPage";
import { getRequestorId } from "../utils/commonUtils";

export const fetchTasksEndpoint = async (status = "", order = "asc") => {
  try {
    const requestorId = getRequestorId();

    const response = await fetch(
      `http://localhost:5245/api/Tasks?requestorId=${requestorId}&order=${order}&status=${status}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

export const updateTaskEndpoint = async (taskId: string, data: any) => {
  try {
    const requestorId = getRequestorId();

    const response = await fetch(
      `http://localhost:5245/api/Tasks/${taskId}?requestorId=${requestorId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update task status");
    }

    const updatedTask = await response.json();
    return updatedTask;
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};

//create task
export const createTaskEndpoint = async (data: any) => {
  try {
    const requestorId = getRequestorId();

    const response = await fetch(
      `http://localhost:5245/api/Tasks?requestorId=${requestorId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create task");
    }

    const newTask = await response.json();
    return newTask;
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

//delete task
export const deleteTaskEndpoint = async (taskId: string) => {
  try {
    const requestorId = getRequestorId();

    const response = await fetch(
      `http://localhost:5245/api/Tasks/${taskId}?requestorId=${requestorId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete task");
    }

    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};
