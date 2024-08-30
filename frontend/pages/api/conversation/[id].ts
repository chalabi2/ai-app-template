import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const response = await axios.get(`http://igi5762pidb0f2m297425pvpjo.ingress.cato.akash.pub/conversation/${id}`);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving conversation' });
    }
  } else if (req.method === 'POST') {
    try {
      const response = await axios.post(`http://igi5762pidb0f2m297425pvpjo.ingress.cato.akash.pub/clear_conversation/${id}`);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Error clearing conversation' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}