import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Heartland Paid Media Agent',
  description: 'AI-powered paid media optimization dashboard for Heartland Dental offices',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
