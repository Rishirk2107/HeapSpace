const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

// Post a question
router.post('/', auth, async (req, res) => {
  const { title, body, tags } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO questions (title, body, tags, user_id, created_at) VALUES ($1, $2, $3::text[], $4, NOW()) RETURNING *',
      [title, body, tags, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// Get a single question with details
router.get('/:id', async (req, res) => {
  const questionId = req.params.id;
  try {
    const result = await pool.query(
      'SELECT q.*, u.name AS user_name FROM questions q JOIN users u ON q.user_id = u.id WHERE q.id = $1',
      [questionId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// List questions
router.get('/', async (req, res) => {
  const { search } = req.query;
  try {
    let query = 'SELECT q.*, u.name AS user_name FROM questions q JOIN users u ON q.user_id = u.id';
    let values = [];
    if (search) {
      query += ' WHERE q.title ILIKE $1 OR q.body ILIKE $1 OR $1 = ANY(q.tags)';
      values.push(`%${search}%`);
    }
    query += ' ORDER BY q.created_at DESC';
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;