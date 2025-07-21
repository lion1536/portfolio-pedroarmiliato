const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

router.get("/contato", (req, res) => {
  res.json({ message: "Rota GET /api/contato está funcionando!" });
});

router.post("/contato", async (req, res) => {
  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.PASSWORD_USER,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error("Erro ao verificar conexão SMTP:", error);
    } else {
      console.log("Servidor SMTP está pronto para enviar e-mails");
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: `${nome} <${email}>`,
      subject: "Nova mensagem do formulário de contato",
      text: `Mensagem de: ${nome} (${email})\n\n${mensagem}`,
    });

    res.json({ message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.status(500).json({ error: "Erro ao enviar mensagem" });
  }
});

module.exports = router;
