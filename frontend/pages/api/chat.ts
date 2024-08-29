import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { conversation_id, message } = req.body;
      const response = await axios.post('http://localhost:6000/chat', {
        conversation_id,
        message,
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Error processing chat request' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}