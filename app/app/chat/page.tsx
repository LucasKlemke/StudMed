'use client';
import { GraduationCap } from 'lucide-react';
import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import ChatErrorMessage from './components/chatErroMessage';
import { useHistoryStore } from '@/store/history';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { createChat } from './__actions/chat';
import PageContainer from '@/components/page-container';

import { useSubjectStore } from '@/store/subject';
import ChatInput from './components/chat-input';
import ChatContent from './components/chat-content';
import { ciclo_basico, Materia } from '@/lib/materias';
import ChatHeader from './components/chat-header';

export default function page() {
  const router = useRouter();

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
  const { toast } = useToast();

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [finished, setFinished] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newId, setNewId] = useState(null);
  const supabase = createClient();
  // const { subject, setSubject }: any = useSubjectStore();

  const { history, setHistory, addHistory }: any = useHistoryStore();

  async function getUserId() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) throw new Error('User not found');

    return user?.id;
  }

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
    getUserId();

    const storeChat = async () => {
      const userId = await getUserId();
      console.log('subject', subject);
      const newId = await createChat(userId as string, messages, subject);
      setFinished(false);
      addHistory({
        id: newId,
        title: messages[0].content,
        history_subject: subject,
      });
      router.push(`/app/chat/${newId}?subject=${subject}`);
    };
    if (finished) {
      storeChat();
      setFinished(false);
    }
  }, [finished]);

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
        {/* Caso tenha mensagem, exibe o conteudo*/}
        {messages.length > 0 ? (
          <ChatContent
            messages={messages}
            handleDelete={handleDelete}
            isLoading={isLoading}
            reload={reload}
          />
        ) : (
          // Caso não tenha mensagem, exibe o input
          <ChatInput
            variant="center"
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
        )}

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
