"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { AuthButtons } from "@/components/AuthButtons";
import { Icons } from "@/components/icons";
import ChatBox from "@/components/ChatBox";
import ChatList from "@/components/ChatList";
import { useChat } from "@/hooks/useChat";
import Image from "next/image";

function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-6">llama3-8b</h1>
      <p className="text-xl mb-8"></p>
      <AuthButtons />
      <div className="absolute bottom-4 right-4 flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-light">Powered by</h1>
        <Image
          src="/akash.svg"
          alt="powered by akash"
          width={200}
          height={200}
          priority
        />
      </div>
    </div>
  );
}

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
        <Icons.spinner className="mr-2 my-auto h-24 w-24 animate-spin" />
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
