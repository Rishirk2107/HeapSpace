const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

// Post an answer
router.post('/:id/answers', auth, async (req, res) => {
  const { body } = req.body;
  const questionId = req.params.id;

  // Validate input
  if (!body || body.trim().length === 0) {
    return res.status(400).json({ error: 'Answer body is required' });
  }

  try {
    // Check if question exists
    const questionCheck = await pool.query('SELECT id FROM questions WHERE id = $1', [questionId]);
    if (questionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const result = await pool.query(
      'INSERT INTO answers (body, question_id, user_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [body, questionId, req.user.id]
    );

    // Get the answer with user information
    const answerWithUser = await pool.query(
      'SELECT a.*, u.name AS user_name FROM answers a JOIN users u ON a.user_id = u.id WHERE a.id = $1',
      [result.rows[0].id]
    );

    res.status(201).json(answerWithUser.rows[0]);
  } catch (error) {
    console.error('Error posting answer:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get answers for a question
router.get('/:id/answers', async (req, res) => {
  const questionId = req.params.id;
  try {
    // Check if question exists
    const questionCheck = await pool.query('SELECT id FROM questions WHERE id = $1', [questionId]);
    if (questionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const result = await pool.query(
      `SELECT 
        a.*, 
        u.name AS user_name
      FROM answers a 
      JOIN users u ON a.user_id = u.id 
      WHERE a.question_id = $1 
      ORDER BY a.created_at ASC`,
      [questionId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;