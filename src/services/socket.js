import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'wss://backend-ziply.onrender.com';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 10000; // Increased to 10 seconds
    this.isConnecting = false;
  }

  connect() {
    if (this.isConnecting) {
      console.log('Socket connection already in progress');
      return;
    }

    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.isConnecting = true;
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No token available for socket connection');
      this.isConnecting = false;
      return;
    }

    try {
      this.socket = io(SOCKET_URL, {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        timeout: 30000, // Increased to 30 seconds
        transports: ['websocket', 'polling'] // Added transport options
      });

      this.socket.on('connect', () => {
        console.log('Socket connected successfully');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        this.isConnecting = false;
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, try to reconnect
          this.socket.connect();
        }
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.reconnectAttempts++;
        this.isConnecting = false;
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => {
            this.socket.connect();
          }, this.reconnectDelay);
        } else {
          console.error('Max reconnection attempts reached');
        }
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
        this.isConnecting = false;
      });
    } catch (error) {
      console.error('Error initializing socket:', error);
      this.isConnecting = false;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      this.reconnectAttempts = 0;
      this.isConnecting = false;
    }
  }

  // Subscribe to events
  subscribe(event, callback) {
    if (!this.socket) {
      this.connect();
    }

    if (this.socket) {
      this.socket.on(event, callback);
      this.listeners.set(event, callback);
    }
  }

  // Unsubscribe from events
  unsubscribe(event) {
    if (this.socket && this.listeners.has(event)) {
      this.socket.off(event, this.listeners.get(event));
      this.listeners.delete(event);
    }
  }

  // Emit events
  emit(event, data) {
    if (!this.socket) {
      console.warn('Socket not connected. Attempting to connect...');
      this.connect();
    }

    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Event not emitted:', event);
    }
  }
}

export const socketService = new SocketService();
export default socketService; 