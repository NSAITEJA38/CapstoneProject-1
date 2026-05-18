import React from 'react'
import { useAuth } from '../stores/authStore'

export default function UserProfile() {

    const currentUser = useAuth(state => state.currentUser)
    const logout = useAuth(state => state.logout)

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-6">

            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md text-center">

                {/* Profile Image */}
                {currentUser?.profileImageUrl && (

                    <img
                        src={currentUser.profileImageUrl}
                        alt="Profile"
                        className="w-28 h-28 rounded-full mx-auto border-4 border-blue-500 object-cover mb-5"
                    />

                )}

                {/* Name */}
                <h1 className="text-3xl font-bold text-gray-800">

                    {currentUser?.firstName} {currentUser?.lastName}

                </h1>

                {/* Email */}
                <p className="text-gray-500 mt-3">

                    {currentUser?.email}

                </p>

                {/* Role */}
                <div className="mt-4">

                    <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
                        {currentUser?.role}
                    </span>

                </div>

                {/* Logout Button */}
                <button
                    onClick={logout}
                    className="mt-8 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl shadow-md transition"
                >
                    Logout
                </button>

            </div>

        </div>
    )
}