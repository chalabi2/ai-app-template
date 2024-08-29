import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DeleteChatDialog } from "./DeleteChatDialog";

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
    <div className="w-64 min-w-[16rem] border-r p-4">
      <Button onClick={createChat} className="w-full mb-4">
        New Chat
      </Button>
      <ul>
        {chats.map((chatId, index) => (
          <li key={chatId} className="mb-2 flex items-center">
            <Button
              variant={activeChat === chatId ? "default" : "outline"}
              onClick={() => setActiveChat(chatId)}
              className="flex-1 mr-2"
            >
              Chat #{index + 1}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChatToDelete(chatId)}
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
    </div>
  );
}
