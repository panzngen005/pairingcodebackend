import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const pairingPath = path.resolve('pairing-codes.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const { phoneNumber } = req.body;
  if (!phoneNumber || !/^\d{8,15}$/.test(phoneNumber)) {
    return res.status(400).json({ success: false, message: 'Nomor tidak valid' });
  }

  const code = crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
  let data = {};

  if (fs.existsSync(pairingPath)) {
    data = JSON.parse(fs.readFileSync(pairingPath, 'utf-8'));
  }

  data[phoneNumber] = {
    code,
    timestamp: Date.now()
  };

  fs.writeFileSync(pairingPath, JSON.stringify(data, null, 2));
  return res.status(200).json({ success: true, code });
}
