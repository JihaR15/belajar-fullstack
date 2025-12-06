'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProduct() {
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [stok, setStok] = useState('');
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
            setNama(data.Nama);
            setHarga(data.Harga);
            setStok(data.Stok);
        }
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [params.id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const productData = {
      nama: nama,
      harga: parseInt(harga),
      stok: parseInt(stok)
    };

    try {
      await fetch(`http://localhost:3000/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      alert('Sukses diupdate!');
      router.push('/');
      router.refresh();
    } catch (error) {
      alert('Gagal update');
    }
    setLoading(false);
  };

  if (loading) return <p className="text-center p-10">Mengambil data...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Edit Produk</h1>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
            <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} 
              className="mt-1 block w-full p-2 border border-gray-300 text-gray-800 rounded-md " required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Harga</label>
            <input type="number" value={harga} onChange={(e) => setHarga(e.target.value)} 
              className="mt-1 block w-full p-2 border border-gray-300 text-gray-800 rounded-md " required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stok</label>
            <input type="number" value={stok} onChange={(e) => setStok(e.target.value)} 
              className="mt-1 block w-full p-2 border border-gray-300 text-gray-800 rounded-md " required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-yellow-500 text-white p-3 rounded-md hover:bg-yellow-600 font-bold">
            Update Produk
          </button>
        </form>
      </div>
    </div>
  );
}