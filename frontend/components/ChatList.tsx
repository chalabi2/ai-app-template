import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DeleteChatDialog } from "./DeleteChatDialog";
import Image from "next/image";
interface ChatListProps {
  chats: string[];
  activeChat: string | null;
  setActiveChat: (chatId: string) => void;
  createChat: () => void;
  deleteChat: (chatId: string) => void;
}

export default function ChatList({
  chats,
  activeChat,
  setActiveChat,
  createChat,
  deleteChat,
}: ChatListProps) {
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  return (
    <div className="w-64 min-w-[16rem]  shadow-[3px_3px_0_0_#8b4b8b] bg-purple-950 p-4">
      <Button
        onClick={createChat}
        className="w-full mb-4 border-2 border-pink-800 shadow-[3px_3px_0_0_#8b4b8b] bg-purple-950 text-gray-300 hover:bg-purple-900 hover:text-gray-200"
      >
        New Chat
      </Button>
      <ul className=" p-2">
        {chats.map((chatId, index) => (
          <li key={chatId} className="mb-2 flex items-center">
            <Button
              variant={activeChat === chatId ? "default" : "outline"}
              onClick={() => setActiveChat(chatId)}
              className={`flex-1 mr-2 border-2 border-pink-800 shadow-[3px_3px_0_0_#8b4b8b] ${
                activeChat === chatId
                  ? "bg-purple-900 text-gray-200"
                  : "bg-purple-950 text-gray-300 hover:bg-purple-900 hover:text-gray-200"
              }`}
            >
              Chat #{index + 1}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChatToDelete(chatId)}
              className="border-2 border-pink-800 shadow-[3px_3px_0_0_#8b4b8b] bg-purple-950 text-gray-300 hover:bg-red-900 hover:text-gray-200"
            >
              Delete
            </Button>
            <DeleteChatDialog
              isOpen={chatToDelete === chatId}
              onClose={() => setChatToDelete(null)}
              onDelete={() => {
                deleteChat(chatId);
                setChatToDelete(null);
              }}
              chatNumber={index + 1}
            />
          </li>
        ))}
      </ul>
      <Image
        src="/friendz.png"
        alt="Best Fwend"
        width={250}
        height={250}
        className="absolute bottom-0 left-0"
      />
    </div>
  );
}
