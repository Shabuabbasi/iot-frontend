import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(SOCKET_URL);
    
    this.socket.on("connect", () => {
      console.log("Connected to Real-time Hub:", this.socket.id);
    });

    return this.socket;
  }

  joinRoom(role) {
    if (this.socket) {
      this.socket.emit("join", role);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }
}

const socketInstance = new SocketService();
export default socketInstance;
