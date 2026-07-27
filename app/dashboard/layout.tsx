import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Altus Axis Sales OS',
  description: 'AI-Powered Sales Operating System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
