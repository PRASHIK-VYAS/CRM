const { Router } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { signToken } = require('../config/jwt');
const { verifyToken } = require('../config/jwt');
const { authenticate, isAdmin } = require('../middleware/auth')

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ id: user.id, email: user.email });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 3600000);
    await user.save();

    console.log(`Reset token for ${email}: ${token}`);

    return res.json({ message: 'If that email exists, a reset link has been sent' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/create_user', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ message: 'Required info is not provided' })
    }
    const existinguser = await User.findOne({
      where: { email }

    });
    if (existinguser) {
      return res.status(400).json({
        message: "email already exists bro!"
      });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedpassword
    })
    return res.status(201).json({
      message: "user created sucessfully"
    });
  } catch (err) {
    return res.status(500).json({
      message: err
    });
  }

}
});
module.exports = router;
