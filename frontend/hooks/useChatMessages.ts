import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Message {
    role: 'user' | 'assistant' | 'loading';
    content: string;
    isMarkdown?: boolean;
  }

export function useChatMessages(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(`/api/conversation/${chatId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [chatId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      setIsLoading(true);
      const isMarkdown = content.includes('```') || content.includes('`') || content.includes('#');
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content, isMarkdown },
        { role: 'loading', content: 'Thinking...' },
      ]);
      try {
        const response = await axios.post('/api/chat', {
          conversation_id: chatId,
          message: content,
        });
        setMessages((prevMessages) => [
          ...prevMessages.filter((msg) => msg.role !== 'loading'),
          { role: 'assistant', content: response.data.response, isMarkdown: true },
        ]);
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.role !== 'loading')
        );
      } finally {
        setIsLoading(false);
      }
    },
    [chatId]
  );

  return { messages, sendMessage, isLoading };
}