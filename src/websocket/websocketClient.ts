import eventEmitter from "../utils/eventEmitter";

const socket = new WebSocket("ws://localhost:5245/ws");

// Khi kết nối WebSocket được mở
socket.onopen = () => {
  console.log("WebSocket connection established.");
  socket.send("Hello from the client!"); // Gửi tin nhắn đến backend
};

// Khi nhận được tin nhắn từ backend
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log("Received message:", message);

  // Phát sự kiện dựa trên message.type
  eventEmitter.emit(message.type, message);
};

// Khi kết nối WebSocket bị đóng
socket.onclose = (event) => {
  console.log("WebSocket connection closed:", event.reason);
};

// Khi xảy ra lỗi trong WebSocket
socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

export default socket;
