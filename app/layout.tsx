import { RootProvider } from 'fumadocs-ui/provider/next';
import { Poppins } from 'next/font/google';
import { Metadata, Viewport } from 'next/types';

import { RouteValidator } from '@/components/RouteValidator';
import { SITE_DESCRIPTION } from '@/lib/seo';
import './global.css';

const poppins = Poppins({ subsets: ['latin'], weight: '500' });

export const metadata: Metadata = {
  metadataBase: new URL('https://eventum.run'),
  title: {
    default: 'Eventum',
    template: '%s | Eventum',
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: '/logo.svg',
  },
  openGraph: {
    siteName: 'Eventum',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  themeColor: '#8282ef',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider search={{ options: { type: 'static' } }}>
          <RouteValidator>{children}</RouteValidator>
        </RootProvider>
      </body>
    </html>
  );
}
