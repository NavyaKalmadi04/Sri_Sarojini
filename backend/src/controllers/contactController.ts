import { Request, Response } from 'express';
import pool from '../config/database';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required.' });
      return;
    }

    const result = await pool.query(
      'INSERT INTO contact_messages (name, email, phone, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone || '', message]
    );

    res.status(201).json({ message: 'Message sent successfully!', data: result.rows[0] });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const getContactMessages = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Get contacts error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
