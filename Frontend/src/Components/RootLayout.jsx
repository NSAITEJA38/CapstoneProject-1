import React, { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from "react-router";
import { useAuth } from '../stores/authStore.js';

// ROOT LAYOUT 
export default function RootLayout() {
const reload=useAuth(state=>state.reload)
useEffect(() => {
  reload();
}, []);
  return (
    <div>
        <Header/>
          
        <div>
            <Outlet/>
        </div>
        <Footer/>
    </div>
  )
}
