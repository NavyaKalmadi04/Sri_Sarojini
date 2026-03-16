import { Request, Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAllStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { class: className, section } = req.query;
    let query = 'SELECT * FROM students ORDER BY class, section, roll_no';
    const params: any[] = [];

    if (className) {
      query = 'SELECT * FROM students WHERE class = $1 ORDER BY section, roll_no';
      params.push(className);
      if (section) {
        query = 'SELECT * FROM students WHERE class = $1 AND section = $2 ORDER BY roll_no';
        params.push(section);
      }
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Get students error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found.' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get student error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const getStudentByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const result = await pool.query('SELECT * FROM students WHERE user_id = $1', [userId]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found.' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get student error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const createStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, class: className, section, roll_no, attendance, fees, user_id } = req.body;

    if (!name || !className || !section || !roll_no) {
      res.status(400).json({ error: 'Name, class, section, and roll_no are required.' });
      return;
    }

    const result = await pool.query(
      'INSERT INTO students (name, class, section, roll_no, attendance, fees, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, className, section, roll_no, attendance || 0, fees || 0, user_id || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create student error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, class: className, section, roll_no, attendance, fees } = req.body;

    const result = await pool.query(
      'UPDATE students SET name = COALESCE($1, name), class = COALESCE($2, class), section = COALESCE($3, section), roll_no = COALESCE($4, roll_no), attendance = COALESCE($5, attendance), fees = COALESCE($6, fees) WHERE id = $7 RETURNING *',
      [name, className, section, roll_no, attendance, fees, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found.' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update student error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found.' });
      return;
    }

    res.json({ message: 'Student deleted successfully.' });
  } catch (err) {
    console.error('Delete student error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
