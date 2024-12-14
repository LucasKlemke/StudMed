import { Loader2, Trash } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { deleteHistory } from '@/app/app/chat/__actions/chat';
import { useToast } from '@/hooks/use-toast';
import { useHistoryStore } from '@/store/history';
import { ciclo_basico } from '@/lib/materias';

const HistoryItem = ({ item }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const { removeHistory }: any = useHistoryStore();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteHistory(item.id);
      removeHistory(item.id);
      toast({
        title: 'Histórico excluído',
      });
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="flex justify-between w-full pb-1">
          <Link href={`/app/chat/${item.id}?subject=${item.history_subject}`} className="gap-x-3 flex ">
            <span className="truncate text-sm">
              {item.title.slice(0, 10) + '...'}
            </span>
            <span
              className={`text-xs ${
              ciclo_basico.some((subject) => subject.nome === item.history_subject)
                ? ciclo_basico.find((subject) => subject.nome === item.history_subject)?.bg
                : ''
              } rounded-full px-3 py-1 text-white font-semibold`}
            >
              {item.history_subject.slice(0,3)}
            </span>
          </Link>

          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Trash onClick={() => handleDelete()} />
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{item.title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HistoryItem;
