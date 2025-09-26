// src/components/common/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-orangebank-black mb-1">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`
          w-full px-4 py-2 rounded-md border 
          focus:outline-none focus:ring-2 
          focus:ring-orangebank-orange focus:border-orangebank-orange
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;
