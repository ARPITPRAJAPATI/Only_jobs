import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { THEME_INIT_SCRIPT } from '@/components/theme';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Only Jobs · KIET Campus Placement',
  description: 'The KIET campus platform for verified placements, proof-of-work identity, and skill certifications.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="indigo" suppressHydrationWarning className={nunito.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={nunito.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
