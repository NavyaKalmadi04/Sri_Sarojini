import { Request, Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAllTeachers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM teachers ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Get teachers error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const getTeacherById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM teachers WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Teacher not found.' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get teacher error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const getTeacherByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const result = await pool.query('SELECT * FROM teachers WHERE user_id = $1', [userId]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Teacher not found.' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get teacher error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const createTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, subject, attendance, user_id } = req.body;

    if (!name || !subject) {
      res.status(400).json({ error: 'Name and subject are required.' });
      return;
    }

    const result = await pool.query(
      'INSERT INTO teachers (name, subject, attendance, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, subject, attendance || 0, user_id || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create teacher error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updateTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, subject, attendance } = req.body;

    const result = await pool.query(
      'UPDATE teachers SET name = COALESCE($1, name), subject = COALESCE($2, subject), attendance = COALESCE($3, attendance) WHERE id = $4 RETURNING *',
      [name, subject, attendance, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Teacher not found.' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update teacher error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const deleteTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM teachers WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Teacher not found.' });
      return;
    }

    res.json({ message: 'Teacher deleted successfully.' });
  } catch (err) {
    console.error('Delete teacher error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
