import { create } from "zustand";
import { TaskType } from "../pages/TaskManagerPage";

interface TaskModalStore {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  editingTask: TaskType | null;
  setEditingTask: (task: TaskType | null) => void;
}

const useTaskStore = create<TaskModalStore>(
  (set: (partial: Partial<TaskModalStore>) => void) => ({
    isModalOpen: false,
    setIsModalOpen: (isOpen: boolean) => set({ isModalOpen: isOpen }),
    editingTask: null,
    setEditingTask: (task: TaskType | null) => set({ editingTask: task }),
  })
);

export default useTaskStore;
