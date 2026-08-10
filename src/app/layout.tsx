import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { getProfileAction } from '@/app/(auth)/_actions/getProfileActions';
import UserInitializer from '@/components/UserInitializer';
import type { User } from '@/lib/types';

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

// Inline script to apply theme before React hydration (prevents FOUC).
// Dark is the default: only an explicit stored 'light' preference opts out.
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
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
  let initialProfile: User | null = null;
  try {
    const result = await getProfileAction();
    initialProfile = result.success ? (result.data as User | null) : null;
  } catch {
    initialProfile = null;
  }

  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`dark ${geistSans.variable} ${geistMono.variable}`}
      style={{ colorScheme: 'dark' }}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        suppressHydrationWarning
        className='min-h-screen flex flex-col antialiased'
      >
        <ThemeProvider>
          <UserInitializer initialProfile={initialProfile} />
          <CartSidebar />
          <Navbar />
          <Toaster richColors closeButton />
          <main className='flex-1 flex flex-col min-h-0'>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
