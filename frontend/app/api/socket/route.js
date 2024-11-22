


//okay how am i going to implement a live chat using socket.io and other socket features 


//basically im going to need to somehow connect a lot of user to different type of room. and have different data stored in the database
//I think i can have each room have a unique code... Then from this point i if a user click that message room.. It wuld signal to the backend 
//and then all the old messages will be pulled from the databse (obviously) i cannot query ALL of them but ya know ill think of something that allows me to render a certain number of messages 
//porbably will do this using scrolls trigger 
//put anyways each room si unique and basically after every message this will send to everyone in the group.. as well as be saved in the database. however this will be happening at the same time of the user messaging
//so that there is no lag in communciation 
import { Server } from "socket.io";

let io;

export async function GET(req, res) {
  // Ensure the server is accessible
  if (!res.socket?.server) {
    console.error("Socket server not initialized");
    return res.end();
  }

  // Check if the Socket.IO server is already initialized
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO...");

    io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*", // Allow all origins for now
        methods: ["GET", "POST"],
      },
    });

    const messages = []; // Temporary in-memory storage

    // WebSocket connection handler
    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Send existing messages to the client
      socket.emit("room-messages", messages);

      // Handle incoming messages
      socket.on("send-message", (data) => {
        console.log("New message:", data);
        messages.push(data); // Store the message
        io.emit("receive-message", data); // Broadcast to all clients
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    res.socket.server.io = io; // Save instance to prevent reinitialization
    console.log("Socket.IO initialized");
  } else {
    console.log("Socket.IO already running");
  }

  res.end(); // End the GET request
}
