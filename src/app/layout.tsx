import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Footer from '@/components/footer';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CartProvider } from '@/contexts/CartContext';
import { getProfileAction } from '@/app/(auth)/_actions/getProfileActions';

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

// Inline script to apply theme before React hydration (prevents FOUC)
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch(e) {}
  })();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch profile server-side to avoid auth flash on client
  const initialProfile = await getProfileAction();

  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        suppressHydrationWarning
        className='min-h-screen flex flex-col antialiased'
      >
        <ThemeProvider>
          <CartProvider>
            <Navbar initialProfile={initialProfile} />
            <Toaster richColors closeButton />
            <main className='flex-1 flex flex-col min-h-0'>{children}</main>
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
