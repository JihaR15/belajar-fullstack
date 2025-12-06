'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
// import { headers } from 'next/headers';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const fetchData = () => {
    fetch('http://localhost:3000/api/products', {
      headers: {
        "ngrok-skip-browser-warning": "true",
    }
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));

    const token = localStorage.getItem('token');
    // const username = localStorage.getItem('username');
    const namaLengkap = localStorage.getItem('nama');
    
    if (token && namaLengkap) {
      setUser({ name: namaLengkap }); 
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    alert('Anda berhasil logout');
    router.refresh();
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin mau hapus produk ini?')) {
      try {
        await fetch(`http://localhost:3000/api/products/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        alert('Gagal menghapus');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto p-6">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📦 Daftar Produk</h1>
          
          {user && (
            <Link href="/add" className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2 shadow-sm">
              <span>+</span> Tambah Baru
            </Link>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2 sm:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Produk</th>
                <th className="px-2 sm:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-2 sm:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Stok (pcs)</th>
                {user && <th className="px-2 sm:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-400">Belum ada data produk.</td>
                </tr>
              ) : (
                products.map((item) => (
                  <tr key={item.ID} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-2 sm:px-6 py-4 font-medium text-gray-900">{item.Nama}</td>
                    <td className="px-2 sm:px-6 py-4 text-green-600 font-semibold">Rp {item.Harga.toLocaleString()}</td>
                    <td className="px-2 sm:px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.Stok > 10 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                        {item.Stok}
                      </span>
                    </td>
                    
                    {user && (
                      <td className="px-2 sm:px-6 py-4 text-right space-x-2">
                        <Link href={`/edit/${item.ID}`} className="text-yellow-600 hover:text-yellow-800 font-medium text-sm">
                          Edit
                        </Link>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => handleDelete(item.ID)} className="text-red-600 hover:text-red-800 font-medium text-sm">
                          Hapus
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!user && (
          <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-center text-sm">
            💡 Info: Anda sedang dalam mode tamu. Silakan login untuk mengelola data.
          </div>
        )}
      </main>
    </div>
  );
}