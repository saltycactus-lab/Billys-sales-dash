import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'The Quest · Sales Dashboard',
  description: 'Weekly sales dashboard powered by HubSpot',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden">
        {/* Ambient orbs */}
        <div className="orb w-96 h-96 top-[-100px] left-[-100px]"
          style={{ background: 'radial-gradient(circle, rgba(45,106,79,0.25) 0%, transparent 70%)' }} />
        <div className="orb w-80 h-80 bottom-[-80px] right-[200px]"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)' }} />
        <div className="orb w-64 h-64 top-[40%] right-[10%]"
          style={{ background: 'radial-gradient(circle, rgba(155,127,232,0.08) 0%, transparent 70%)' }} />

        <Sidebar />
        <main className="relative flex-1 overflow-y-auto p-7 z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
