"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { Icons } from "@/components/icons";
import ChatBox from "@/components/ChatBox";
import ChatList from "@/components/ChatList";
import { useChat } from "@/hooks/useChat";

import { LandingPage } from "@/components/LandingPage";

export default function Home() {
  const { data: session, status } = useSession();

  const [activeChat, setActiveChat] = useState<string | null>(null);
  const { chats, createChat, deleteChat } = useChat();

  useEffect(() => {
    if (session) {
      const storedActiveChat = localStorage.getItem("activeChat");
      if (storedActiveChat && chats.includes(storedActiveChat)) {
        setActiveChat(storedActiveChat);
      } else if (chats.length > 0) {
        setActiveChat(chats[0]);
      } else {
        const newChatId = createChat();
        setActiveChat(newChatId);
      }
    }
  }, [session, chats, createChat]);

  useEffect(() => {
    if (activeChat) {
      localStorage.setItem("activeChat", activeChat);
    }
  }, [activeChat]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center flex-grow">
        <Icons.spinner className="mr-2 my-auto h-24 w-24 animate-spin text-pink-400" />
      </div>
    );
  }

  if (!session) {
    return <LandingPage />;
  }

  return (
    <div className="flex-grow flex min-w-[90rem]">
      <ChatList
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        createChat={createChat}
        deleteChat={deleteChat}
      />
      {activeChat && <ChatBox chatId={activeChat} />}
    </div>
  );
}
