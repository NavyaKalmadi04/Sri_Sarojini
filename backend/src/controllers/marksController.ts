import { Request, Response } from 'express';
import pool from '../config/database';

export const getMarks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { student_id, exam_type, subject } = req.query;
    let query = 'SELECT m.*, s.name as student_name, s.class, s.section FROM marks m JOIN students s ON m.student_id = s.id WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (student_id) {
      query += ` AND m.student_id = $${paramIndex++}`;
      params.push(student_id);
    }
    if (exam_type) {
      query += ` AND m.exam_type = $${paramIndex++}`;
      params.push(exam_type);
    }
    if (subject) {
      query += ` AND m.subject = $${paramIndex++}`;
      params.push(subject);
    }

    query += ' ORDER BY s.name, m.subject';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Get marks error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const createMark = async (req: Request, res: Response): Promise<void> => {
  try {
    const { student_id, subject, exam_type, marks } = req.body;

    if (!student_id || !subject || !exam_type || marks === undefined) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }

    // Check if mark already exists for this student/subject/exam combo
    const existing = await pool.query(
      'SELECT id FROM marks WHERE student_id = $1 AND subject = $2 AND exam_type = $3',
      [student_id, subject, exam_type]
    );

    let result;
    if (existing.rows.length > 0) {
      result = await pool.query(
        'UPDATE marks SET marks = $1 WHERE student_id = $2 AND subject = $3 AND exam_type = $4 RETURNING *',
        [marks, student_id, subject, exam_type]
      );
    } else {
      result = await pool.query(
        'INSERT INTO marks (student_id, subject, exam_type, marks) VALUES ($1, $2, $3, $4) RETURNING *',
        [student_id, subject, exam_type, marks]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create mark error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updateMark = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { marks } = req.body;

    const result = await pool.query(
      'UPDATE marks SET marks = $1 WHERE id = $2 RETURNING *',
      [marks, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Mark not found.' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update mark error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const deleteMark = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM marks WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Mark not found.' });
      return;
    }

    res.json({ message: 'Mark deleted successfully.' });
  } catch (err) {
    console.error('Delete mark error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
