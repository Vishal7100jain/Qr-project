// socket/SocketManager.ts
import { io, Socket } from "socket.io-client";

type EventCallback = (data: any) => void;

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private eventCallbacks: Map<string, EventCallback[]> = new Map();

  private constructor() {}

  // Singleton instance
  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public connect(url: string): void {
    if (!this.socket) {
      const apiKey = process.env.NEXT_PUBLIC_MARKET_DATA_SOCKET_API_KEY! || "";
      const apiSecret =
        process.env.NEXT_PUBLIC_MARKET_DATA_SOCKET_API_SECRET! || "";

      this.socket = io(url, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        auth: {
          apiKey,
          apiSecret,
        },
      });

      this.socket.on("connect", () => {
        console.log("✅ Connected to server via Socket.IO:", this.socket?.id);
      });

      this.socket.on("disconnect", () => {
        console.log("⚡ Disconnected from server");
      });

      // Listen for all registered events
      this.socket.onAny((event, data) => {
        const callbacks = this.eventCallbacks.get(event);
        if (callbacks) {
          callbacks.forEach((cb) => cb(data));
        }
      });
    }
  }

  public on(event: string, callback: EventCallback): void {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event)?.push(callback);
  }

  public off(event: string, callback?: EventCallback): void {
    if (!callback) {
      this.eventCallbacks.delete(event);
    } else {
      const callbacks = this.eventCallbacks.get(event);
      if (callbacks) {
        this.eventCallbacks.set(
          event,
          callbacks.filter((cb) => cb !== callback)
        );
      }
    }
  }

  public emit(event: string, data: any): void {
    this.socket?.emit(event, data);
  }

  public getSocket(): Socket | null {
    return this.socket;
  }
}

export default SocketManager.getInstance();
