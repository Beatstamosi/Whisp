import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_API_BASE_URL}`);
    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
}

export default useSocket;
