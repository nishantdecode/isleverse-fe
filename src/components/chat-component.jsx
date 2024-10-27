"use client";

import {
  useState,
  useRef,
  useLayoutEffect,
  useContext,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SocketContext } from "@/context/SocketProvider";
import { UserContext } from "@/context/UserProvider";

function MessageBubble({ message, isCurrentUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
    >
      {!isCurrentUser && (
        <Avatar className="w-8 h-8 mr-2">
          <AvatarImage src={message.imageUrl} alt="User Avatar" />
          <AvatarFallback>U2</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`rounded-lg p-3 max-w-xs ${
          isCurrentUser ? "bg-primary text-primary-foreground" : "bg-secondary"
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p className="text-xs mt-1 opacity-70">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      {isCurrentUser && (
        <Avatar className="w-8 h-8 ml-2">
          <AvatarImage src={message.imageUrl} alt="User Avatar" />
          <AvatarFallback>U1</AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}

function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center border-t p-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Send
      </button>
    </form>
  );
}

export default function ChatComponent() {
  const { user } = useContext(UserContext);
  const { name, call, messages, sendMessage } = useContext(SocketContext);

  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content) => {
    sendMessage(
      {
        id: messages.length + 1,
        sender: name,
        content,
        timestamp: new Date(),
        imageUrl: user.pic,
      },
      call.from
    );
  };

  return (
    <div className="flex flex-col h-full w-full mx-auto rounded-l-lg overflow-hidden">
      <div className="bg-primary text-primary-foreground p-4">
        <h2 className="text-xl font-semibold">{call.name}</h2>
      </div>
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <AnimatePresence initial={false}>
          {messages?.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.sender === name}
            />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </ScrollArea>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
