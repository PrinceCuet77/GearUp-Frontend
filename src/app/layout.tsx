import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Footer from '@/components/footer';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from 'next-themes';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GearUp: Rent Sports & Outdoor Gear',
  description:
    'Browse and rent premium sports and outdoor equipment. Find bikes, tents, kayaks, and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className='min-h-screen flex flex-col antialiased'
      >
        <ThemeProvider attribute='class' enableSystem defaultTheme='system'>
          <Navbar />
          <Toaster position='top-right' richColors closeButton />
          <main className='flex-1'>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
