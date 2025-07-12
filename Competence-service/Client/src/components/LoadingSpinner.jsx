import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = "Chargement..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
        <div className="loading-spinner h-16 w-16 mx-auto mb-6"></div>
        <p className="text-lg font-medium text-gray-700">{message}</p>
        <div className="mt-4 flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;