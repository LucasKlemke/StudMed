'use client';
import { File, Trash } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import ImageContainer from './image-container';

const UserMessage = ({
  message,
  isLoading,
  handleDelete,
}: {
  message: any;
  isLoading: boolean;
  handleDelete: (id: string) => void;
}) => {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <div
        className="flex self-end gap-x-1 "
        onMouseLeave={() => setShowEdit(false)}
        onMouseEnter={() => setShowEdit(true)}
      >
        {showEdit && !isLoading && (
          <Trash
            size={20}
            className="h-full hover:scale-105"
            onClick={() => handleDelete(message.id)}
          />
        )}
        <div className="self-end flex-col bg-green-700 px-3 py-3 rounded-2xl">
          <h1 className="text-end p-0 m-0  text-white ">{message.content}</h1>
        </div>
      </div>

      {message.experimental_attachments && (
        <div className="self-end flex-col bg-green-700 px-3 py-3 rounded-2xl mt-2">
          <div className="grid grid-cols-1">
            <div>
              <ImageContainer
                total={
                  message.experimental_attachments?.filter((attachment: any) =>
                    attachment.contentType.startsWith('image/')
                  ).length
                }
                images={message.experimental_attachments?.filter(
                  (attachment: any) =>
                    attachment.contentType.startsWith('image/')
                )}
              />
            </div>

            {message.experimental_attachments
              ?.filter((attachment: any) =>
                attachment.contentType?.startsWith('application/pdf')
              )
              .map((attachment: any, index: Number) => (
                <div
                  className="flex-col items-center justify-center"
                  key={`${message.id}-${index}`}
                >
                  <File />
                  {attachment.name}
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default UserMessage;
