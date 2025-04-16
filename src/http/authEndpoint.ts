import { getRequestorId } from "../utils/commonUtils";

//change role
export const changeRoleEndpoint = async () => {
  try {
    const requestorId = getRequestorId();

    const response = await fetch(
      `http://localhost:5245/api/auth/changeRole?requestorId=${requestorId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to change role");
    }

    const newTask = await response.json();
    return newTask;
  } catch (error) {
    console.error("Error changing role:", error);
  }
};
