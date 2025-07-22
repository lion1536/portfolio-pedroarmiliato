const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
require('dotenv').config()

router.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`)
  next()
})

router.get('/contato', (req, res) => {
  res.json({ message: 'Rota GET /api/contato está funcionando!' })
})

router.post('/contato', async (req, res) => {
  const { nome, email, mensagem } = req.body

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: 'Preencha todos os campos' })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  transporter.verify((error, success) => {
    if (error) {
      console.error('Erro ao verificar conexão SMTP:', error)
    } else {
      console.log('Servidor SMTP está pronto para enviar e-mails')
    }
  })

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: `${nome} <${email}>`,
      subject: 'Nova mensagem do formulário de contato',
      text: `Mensagem de: ${nome} (${email})\n\n${mensagem}`,
    })

    res.json({ message: 'Mensagem enviada com sucesso!' })
  } catch (error) {
    console.error('❌ ERRO AO ENVIAR EMAIL:')
    console.error('Mensagem:', error.message)
    console.error('Nome:', error.name)
    console.error('Código:', error.code)
    console.error('Stack:', error.stack)
    if (error.response) {
      console.error('Resposta SMTP:', error.response)
    }
    res.status(500).json({ error: 'Erro interno ao enviar a mensagem' })
  }
})

module.exports = router
