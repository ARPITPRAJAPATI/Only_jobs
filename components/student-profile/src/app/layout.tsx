import type { Metadata, Viewport } from 'next';
import { Providers } from '@/components/Providers';
import { THEME_INIT_SCRIPT } from '@/components/theme';
import './globals.css';

export const metadata: Metadata = {
  title: 'Student Profile · Only Jobs',
  description: 'Verified student profile: academics, projects, coding activity, badges and certifications.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="indigo" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
