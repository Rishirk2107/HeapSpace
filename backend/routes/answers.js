const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

// Post an answer
router.post('/:id/answers', auth, async (req, res) => {
  const { body } = req.body;
  const questionId = req.params.id;
  try {
    const result = await pool.query(
      'INSERT INTO answers (body, question_id, user_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [body, questionId, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

module.exports = router;