'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);

  // Fungsi untuk mengambil data (dipisah biar bisa dipanggil ulang)
  const fetchProducts = () => {
    fetch('http://localhost:3000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fungsi Hapus
  const handleDelete = async (id) => {
    if (confirm('Yakin mau hapus produk ini?')) {
      try {
        await fetch(`http://localhost:3000/api/products/${id}`, { method: 'DELETE' });
        fetchProducts(); // Refresh data otomatis setelah hapus
      } catch (error) {
        alert('Gagal menghapus');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold font-sans text-center mb-8 text-blue-600">
          Toko Fullstack Jiha
        </h1>
        <div className="flex justify-center mb-6">
          <Link href="/add" className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition">
            + Tambah Produk
          </Link>
        </div>

        <div className="grid gap-4 font-sans">
          {products.map((item) => (
            <div key={item.ID} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center hover:shadow-lg transition">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{item.Nama}</h2>
                <p className="text-gray-500">Stok: {item.Stok}</p>
              </div>
              <div className="text-green-600 font-bold text-xl">
                <span className='p-4'>Rp {item.Harga.toLocaleString()}</span>
                <button
                  onClick={() => (window.location.href = `/edit/${item.ID}`)}
                  title="Edit"
                  aria-label="Edit produk"
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition text-sm mr-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
                  <span className="sr-only">Hapus</span>
                </button>
                <button
                  onClick={() => handleDelete(item.ID)}
                  title="Hapus"
                  aria-label="Hapus produk"
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-6 0h6" />
                  </svg>
                  <span className="sr-only">Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center text-gray-500 mt-10">Sedang memuat data...</p>
        )}
      </div>
    </div>
  );
}