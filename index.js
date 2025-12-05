const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();

app.use(cors()); 
app.use(express.json()); 

const config = {
    user: 'admin_toko',
    password: 'password',
    server: 'localhost',     
    database: 'TokoDB',
    port: 1433,
    options: {
        trustServerCertificate: true,
        // instanceName: 'SQLEXPRESS'
    }
};

async function connectDB() {
    try {
        await sql.connect(config);
        console.log('✅ Berhasil konek ke SQL Server!');
    } catch (err) {
        console.error('❌ Gagal konek ke SQL Server:', err.message);
    }
}
connectDB();

app.get('/api/products', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Products`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/api/products', async (req, res) => {
    const { nama, harga, stok } = req.body;
    try {
        await sql.query`INSERT INTO Products (Nama, Harga, Stok) VALUES (${nama}, ${harga}, ${stok})`;
        res.json({ message: 'Produk berhasil ditambahkan' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(3000, () => console.log('🚀 Server jalan di http://localhost:3000'));