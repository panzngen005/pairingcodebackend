import fs from 'fs';
import path from 'path';

const logPath = path.resolve('chat-logs.json');

export default function handler(req, res) {
  const { phoneNumber } = req.query;
  if (!fs.existsSync(logPath)) return res.status(200).json({ chats: [] });

  const logs = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
  return res.status(200).json({ chats: logs[phoneNumber] || [] });
}
