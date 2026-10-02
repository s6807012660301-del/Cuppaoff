import 'dotenv/config'
import express from 'express'
import mysql from 'mysql2/promise'
import nodemailer from 'nodemailer'

const app = express()
const port = Number(process.env.API_PORT || 3001)

app.use(express.json({ limit: '10kb' }))

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
})

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT || 587) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

app.post('/api/waitlist', async (request, response) => {
  const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : ''

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response.status(400).json({ message: 'Please enter a valid email address.' })
  }

  try {
    await pool.execute('INSERT IGNORE INTO waitlist_subscribers (email) VALUES (?)', [email])
  } catch (error) {
    console.error('Waitlist save failed:', error)
    return response.status(503).json({ message: 'We could not save your email. Please try again shortly.' })
  }

  try {
    await mailer.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'We got you, Cuppa movement!',
      text: "We got you! We'll send you more information about your interest. Now we're moving forward together.",
      html: '<p>We got you! We\'ll send you more information about your interest.</p><p>Now we\'re moving forward together.</p>',
    })

    return response.status(201).json({ message: 'You are on the list. Check your inbox for a confirmation.' })
  } catch (error) {
    console.error('Waitlist signup failed:', error)
    return response.status(502).json({
      message: 'Your email may have been saved, but we could not send the confirmation. Please try again shortly.',
    })
  }
})

async function startServer() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS waitlist_subscribers (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(254) NOT NULL UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `)

  app.listen(port, () => console.log(`Waitlist API listening on http://localhost:${port}`))
}

startServer().catch((error) => {
  console.error('Could not start the waitlist API:', error)
  process.exit(1)
})