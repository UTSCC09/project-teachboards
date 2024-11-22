import { Server } from "socket.io";

// Function to create the Socket.IO server
export function createServer(port, corsOptions) {
  return new Server(port, {
    cors: corsOptions,
  });
}

// Function to setup socket events
export function setupSocketEvents(io) {
  let messages = []; // In-memory storage for messages

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Send all existing messages to the connected client
    socket.emit("room-messages", messages);

    // Handle receiving a new message
    socket.on("send-message", (data) => {
      console.log("New message:", data);
      messages.push(data); // Save the message
      io.emit("receive-message", data); // Broadcast to all connected clients
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

// Function to start the server
export function startServer() {
  const PORT = 4000;
  const corsOptions = {
    origin: "*", // Allow all origins temporarily
    methods: ["GET", "POST"],
  };

  const io = createServer(PORT, corsOptions);
  setupSocketEvents(io);

  console.log(`Socket.IO server running on http://localhost:${PORT}`);
}

// Run the server
startServer();
