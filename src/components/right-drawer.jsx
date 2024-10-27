"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MessageSquare } from "lucide-react"
import ChatComponent from "./chat-component"

export function RightDrawer() {
  return (
    (<Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon"><MessageSquare /></Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <ChatComponent/>
      </SheetContent>
    </Sheet>)
  );
}