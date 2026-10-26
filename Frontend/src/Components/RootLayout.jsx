import React, { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from "react-router";
import { useAuth } from '../stores/authStore.js';

// ROOT LAYOUT 
export default function RootLayout() {
  const reload = useAuth((state) => state.reload);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
