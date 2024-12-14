import { Button } from '@/components/ui/button';
import React from 'react';

const ChatErrorMessage = ({ reload }: { reload: () => void }) => {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="text-center">Something went wrong.</div>
      <Button type="button" onClick={() => reload()}>
        Try Again
      </Button>
    </div>
  );
};

export default ChatErrorMessage;
