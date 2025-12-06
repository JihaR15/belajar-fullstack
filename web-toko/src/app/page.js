'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const fetchData = () => {
    fetch('http://localhost:3000/api/products')
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
    <div className="min-h-screen bg-gray-100 p-10 font-sans">
      <div className="max-w-2xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Toko Fullstack Jiha</h1>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Halo, <b>{user.name}</b> 👋</span>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-bold text-sm">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Login Admin
            </Link>
          )}
        </div>

        {user && (
          <div className="flex justify-center mb-8">
            <Link href="/add" className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 transition shadow-lg">
              + Tambah Produk
            </Link>
          </div>
        )}

        <div className="grid gap-4">
          {products.map((item) => (
            <div key={item.ID} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{item.Nama}</h2>
                <p className="text-gray-500">Stok: {item.Stok}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-green-600 font-bold text-xl">
                  Rp {item.Harga.toLocaleString()}
                </span>

                {user && (
                  <div className="flex gap-2">
                    <Link href={`/edit/${item.ID}`} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(item.ID)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {!user && products.length > 0 && (
          <p className="text-center text-gray-400 text-sm mt-8 italic">
            Login sebagai admin untuk mengelola data.
          </p>
        )}

      </div>
    </div>
  );
}