"use client";

import React, { createContext, useState, useRef, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { useRouter } from "next/navigation";
import { UserContext } from "./UserProvider";

const BASE_URL = process.env.NEXT_PUBLIC_ENV === "PROD"
  ? process.env.NEXT_PUBLIC_API_PROD
  : process.env.NEXT_PUBLIC_API_DEV;

const SocketContext = createContext();

const socketOptions = {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
};

const SocketProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");
  const [incomingStream, setIncomingStream] = useState(null);
  const [messages, setMessages] = useState([]);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const streamRef = useRef();

  // Handle navigation to home page
  const navigateToHome = () => {
    // Check if we're already on the home page to avoid unnecessary navigation
    if (window.location.pathname !== '/') {
      router.push('/');
    }
  };

  // Initialize socket connection
  useEffect(() => {
    let newSocket = null;

    const initializeSocket = () => {
      if (!newSocket) {
        newSocket = io(BASE_URL, socketOptions);
        setSocket(newSocket);

        newSocket.on("connect", () => {
          console.log("Socket connected:", newSocket.id);
          setIsConnected(true);
        });

        newSocket.on("disconnect", () => {
          console.log("Socket disconnected");
          setIsConnected(false);
        });

        newSocket.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
          setIsConnected(false);
        });

        newSocket.on("me", (id) => {
          setMe(id);
        });

        newSocket.on("callUser", ({ from, name: callerName, signal }) => {
          setCall({ isReceivingCall: true, from, name: callerName, signal });
        });

        newSocket.on("callEnded", () => {
          handleCallEnd();
        });

        newSocket.on("peerDisconnected", () => {
          handleCallEnd();
        });

        newSocket.on("userBusy", () => {
          handleCallEnd();
        });

        newSocket.on("receiveMessage", ({ message }) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              ...message,
              timestamp: new Date(),
            },
          ]);
        });
      }
    };

    initializeSocket();

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Initialize media stream
  useEffect(() => {
    const initializeStream = async () => {
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(currentStream);
        streamRef.current = currentStream;
      } catch (err) {
        console.error("Error accessing media devices:", err);
        navigateToHome();
      }
    };

    initializeStream();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (userVideo.current && incomingStream) {
      userVideo.current.srcObject = incomingStream;
    }
  }, [incomingStream]);

  useEffect(() => {
    if (user) {
      setName(user.name.trim().split(" ")[0]);
    }
  }, [user]);

  // Clean up call state
  const cleanupCall = () => {
    // Clean up peer connection
    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }

    // Reset call-related states
    setCallAccepted(false);
    setCallEnded(true);
    setCall({});
    setIncomingStream(null);

    // Navigate to home page
    navigateToHome();
  };

  const handleCallEnd = () => {
    console.log("Call ended, cleaning up...");
    
    // Clean up the call state and navigate home
    cleanupCall();

    // Notify peer if we initiated the call end
    if (socket && call.from) {
      socket.emit("callEnded", { to: call.from });
    }
  };

  const answerCall = () => {
    if (!socket || !stream) return;
    
    setCallAccepted(true);
    setCallEnded(false);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", {
        signal: data,
        to: call.from,
        name: name,
        from: me,
      });
    });

    peer.on("stream", (currentStream) => {
      setIncomingStream(currentStream);
    });

    // Handle peer connection closure
    peer.on("close", () => {
      handleCallEnd();
    });

    peer.on("error", (error) => {
      console.error("Peer connection error:", error);
      handleCallEnd();
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
    router.push("/call");
  };

  const callUser = (id) => {
    if (!socket || !stream) return;

    setCallEnded(false);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      setIncomingStream(currentStream);
    });

    // Handle peer connection closure
    peer.on("close", () => {
      handleCallEnd();
    });

    peer.on("error", (error) => {
      console.error("Peer connection error:", error);
      handleCallEnd();
    });

    socket.on("callAccepted", (data) => {
      setCallAccepted(true);
      setCall({ name: data.name, from: data.from });
      peer.signal(data.signal);
      router.push("/call");
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    handleCallEnd();
  };

  const sendMessage = (message, to) => {
    if (!socket) return;
    socket.emit("sendMessage", { to, message });
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        incomingStream,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        messages,
        sendMessage,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };