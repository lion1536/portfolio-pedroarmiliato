const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const apiRoutes = require('./routes/api')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

// Log para conferir se as variáveis de ambiente estão carregando
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'Não definido')
console.log(
  'EMAIL_PASSWORD:',
  process.env.EMAIL_PASSWORD ? '****************' : 'Não definido',
)

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: false,
  }),
)

app.use(express.json())

app.use('/api', apiRoutes)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta http://0.0.0.0:${PORT}`)
})
