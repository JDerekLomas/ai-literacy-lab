'use client'

import React, { useState } from 'react'
import { useAuth } from './AuthProvider'
import { AuthModal } from './AuthModal'
import { clsx } from 'clsx'

export const Navigation: React.FC = () => {
  const { user, signOut, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (loading) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">AI Literacy Lab</h1>
            <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">AI Agent Design Academy</h1>
              <p className="text-sm text-gray-600">Design AI for Human Flourishing</p>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">
                      {user.user_metadata?.display_name || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={signOut}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}