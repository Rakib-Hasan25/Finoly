"use client";

import * as Toast from "@radix-ui/react-toast";
import { useState } from "react";

let showRewardToast: ((text: string) => void) | null = null;

export function triggerRewardToast(text: string) {
  if (showRewardToast) showRewardToast(text);
}

export default function RewardToastProvider() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  showRewardToast = (text: string) => {
    setMessage(text);
    setOpen(true);
  };

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        open={open}
        onOpenChange={setOpen}
        className="bg-gray-800 text-white px-4 py-2 rounded shadow-lg flex items-center space-x-2"
      >
        <Toast.Title className="font-bold">Reward Gained!</Toast.Title>
        <Toast.Description>{message}</Toast.Description>
        <Toast.Close className="ml-auto text-gray-400 hover:text-white">✕</Toast.Close>
      </Toast.Root>

      <Toast.Viewport className="fixed bottom-4 right-4 w-80 z-50" />
    </Toast.Provider>
  );
}
