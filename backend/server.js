import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

// Configurar CORS para aceitar requisições apenas do seu frontend
app.use(
  cors({
    origin: ['https://lion1536.github.io'],
  }),
)

app.use(express.json())

// Rota para receber o formulário
app.post('/api/contato', async (req, res) => {
  const { nome, email, mensagem } = req.body

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: 'Preencha todos os campos' })
  }

  // Configurar transporte SMTP (exemplo com Gmail)
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  try {
    await transporter.sendMail({
      from: `"${nome}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: 'Nova mensagem do formulário de contato',
      text: mensagem,
    })

    res.json({ message: 'Mensagem enviada com sucesso!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao enviar mensagem' })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
