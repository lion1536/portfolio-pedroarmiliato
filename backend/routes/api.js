const express = require("express");
const router = express.Router();

// Endpoint GET
router.get("/api/contato", (req, res) => {
  res.json({ message: "Rota GET /api/contato está funcionando!" });
});

// Endpoint POST
router.post("/api/contato", async (req, res) => {
  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${nome}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: "Nova mensagem do formulário de contato",
      text: mensagem,
    });

    res.json({ message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao enviar mensagem" });
  }
});

module.exports = router;
