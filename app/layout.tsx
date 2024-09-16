'use client';

import React, { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';
import Navbar from "@/components/navbar";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '@/components/(footer)/footer';



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>FI COLLEGE</title>
        <meta name="description" content={'this is a college website'} />
        {/* You can add more meta tags or link tags here if needed */}
      </head>
      <body>
        <SessionProvider>
          <Suspense fallback={<div>Loading Navbar...</div>}>
            <Navbar />
          </Suspense>
          {children}
          <Footer />
        </SessionProvider>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}

