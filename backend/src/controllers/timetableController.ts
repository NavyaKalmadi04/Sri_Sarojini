import { Request, Response } from 'express';
import pool from '../config/database';

export const getTimetable = async (req: Request, res: Response): Promise<void> => {
  try {
    const { class: className, teacher_id } = req.query;
    let query = `SELECT t.*, te.name as teacher_name 
                 FROM timetable t 
                 LEFT JOIN teachers te ON t.teacher_id = te.id 
                 WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (className) {
      query += ` AND t.class = $${paramIndex++}`;
      params.push(className);
    }
    if (teacher_id) {
      query += ` AND t.teacher_id = $${paramIndex++}`;
      params.push(teacher_id);
    }

    query += ' ORDER BY t.day, t.time';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Get timetable error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const createTimetableEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { class: className, subject, teacher_id, day, time } = req.body;

    if (!className || !subject || !teacher_id || !day || !time) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }

    const result = await pool.query(
      'INSERT INTO timetable (class, subject, teacher_id, day, time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [className, subject, teacher_id, day, time]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create timetable error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updateTimetableEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { class: className, subject, teacher_id, day, time } = req.body;

    const result = await pool.query(
      'UPDATE timetable SET class = COALESCE($1, class), subject = COALESCE($2, subject), teacher_id = COALESCE($3, teacher_id), day = COALESCE($4, day), time = COALESCE($5, time) WHERE id = $6 RETURNING *',
      [className, subject, teacher_id, day, time, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Timetable entry not found.' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update timetable error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const deleteTimetableEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM timetable WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Timetable entry not found.' });
      return;
    }

    res.json({ message: 'Timetable entry deleted successfully.' });
  } catch (err) {
    console.error('Delete timetable error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
