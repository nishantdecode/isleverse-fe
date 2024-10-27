"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardCopy, Phone, PhoneCall, PhoneOff } from "lucide-react";
import showToast from "@/util/showToast";
import { UserContext } from "@/context/UserProvider";
import { SocketContext } from "@/context/SocketProvider";
import { useToast } from "@/hooks/use-toast";

export default function CallComponent() {
  const { toast } = useToast();

  const { user } = useContext(UserContext);
  const { me, call, callAccepted, callUser, answerCall } =
    useContext(SocketContext);

  const [targetId, setTargetId] = useState("");

  const copyId = () => {
    if (me) {
      navigator.clipboard.writeText(me).then(() => {
        showToast("ID Copied", "Your ID has been copied to the clipboard.");
      });
    }
  };

  const initiateCall = () => {
    if (!targetId.trim()) {
      showToast("Error", "Please enter a valid user ID to call.");
      return;
    }

    if (targetId === me) {
      showToast("Error", "You cannot call yourself.");
      return;
    }

    callUser(targetId);
    showToast("Calling", `Initiating call to ${targetId}...`);
  };

  useEffect(() => {
    if (call?.isReceivingCall && !callAccepted) {
      toast({
        title: `Incoming call from ${call?.name?.trim() || "Unknown"}`,
        description: (
          <div className="flex flex-col gap-2">
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                onClick={() => {
                  answerCall();
                }}
              >
                <PhoneCall className="mr-2 h-4 w-4" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  showToast("Call Rejected", "You rejected the incoming call.");
                }}
              >
                <PhoneOff className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          </div>
        ),
      });
    }
  }, [call, callAccepted, answerCall, toast]);

  return (
    <div className="flex flex-col justify-between p-4 space-y-4 mx-auto max-w-md">
      <div className="text-2xl">
        <h1 className="font-semibold">Hey, {user?.name?.split(" ")[0]}</h1>
        <div className="w-full h-[1px] bg-black dark:bg-white my-2" />
        <p className="text-base">Get your Caller ID below OR</p>
        <p className="text-base">Enter one to make a call!</p>
      </div>

      <div className="space-y-5">
        <div className="flex flex-col gap-3">
          <Input
            value={me || ""}
            className="w-full"
            readOnly
            placeholder="Your caller ID"
          />
          <Button onClick={copyId} className="w-full">
            <ClipboardCopy className="mr-2 h-4 w-4" />
            Copy ID
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <Input
            placeholder="Enter user ID to call"
            value={targetId}
            className="w-full"
            onChange={(e) => setTargetId(e.target.value)}
          />
          <Button onClick={initiateCall} className="w-full">
            <Phone className="mr-2 h-4 w-4" />
            Call
          </Button>
        </div>
      </div>
    </div>
  );
}
