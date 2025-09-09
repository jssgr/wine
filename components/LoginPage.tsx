
import React, { useState } from 'react';
import { User, Role } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const WineGlassIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2H6L4 11H20L18 2ZM13 12V22H16V12H13ZM11 12H8V22H11V12Z" />
    </svg>
);


const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleLogin = (role: Role) => {
    if (name.trim()) {
      onLogin({ name: name.trim(), role });
    } else {
        alert('Por favor, introduzca un nombre.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl">
        <div className="text-center">
            <WineGlassIcon className="mx-auto h-16 w-16 text-wine-burgundy" />
          <h1 className="mt-4 text-4xl font-serif font-bold text-wine-burgundy">
            Cata de Vinos J. Diez
          </h1>
          <p className="mt-2 text-stone-600">
            Inicie sesión para registrar su experiencia
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-stone-700">
              Nombre del Catador
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Introduzca su nombre"
              className="mt-1 block w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-wine-burgundy focus:border-wine-burgundy"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleLogin(Role.TASTER)}
              className="flex-1 w-full justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-wine-burgundy hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wine-burgundy transition-transform transform hover:scale-105"
            >
              Iniciar como Catador
            </button>
            <button
              onClick={() => handleLogin(Role.ADMIN)}
              className="flex-1 w-full justify-center py-3 px-4 border border-wine-burgundy rounded-md shadow-sm text-sm font-medium text-wine-burgundy bg-transparent hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wine-burgundy transition-transform transform hover:scale-105"
            >
              Iniciar como Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
