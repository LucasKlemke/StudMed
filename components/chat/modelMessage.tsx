'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { RefreshCcw, Trash } from 'lucide-react';
import { Montserrat } from 'next/font/google';
import Markdown from 'react-markdown';
const montserrat = Montserrat({ subsets: ['latin'] });


const formatMarkdown = (text: string): React.ReactNode => {
  if (!text) return '';

  const parseMarkdown = (input: string) => {
    const patterns = [
      { regex: /\*\*(.+?)\*\*/g, tag: 'strong' }, // Bold (**text**)
      { regex: /\*(.+?)\*/g, tag: 'em' }, // Italic (*text*)
      { regex: /\[(.+?)\]\((.+?)\)/g, tag: 'a' }, // Links [text](url)
    ];

    let elements: React.ReactNode[] = [input];
    patterns.forEach(({ regex, tag }) => {
      elements = elements.flatMap((fragment) => {
        if (typeof fragment === 'string') {
          const parts = fragment.split(regex);
          const matches = fragment.match(regex);

          if (!matches) return fragment;

          return parts.reduce<React.ReactNode[]>((acc, part, index) => {
            if (index < matches.length) {
              const match = matches[index];
              const [, content, url] = regex.exec(match) || [];
              if (tag === 'a') {
                acc.push(
                  part,
                  <a key={index} href={url}>
                    {content}
                  </a>
                );
              } else {
                acc.push(
                  part,
                  React.createElement(tag, { key: index }, content)
                );
              }
            } else {
              acc.push(part);
            }
            return acc;
          }, []);
        }
        return fragment;
      });
    });

    return elements;
  };

  const formatted = parseMarkdown(text);
  return formatted.reduce((prev, curr) => [prev, ' ', curr]);
};

const ModelMessage = ({
  message,
  handleDelete,
  reload,
  isLoading,
}: {
  message: any;
  handleDelete: (id: string) => void;
  reload: () => void;
  isLoading: Boolean;
}) => {
  return (
    <div className="self-start flex gap-x-2 w-2/3">
      <div>
        <pre className={`${montserrat.className} whitespace-pre-line`}>
          <Markdown>
            {message.content}
          </Markdown>
          {/* {formatMarkdown(message.content)} */}
        </pre>
        <div className="w-full flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleDelete(message.id)}
          >
            <Trash />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={reload}
            disabled={isLoading}
          >
            <RefreshCcw />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModelMessage;
