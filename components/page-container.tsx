import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = false,
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="h-[calc(100dvh-52px)]">
          <div className="mx-auto flex h-full max-w-lg p-4">{children}</div>
        </ScrollArea> 
      ) : (
        <div className="h-full grid grid-rows-10 md:px-8">
          {children}
        </div>
      )}
    </>
  );
}
