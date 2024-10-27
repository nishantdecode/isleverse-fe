"use client";

import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { useRouter } from "next/navigation";
import { UserContext } from "./UserProvider";

const BASE_URL =
  process.env.NEXT_PUBLIC_ENV === "PROD"
    ? process.env.NEXT_PUBLIC_API_PROD
    : process.env.NEXT_PUBLIC_API_DEV;

const SocketContext = createContext();

let socket = null;

const SocketProvider = ({ children }) => {
  const { user } = useContext(UserContext);

  const router = useRouter();
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

  useEffect(() => {
    // Initialize media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
      });

    // Initialize socket connection
    socket = io(BASE_URL);

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    socket.on("callEnded", () => {
      setCallEnded(true);
      if (connectionRef.current) {
        connectionRef.current.destroy();
        connectionRef.current = null;
      }
      window.location.href = "/";
    });

    socket.on("receiveMessage", ({ message }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...message,
          timestamp: new Date(),
        },
      ]);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

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

    peer.signal(call.signal);
    connectionRef.current = peer;
    router.push("/call");
  };

  const callUser = (id) => {
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

    socket.on("callAccepted", (data) => {
      setCallAccepted(true);
      setCall({ name: data.name, from: data.from });
      peer.signal(data.signal);
      router.push("/call");
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }
    socket.emit("callEnded");
    window.location.href = "/";
  };

  const sendMessage = (message, to) => {
    socket.emit("sendMessage", { to, message });
    setMessages((prevMessages) => [...prevMessages, message]);
  };

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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
