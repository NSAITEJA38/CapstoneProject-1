import React from 'react'

// FOOTER OF ROOT PAGE
export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 shadow-inner">

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-6">

        {/* Left */}
        <h2 className="text-lg font-semibold tracking-wide">
          BLOG-APP
        </h2>

        {/* Right */}
        <p className="text-sm text-blue-100 mt-2 sm:mt-0">
          © 2026 All Rights Reserved
        </p>

      </div>

    </footer>
  )
}