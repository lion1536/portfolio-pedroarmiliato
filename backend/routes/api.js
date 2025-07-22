const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')

function validarEmail(email) {
  const re = /\S+@\S+\.\S+/
  return re.test(email)
}

router.post('/contato', async (req, res) => {
  const { nome, remetente, mensagem, destinatarios } = req.body

  if (!nome || !remetente || !mensagem || !destinatarios) {
    return res
      .status(400)
      .json({ error: 'Preencha todos os campos obrigatórios' })
  }

  if (!validarEmail(remetente)) {
    return res.status(400).json({ error: 'Email do remetente inválido' })
  }

  if (!Array.isArray(destinatarios) || destinatarios.length === 0) {
    return res
      .status(400)
      .json({ error: 'Informe ao menos um destinatário válido' })
  }

  // Validar emails destinatários e remover remetente
  const destinatariosFiltrados = destinatarios
    .filter((email) => validarEmail(email))
    .filter((email) => email.toLowerCase() !== remetente.toLowerCase())

  if (destinatariosFiltrados.length === 0) {
    return res.status(400).json({
      error:
        'A lista de destinatários não pode conter somente o email do remetente',
    })
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
      to: destinatariosFiltrados.join(', '),
      replyTo: remetente,
      subject: 'Nova mensagem do formulário de contato',
      text: `Mensagem de: ${nome} (${remetente})\n\n${mensagem}`,
    })

    res.json({ message: 'Mensagem enviada com sucesso!' })
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    res.status(500).json({ error: 'Erro ao enviar mensagem' })
  }
})

module.exports = router
