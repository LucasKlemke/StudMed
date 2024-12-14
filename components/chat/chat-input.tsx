import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileCheck, Send, Square, Upload } from 'lucide-react';
import { TextFade } from '@/components/TextFate';

// variant -> center | bottom
// onSubmit -> function
// loading -> boolean
// error -> any

interface ChatInputProps {
  messages: any;
  variant: 'center' | 'bottom';
  onSubmit: any;
  files: any;
  setFiles: any;
  fileInputRef: any;
  input: any;
  isLoading: any;
  error: any;
  handleInputChange: any;
}

const ChatInput: React.FC<ChatInputProps> = ({
  messages,
  variant,
  onSubmit,
  files,
  setFiles,
  fileInputRef,
  input,
  isLoading,
  error,
  handleInputChange,
}) => {
  return (
    <>
      {variant === 'bottom' && (
        <div>
          <div className="row-span-2 rounded-t-xl justify-center  flex">
            {messages.length > 0 && (
              <form
                onSubmit={onSubmit}
                className="w-1/2 gap-x-2 flex items-center justify-center py-3"
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  {!files ? <Upload /> : <FileCheck />}
                </label>
                {files && <span>({files.length})</span>}

                <Input
                  id="file-upload"
                  className=" hidden"
                  type="file"
                  onChange={(event) => {
                    if (event.target.files) {
                      setFiles(event.target.files);
                    }
                  }}
                  multiple
                  ref={fileInputRef}
                />
                <Input
                  name="prompt"
                  value={input}
                  disabled={isLoading || error != null}
                  autoComplete="off"
                  onChange={handleInputChange}
                />
                {isLoading ? (
                  <Button type="button" size="icon" onClick={() => stop()}>
                    <Square />
                  </Button>
                ) : (
                  <Button disabled={error != null} type="submit" size="icon">
                    <Send />
                  </Button>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {variant === 'center' && (
        <TextFade
          direction="up"
          className="flex flex-col justify-center h-4/6 gap-y-4"
        >
          <h1 className="text-3xl font-normal text-center">
            Como posso ajudar ?
          </h1>
          <div className="flex justify-center">
            <form
              onSubmit={onSubmit}
              className="w-1/2 gap-x-2 flex items-center justify-center"
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                {!files ? <Upload /> : <FileCheck />}
              </label>
              {files && <span>({files.length})</span>}

              <Input
                id="file-upload"
                className=" hidden"
                type="file"
                onChange={(event) => {
                  if (event.target.files) {
                    setFiles(event.target.files);
                  }
                }}
                multiple
                ref={fileInputRef}
              />
              <Input
                name="prompt"
                value={input}
                disabled={isLoading || error != null}
                autoComplete="off"
                onChange={handleInputChange}
              />
              {isLoading ? (
                <Button type="button" size="icon" onClick={() => stop()}>
                  <Square />
                </Button>
              ) : (
                <Button disabled={error != null} type="submit" size="icon">
                  <Send />
                </Button>
              )}
            </form>
          </div>
        </TextFade>
      )}
    </>
  );
};

export default ChatInput;
