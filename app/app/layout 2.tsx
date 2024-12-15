import type { Metadata } from 'next';
import '@/app/globals.css';
import { AppSidebar } from '@/components/app-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { NavUser } from '@/components/nav-user';

export const metadata: Metadata = {
  title: 'StudMed',
  description: 'AI web doctor',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      {/* <div
        className={cn(
          'rounded-md  flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden',
          'h-screen' // for your use case, use `h-screen` instead of `h-[60vh]`
        )}
      > */}
      <AppSidebar />
      <SidebarInset className="flex">
        {/* <SidebarTrigger /> */}
        {/* <div className="flex flex-col flex-1"> */}
        <div className="w-[200px] self-end">
          <NavUser
            user={{
              name: 'shadcn',
              email: 'm@example.com',
              avatar: '/avatars/shadcn.jpg',
            }}
          />
        </div>

        {children}
        <Toaster />
      </SidebarInset>
      {/* </div> */}
    </SidebarProvider>
  );
}
