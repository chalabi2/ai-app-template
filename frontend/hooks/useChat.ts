import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useChat() {
  const [chats, setChats] = useState<string[]>([]);

  useEffect(() => {
    const storedChats = localStorage.getItem('chats');
    if (storedChats) {
      setChats(JSON.parse(storedChats));
    }
  }, []);

  const createChat = useCallback(() => {
    const newChatId = uuidv4();
    setChats((prevChats) => {
      const updatedChats = [...prevChats, newChatId];
      localStorage.setItem('chats', JSON.stringify(updatedChats));
      return updatedChats;
    });
    return newChatId;
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setChats((prevChats) => {
      const updatedChats = prevChats.filter((id) => id !== chatId);
      localStorage.setItem('chats', JSON.stringify(updatedChats));
      return updatedChats;
    });
  }, []);

  return { chats, createChat, deleteChat };
}