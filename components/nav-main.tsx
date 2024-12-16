'use client';

import { ChevronRight, Loader, Loader2, Trash, type LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import HistoryItem from './history-item';

export function NavMain({
  items,
  loading,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  loading?: boolean;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recentes</SidebarGroupLabel>
      <SidebarMenu className="h-96 overflow-y-scroll">
        <SidebarMenuSub>
          {loading && (
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild>
                <div><Loader2 className='animate-spin'/></div>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          )}
          {!loading && (
            <>
              {items?.map((item) => (
                <SidebarMenuSubItem key={item.id}>
                  <SidebarMenuSubButton asChild>
                    <HistoryItem item={item} />
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </>
          )}
        </SidebarMenuSub>
      </SidebarMenu>
    </SidebarGroup>
  );
}
