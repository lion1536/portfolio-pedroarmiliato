const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')

router.post('/contato', async (req, res) => {
  const { nome, email, mensagem, destinatarios } = req.body

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: 'Preencha todos os campos' })
  }

  let toEmails = process.env.EMAIL_USER
  if (destinatarios) {
    if (Array.isArray(destinatarios)) {
      toEmails = destinatarios.join(', ')
    } else if (typeof destinatarios === 'string') {
      toEmails = destinatarios
    }
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmails,
      subject: 'Nova mensagem do formulário de contato',
      text: `Mensagem de: ${nome} (${email})\n\n${mensagem}`,
    })

    res.json({ message: 'Mensagem enviada com sucesso!' })
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    res.status(500).json({ error: 'Erro ao enviar mensagem' })
  }
})

module.exports = router
