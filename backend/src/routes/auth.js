const { Router } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { signToken } = require('../config/jwt');
const { verifyToken } = require('../config/jwt');
const { authenticate, isAdmin } = require('../middleware/auth');
const { sendOtpEmail } = require('../utils/email');
const jwt = require('jsonwebtoken')

const router = Router();

router.get('/', (_req, res) => res.json({ message: 'CRM API is running' }));
router.get('/health', (_req, res) => res.json({ status: 'ok' }));

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
      return res.json({ message: 'If that email exists, an reset link has been sent' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await user.save();

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 3600000);
    await user.save();

    await sendOtpEmail(email,otp);

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


});

router.post('/verify-otp', async(req, res)=> {
  try {
    const {email, otp} = req.body;
    if (!email || !otp) {
      return res.status(400).json({message:'email and otp are required'});
        }

    const user = await User.findOne({where: { email }});
    if (!user || !user.otp || !user.otpExpiry){
      return res.status(400).json({message:"invalid or expired OTP"});
    }

    if (user.otp !== otp){
      return res.status(400).json({message:"invalid OTP"});
    }
      if (new Date()> user.otpExpiry) {
        return res.status(400).json({message:'OTP has expired'});
      }

      user.otp = null;
      user.otpExpiry = null;
      await user.save();

      const resetToken = jwt.sign(
        {id:user.id, email:user.email, purpose: 'password-reset'},
        process.env.JWT_SECRET,
        {expiresIn: '15m'}
      );

      return res.json({ token: resetToken });

  }catch (err){
    return res.status(500).json({message: 'server error'});
  }
});

router.post('/reset-password', async (req, res)=>{
  try{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')){
      return res.status(401).json({
        message: 'reset token required'
      });
    }

      const token = authHeader.split(' ')[1];
      let decoded;
      try{
        decoded = jwt .verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(401).json({message: "Invalid token purpose"});
      }
      if (decoded.purpose !== 'password-reset'){
        return res.status(401).json({message: 'Invalid token purpose'});
      }

      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 6){
        return res.status(400).json({message: 'tera chota hai be (password)'});

      }

      const user = await User.findByPk(decoded.id);
      if (!user){
        return res.status(404).json({message:"tera name list mai nahi hai"});
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
      await user.save();
      return res.status(200).json({message: 'password reset successful'});
    
    }catch (err) {
      return res.status(500).json({message:'server error'});
    }
  });


module.exports = router;
