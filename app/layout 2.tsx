import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { Montserrat } from 'next/font/google';


const montserrat = Montserrat({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        {children}
      
      </body>
    </html>
  );
}
