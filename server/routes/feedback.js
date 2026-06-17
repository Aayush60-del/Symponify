const express = require('express')
const Feedback = require('../models/Feedback')

const router = express.Router()

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, description } = req.body

    if (!name || !email || !description) {
      return res.status(400).json({ message: 'Please provide all required fields (name, email, description)' })
    }

    const feedback = await Feedback.create({
      name,
      email,
      description,
    })

    res.status(201).json({
      success: true,
      data: feedback,
    })
  } catch (error) {
    console.error('Feedback Error:', error.message)
    res.status(500).json({ message: 'Server error processing feedback' })
  }
})

module.exports = router
