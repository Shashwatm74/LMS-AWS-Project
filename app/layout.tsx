'use client';

import React, { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';
import Navbar from "@/components/navbar";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>LIBRARY MANAGEMENT</title>
        <meta name="description" content={'this is a library management system'} />
      </head>
      <body>
        <SessionProvider>
          <Suspense fallback={<div>Loading Navbar...</div>}>
            <Navbar />
          </Suspense>
          {children}

        </SessionProvider>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}

