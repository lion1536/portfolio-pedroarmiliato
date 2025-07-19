const form = document.getElementById('contatoForm')
const status = document.getElementById('status')

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const nome = form.nome.value.trim()
  const email = form.email.value.trim()
  const mensagem = form.mensagem.value.trim()

  // Validação extra (opcional)
  if (!nome || !email || !mensagem) {
    status.textContent = 'Por favor, preencha todos os campos.'
    return
  }

  status.textContent = 'Enviando...'
  form.querySelector('button[type="submit"]').disabled = true

  try {
    const response = await fetch(
      'https://portfolio-pedroarmiliato-production.up.railway.app/api/contato',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, mensagem }),
      },
    )

    if (response.ok) {
      status.textContent = 'Mensagem enviada com sucesso!'
      form.reset()
    } else {
      const data = await response.json()
      status.textContent = 'Erro: ' + (data.error || 'Erro ao enviar mensagem')
    }
  } catch (error) {
    status.textContent = 'Erro de conexão, tente novamente.'
    console.error(error)
  } finally {
    form.querySelector('button[type="submit"]').disabled = false
  }
})
