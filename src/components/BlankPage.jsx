import React from 'react';
import { LogOut, CheckCircle2 } from 'lucide-react';

export function BlankPage({ currentUser, onLogout, actionType = 'login' }) {
  return (
    <div
      id="blank-page"
      data-testid="blank-page"
      data-status="success"
      data-action={actionType}
      data-user-email={currentUser?.email || ''}
      className="min-h-screen w-full bg-white relative flex flex-col items-center justify-center p-6"
    >
      {/* Invisible machine-readable verification tags for Playwright/Typebot */}
      <div className="sr-only" aria-live="polite">
        <span id="login-status">SUCCESS</span>
        <span id="authenticated-email">{currentUser?.email}</span>
      </div>

      {/* Discrete temporary session status banner */}
      <div className="max-w-md text-center">
        <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4 border border-green-200 shadow-sm">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-medium text-gray-800 mb-1">
          {actionType === 'register' ? 'Registration Successful' : 'Authentication Verified'}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          This is a temporary blank page for candidate session verification.
          {currentUser?.email && (
            <span className="block mt-1 font-mono text-xs text-gray-600">
              Account: {currentUser.email}
            </span>
          )}
        </p>

        {/* Back / Logout button to return to the portal */}
        <button
          type="button"
          id="logout-btn"
          data-testid="logout-btn"
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-gray-500" />
          <span>Return to Portal / Sign Out</span>
        </button>
      </div>
    </div>
  );
}
