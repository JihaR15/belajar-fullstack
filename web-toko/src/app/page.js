'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        console.log("Data berhasil diambil:", data);
      })
      .catch((err) => console.error("Gagal ambil data:", err));
  }, []);

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
                Rp {item.Harga.toLocaleString()}
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