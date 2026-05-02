const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userService = require('../service/userService');
const authenticateToken = require('../middleware/authenticateToken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('FATAL: JWT_SECRET não definido. Crie um arquivo .env com base em .env.example');

router.post('/register', (req, res) => {
  const { username, password, favorecidos } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Usuário e senha obrigatórios' });
  try {
    const user = userService.registerUser({ username, password, favorecidos });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Usuário e senha obrigatórios' });
  try {
    const user = userService.loginUser({ username, password });
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', authenticateToken, (req, res) => {
  res.json(userService.listUsers());
});

module.exports = router;
