import React, { useEffect, useRef } from 'react';
import UserMessage from '@/components/chat/userMessage';
import ModelMessage from '@/components/chat/modelMessage';
import { Loader2 } from 'lucide-react';

interface ChatContentProps {
  messages: any;
  handleDelete: any;
  isLoading: any;
  reload: any;
}

const ChatContent: React.FC<ChatContentProps> = ({
  messages,
  handleDelete,
  isLoading,
  reload,
}) => {
   const messagesEndRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {messages.map(
        (
          message: { id: string; role: 'user' | 'assistant'; content: string },
          idx: number
        ) => (
          <div className="flex flex-col" key={message.id}>
            {message.role === 'user' && (
              <UserMessage
                message={message}
                handleDelete={handleDelete}
                isLoading={isLoading}
              />
            )}

            {message.role === 'assistant' && (
              <ModelMessage
                message={message}
                handleDelete={handleDelete}
                reload={reload}
                isLoading={isLoading}
              />
            )}

            {idx === messages.length - 1 && isLoading && (
              <div className="flex justify-start">
                <Loader2 className="animate-spin" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )
      )}
    </>
  );
};

export default ChatContent;
