import fs from 'fs';
import path from 'path';

const logPath = path.resolve('chat-logs.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const { phoneNumber, message } = req.body;
  if (!phoneNumber || !message) return res.status(400).json({ success: false });

  let logs = {};
  if (fs.existsSync(logPath)) {
    logs = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
  }

  if (!logs[phoneNumber]) logs[phoneNumber] = [];

  logs[phoneNumber].push({
    message,
    timestamp: Date.now()
  });

  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
  return res.status(200).json({ success: true });
}
