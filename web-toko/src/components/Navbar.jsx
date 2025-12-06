'use client';
import Link from 'next/link';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 font-sans">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Judul */}
          <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800 transition">
            🛍️ Toko Jiha
          </Link>

          {/* Menu Kanan */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="text-right mr-2 hidden sm:block">
                  <p className="text-xs text-gray-500">Selamat Datang,</p>
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                </div>
                <button 
                  onClick={onLogout} 
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}