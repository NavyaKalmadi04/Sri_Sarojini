import { Request, Response } from 'express';
import pool from '../config/database';

export const getAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, role, date, student_id } = req.query;
    let query = 'SELECT * FROM attendance WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (user_id) {
      query += ` AND user_id = $${paramIndex++}`;
      params.push(user_id);
    }
    if (role) {
      query += ` AND role = $${paramIndex++}`;
      params.push(role);
    }
    if (date) {
      query += ` AND date = $${paramIndex++}`;
      params.push(date);
    }
    if (student_id) {
      // Look up user_id from students table
      const studentResult = await pool.query('SELECT user_id FROM students WHERE id = $1', [student_id]);
      if (studentResult.rows.length > 0 && studentResult.rows[0].user_id) {
        query += ` AND user_id = $${paramIndex++}`;
        params.push(studentResult.rows[0].user_id);
      }
    }

    query += ' ORDER BY date DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Get attendance error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const markAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, role, date, status } = req.body;

    if (!user_id || !role || !date || !status) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }

    // Check if attendance already marked
    const existing = await pool.query(
      'SELECT id FROM attendance WHERE user_id = $1 AND date = $2',
      [user_id, date]
    );

    let result;
    if (existing.rows.length > 0) {
      result = await pool.query(
        'UPDATE attendance SET status = $1 WHERE user_id = $2 AND date = $3 RETURNING *',
        [status, user_id, date]
      );
    } else {
      result = await pool.query(
        'INSERT INTO attendance (user_id, role, date, status) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, role, date, status]
      );
    }

    // Update attendance percentage in respective table
    const totalDays = await pool.query(
      'SELECT COUNT(*) FROM attendance WHERE user_id = $1',
      [user_id]
    );
    const presentDays = await pool.query(
      "SELECT COUNT(*) FROM attendance WHERE user_id = $1 AND status = 'present'",
      [user_id]
    );

    const percentage = totalDays.rows[0].count > 0
      ? Math.round((parseInt(presentDays.rows[0].count) / parseInt(totalDays.rows[0].count)) * 100)
      : 0;

    if (role === 'student') {
      await pool.query('UPDATE students SET attendance = $1 WHERE user_id = $2', [percentage, user_id]);
    } else if (role === 'teacher') {
      await pool.query('UPDATE teachers SET attendance = $1 WHERE user_id = $2', [percentage, user_id]);
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Mark attendance error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const bulkMarkAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { records } = req.body; // Array of { user_id, role, date, status }

    if (!records || !Array.isArray(records) || records.length === 0) {
      res.status(400).json({ error: 'Records array is required.' });
      return;
    }

    const results = [];
    for (const record of records) {
      const { user_id, role, date, status } = record;

      const existing = await pool.query(
        'SELECT id FROM attendance WHERE user_id = $1 AND date = $2',
        [user_id, date]
      );

      let result;
      if (existing.rows.length > 0) {
        result = await pool.query(
          'UPDATE attendance SET status = $1 WHERE user_id = $2 AND date = $3 RETURNING *',
          [status, user_id, date]
        );
      } else {
        result = await pool.query(
          'INSERT INTO attendance (user_id, role, date, status) VALUES ($1, $2, $3, $4) RETURNING *',
          [user_id, role, date, status]
        );
      }

      results.push(result.rows[0]);
    }

    res.status(201).json(results);
  } catch (err) {
    console.error('Bulk attendance error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
