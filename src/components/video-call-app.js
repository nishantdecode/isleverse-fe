"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";
import { RightDrawer } from "./right-drawer";
import { SocketContext } from "@/context/SocketProvider";
import { motion } from "framer-motion"; // Import motion from framer-motion

export function VideoPlayer({ isSelf = false, small = false }) {
  const { myVideo, userVideo, stream, incomingStream, name, call } =
    useContext(SocketContext);

  const videoRef = isSelf ? myVideo : userVideo;
  const userName = isSelf ? name : call.name;

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = isSelf ? stream : incomingStream;
    }
  }, [videoRef, stream, incomingStream, isSelf]);

  return (
    <div
      className={`relative rounded-lg border-2 border-slate-200 overflow-hidden ${
        small ? "w-1/3 h-1/3" : "w-full h-full"
      }`}
    >
      <video
        className="w-full h-full object-cover"
        playsInline
        autoPlay
        ref={videoRef}
        muted={isSelf}
      />
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
        {userName}
      </div>
    </div>
  );
}

export default function VideoCallApp() {
  const { leaveCall, stream } = useContext(SocketContext);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  const handleToggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  const handleToggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioOn;
      });
      setIsAudioOn(!isAudioOn);
    }
  };

  const handleEndCall = () => {
    leaveCall();
  };

  return (
    <motion.div
      className="relative w-full h-screen bg-inherit overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0">
        <VideoPlayer />
      </div>

      <div className="absolute flex justify-end top-4 sm:top-auto sm:bottom-4 right-4">
        <VideoPlayer isSelf small />
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-gray-300 dark:bg-gray-800 bg-opacity-80 p-4 rounded-full">
        <Button
          variant={isVideoOn ? "secondary" : "outline"}
          size="icon"
          onClick={handleToggleVideo}
          aria-label={isVideoOn ? "Turn off video" : "Turn on video"}
        >
          {isVideoOn ? (
            <Video className="h-6 w-6" />
          ) : (
            <VideoOff className="h-6 w-6" />
          )}
        </Button>

        <Button
          variant={isAudioOn ? "secondary" : "outline"}
          size="icon"
          onClick={handleToggleAudio}
          aria-label={isAudioOn ? "Mute audio" : "Unmute audio"}
        >
          {isAudioOn ? (
            <Mic className="h-6 w-6" />
          ) : (
            <MicOff className="h-6 w-6" />
          )}
        </Button>

        <RightDrawer />

        <Button
          variant="destructive"
          size="icon"
          onClick={handleEndCall}
          aria-label="End call"
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>
    </motion.div>
  );
}
