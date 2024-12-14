'use client';
import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import ChatErrorMessage from '@/app/app/chat/components/chatErroMessage';
import { useHistoryStore } from '@/store/history';
import { getMessages, updateChat } from '../__actions/chat';
import ChatInput from '../components/chat-input';
import ChatContent from '../components/chat-content';
import ChatHeader from '../components/chat-header';
import { useSearchParams } from 'next/navigation';

export default function page({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject');
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    error,
    reload,
    setMessages,
  } = useChat({
    onFinish: (message, { usage, finishReason }) => {
      console.log('Finished streaming message:', message);
      console.log('Token usage:', usage);
      console.log('Finish reason:', finishReason);
      setFinished(true);
    },
    onError: (error) => {
      console.error('An error occurred:', error);
    },
    onResponse: (response) => {
      console.log('Received HTTP response from server:', response);
    },
  });
  // const { subject, setSubject }: any = useSubjectStore();
  const { toast } = useToast();
  const { history, setHistory }: any = useHistoryStore();
  console.log('history', history);

  const [finished, setFinished] = useState(false);

  const storeChat = async () => {
    try {
      await updateChat(params.id, messages);
    } catch (e) {
      console.error(e);
    }

    setFinished(false);
  };

  const fetchMessages = async () => {
    try {
      const messagesData = await getMessages(params.id);
      console.log(messagesData);
      setMessages(JSON.parse(messagesData?.messages));
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = (event) => {
    handleSubmit(event, {
      experimental_attachments: files,
      body: {
        selected_subject: subject,
      },
    });

    setFiles(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    fetchMessages();
    console.log(params.id);
    console.log('aiai', history);
    try {
      const current = history.find(
        (item: { id: string; content: any[] }) => item.id === params.id
      );
      console.log(current);
      setMessages(current.content);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (finished) {
      storeChat();
    }
  }, [finished]);

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (id: string) => {
    setMessages(messages.filter((message) => message.id !== id));
    toast({
      title: 'Message deleted',
    });
  };

  return (
    <div className="px-10">
      {/* ------  Header ------  */}
      <ChatHeader subject={subject as Materia} />

      {/* ------  Main Content ------ */}
      <div className="h-[80vh] w-full flex flex-col space-y-10 overflow-y-scroll">
        <ChatContent
          messages={messages}
          handleDelete={handleDelete}
          isLoading={isLoading}
          reload={reload}
        />

        {error && <ChatErrorMessage reload={reload} />}
      </div>

      {/* ------  Bottom Input (exibido caso tenham mensagens ) ------ */}
      <ChatInput
        variant="bottom"
        messages={messages}
        onSubmit={onSubmit}
        files={files}
        setFiles={setFiles}
        fileInputRef={fileInputRef}
        input={input}
        isLoading={isLoading}
        error={error}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}
