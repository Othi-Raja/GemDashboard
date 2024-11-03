import React from 'react';
import './error.css'
export default function AuthError() {
  return (
    <div className=" error-bg flex items-center justify-center min-h-screen bg-gray-100" >
      <h1 className="text-2xl font-bold text-red-600 blink">
        Unauthorized Access
      </h1>
    </div>
  );
}
