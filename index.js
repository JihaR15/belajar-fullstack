const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();

const SECRET_KEY = "kuncirahasia";

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

app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        await sql.query`DELETE FROM Products WHERE ID = ${id}`;
        res.json({ message: 'Produk berhasil dihapus' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { nama, harga, stok } = req.body;
    try {
        await sql.query`UPDATE Products SET Nama = ${nama}, Harga = ${harga}, Stok = ${stok} WHERE ID = ${id}`;
        res.json({ message: 'Produk berhasil diupdate' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM Products WHERE ID = ${id}`;
        res.json(result.recordset[0]); 
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route: Register (Daftar Akun Baru)
app.post('/api/auth/register', async (req, res) => {
    const { username, password, nama } = req.body;

    try {
        const checkUser = await sql.query`SELECT * FROM Users WHERE Username = ${username}`;
        if (checkUser.recordset.length > 0) {
            return res.status(400).json({ message: 'Username sudah dipakai!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await sql.query`INSERT INTO Users (Username, Password, NamaLengkap) 
                        VALUES (${username}, ${hashedPassword}, ${nama})`;

        res.json({ message: 'Registrasi berhasil! Silakan login.' });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route: Login (Masuk)
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userResult = await sql.query`SELECT * FROM Users WHERE Username = ${username}`;
        const user = userResult.recordset[0];

        if (!user) {
            return res.status(400).json({ message: 'Username atau Password salah!' });
        }

        const isMatch = await bcrypt.compare(password, user.Password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Username atau Password salah!' });
        }

        const token = jwt.sign(
            { id: user.ID, username: user.Username }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );

        res.json({ 
            message: 'Login berhasil!', 
            token: token,
            username: user.Username,
            nama: user.NamaLengkap
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(3000, () => console.log('🚀 Server jalan di http://localhost:3000'));