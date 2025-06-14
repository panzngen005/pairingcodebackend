const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_PAIRING = path.join(__dirname, 'pairing-codes.json');
const DATA_CHAT = path.join(__dirname, 'chat-logs.json');

app.use(cors());
app.use(express.json());

// 🔐 Generate pairing code
app.post('/api/generate', (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber || !/^\d{8,15}$/.test(phoneNumber)) {
    return res.status(400).json({ success: false, message: 'Nomor tidak valid' });
  }
  
  const code = crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
  let data = fs.existsSync(DATA_PAIRING) ? JSON.parse(fs.readFileSync(DATA_PAIRING)) : {};
  
  data[phoneNumber] = {
    code,
    timestamp: Date.now()
  };
  
  fs.writeFileSync(DATA_PAIRING, JSON.stringify(data, null, 2));
  res.json({ success: true, code });
});

// 📥 Simpan riwayat chat (endpoint untuk WA bot)
app.post('/api/chat', (req, res) => {
  const { phoneNumber, message } = req.body;
  if (!phoneNumber || !message) return res.status(400).json({ success: false });
  
  let logs = fs.existsSync(DATA_CHAT) ? JSON.parse(fs.readFileSync(DATA_CHAT)) : {};
  if (!logs[phoneNumber]) logs[phoneNumber] = [];
  
  logs[phoneNumber].push({
    message,
    timestamp: Date.now()
  });
  
  fs.writeFileSync(DATA_CHAT, JSON.stringify(logs, null, 2));
  res.json({ success: true });
});

// 📄 Ambil riwayat chat per nomor
app.get('/api/logs/:phoneNumber', (req, res) => {
  const { phoneNumber } = req.params;
  let logs = fs.existsSync(DATA_CHAT) ? JSON.parse(fs.readFileSync(DATA_CHAT)) : {};
  res.json({ chats: logs[phoneNumber] || [] });
});

app.listen(PORT, () => {
  console.log(`✅ Backend berjalan di http://localhost:${PORT}`);
});