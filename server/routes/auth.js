const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const authMiddleware = require('../middleware/authMiddleware')
const { isValidEmail, normalizeEmail, safeTrim } = require('../utils/validation')

const FIXED_ADMIN = {
  name: process.env.ADMIN_NAME || 'Symponify Admin',
  email: normalizeEmail(process.env.ADMIN_EMAIL || ''),
  password: process.env.ADMIN_PASSWORD || '',
}

const isFixedAdminConfigured = () => Boolean(FIXED_ADMIN.email && FIXED_ADMIN.password)
const isFixedAdminLogin = (email, password) => isFixedAdminConfigured() && normalizeEmail(email) === FIXED_ADMIN.email && password === FIXED_ADMIN.password

const createToken = (user, isAdminOverride = Boolean(user.isAdmin)) =>
  jwt.sign(
    {
      id: user._id,
      isAdmin: isAdminOverride,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

const serializeUser = (user, isAdminOverride = Boolean(user.isAdmin)) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: isAdminOverride,
})

const ensureJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET is not configured on the server')
    error.status = 500
    throw error
  }
}

const ensureFixedAdminUser = async () => {
  let user = await User.findOne({ email: FIXED_ADMIN.email })

  if (!user) {
    return User.create({
      name: FIXED_ADMIN.name,
      email: FIXED_ADMIN.email,
      password: FIXED_ADMIN.password,
      isAdmin: true,
    })
  }

  const passwordMatches = await bcrypt.compare(FIXED_ADMIN.password, user.password)

  user.name = FIXED_ADMIN.name
  user.isAdmin = true

  if (!passwordMatches) {
    user.password = FIXED_ADMIN.password
  }

  await user.save()
  return user
}

router.post('/register', async (req, res) => {
  try {
    ensureJwtSecret()

    const name = safeTrim(req.body.name)
    const password = String(req.body.password || '')
    const email = normalizeEmail(req.body.email)

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' })
    }

    const user = await User.create({ name, email, password, isAdmin: false })
    const token = createToken(user, false)

    res.status(201).json({
      token,
      user: serializeUser(user, false),
    })
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Registration failed.' })
  }
})

router.post('/login', async (req, res) => {
  try {
    ensureJwtSecret()

    const password = String(req.body.password || '')
    const email = normalizeEmail(req.body.email)
    const isFixedAdminAttempt = isFixedAdminLogin(email, password)

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' })
    }

    const user = isFixedAdminAttempt ? await ensureFixedAdminUser() : await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const matches = await bcrypt.compare(password, user.password)
    if (!matches) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const adminSession = isFixedAdminAttempt
    const token = createToken(user, adminSession)

    res.json({
      token,
      user: serializeUser(user, adminSession),
    })
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Login failed.' })
  }
})

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email isAdmin')
    if (!user) return res.status(404).json({ message: 'User not found.' })

    res.json({ user: serializeUser(user) })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to load the current user.' })
  }
})

router.post('/make-admin', authMiddleware, async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Only admins can change admin access.' })
    }

    const email = normalizeEmail(req.body.email)

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' })
    }

    const user = await User.findOneAndUpdate(
      { email },
      { isAdmin: isFixedAdminConfigured() && email === FIXED_ADMIN.email },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    res.json({
      message: user.isAdmin ? `${user.email} is now admin.` : `${user.email} is not allowed admin access.`,
      user: serializeUser(user, user.isAdmin),
    })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to update admin access.' })
  }
})

router.post('/admin-access', async (req, res) => {
  try {
    ensureJwtSecret()

    const password = String(req.body.password || '')
    const email = normalizeEmail(req.body.email)

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' })
    }

    if (!isFixedAdminConfigured()) {
      return res.status(503).json({ message: 'Admin access is not configured on the server.' })
    }

    if (!isFixedAdminLogin(email, password)) {
      return res.status(403).json({ message: 'Access denied. Admin access is limited to the configured admin credentials.' })
    }

    const user = await ensureFixedAdminUser()
    const token = createToken(user, true)

    res.json({
      token,
      user: serializeUser(user, true),
    })
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Admin login failed.' })
  }
})

module.exports = router
