import { RootProvider } from 'fumadocs-ui/provider/next';
import { Poppins } from 'next/font/google';
import { Metadata } from 'next/types';

import './global.css';

const poppins = Poppins({ subsets: ['latin'], weight: '500' });

export const metadata: Metadata = {
  title: 'Eventum',
  icons: {
    icon: '/logo.svg',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider search={{ options: { type: 'static' } }}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
