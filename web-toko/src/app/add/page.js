'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProduct() {
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [stok, setStok] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    setLoading(true);

    const productData = {
      nama: nama,
      harga: parseInt(harga),
      stok: parseInt(stok)
    };

    try {
      const res = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        alert('Sukses! Produk ditambahkan.');
        router.push('/'); // Kembali ke halaman utama
        router.refresh(); // Refresh data biar muncul
      } else {
        alert('Gagal menambahkan produk');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Tambah Produk Baru</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
            <input 
              type="text" 
              required
              className="mt-1 block w-full p-2 border border-gray-300 text-gray-800 rounded-md "
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
            <input 
              type="number" 
              required
              className="mt-1 block w-full p-2 border border-gray-300 text-gray-800 rounded-md"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stok</label>
            <input 
              type="number" 
              required
              className="mt-1 block w-full p-2 border border-gray-300 text-gray-800 rounded-md"
              value={stok}
              onChange={(e) => setStok(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition font-bold disabled:bg-gray-400"
          >
            {loading ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
        </form>
      </div>
    </div>
  );
}