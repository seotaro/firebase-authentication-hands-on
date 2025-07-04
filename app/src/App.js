import React, { useState } from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              firebase-authentication-hands-on
            </h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <p>firebase-authentication-hands-on</p>
            <p>firebase-authentication-hands-on</p>
            <p>firebase-authentication-hands-on</p>
            <p>firebase-authentication-hands-on</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;