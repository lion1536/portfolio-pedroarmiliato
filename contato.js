const form = document.getElementById('contatoForm')
const view = document.getElementById('status')
const textarea = form.mensagem

function validarEmail(email) {
  const re = /\S+@\S+\.\S+/
  return re.test(email)
}

textarea.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }
})

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const nome = form.nome.value.trim()
  const remetente = form.remetente.value.trim()
  const mensagem = form.mensagem.value.trim()
  const destinatariosRaw = form.destinatarios.value.trim()

  if (!nome || !remetente || !mensagem) {
    view.textContent = 'Por favor, preencha todos os campos obrigatórios.'
    return
  }

  if (!validarEmail(remetente)) {
    view.textContent = 'Por favor, informe um email de remetente válido.'
    return
  }

  let destinatarios = []
  if (destinatariosRaw) {
    destinatarios = destinatariosRaw
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email.length > 0)

    for (const email of destinatarios) {
      if (!validarEmail(email)) {
        view.textContent = `Email inválido na lista de destinatários: ${email}`
        return
      }
    }

    // Remover o remetente da lista para não enviar para si mesmo
    destinatarios = destinatarios.filter(
      (email) => email.toLowerCase() !== remetente.toLowerCase(),
    )

    if (destinatarios.length === 0) {
      view.textContent =
        'A lista de destinatários não pode conter somente seu próprio email.'
      return
    }
  } else {
    view.textContent = 'Por favor, informe ao menos um destinatário.'
    return
  }

  view.textContent = 'Enviando...'
  form.querySelector('button[type="submit"]').disabled = true

  try {
    const response = await fetch(
      'https://portfolio-pedroarmiliato-production.up.railway.app/api/contato',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, remetente, mensagem, destinatarios }),
      },
    )

    if (response.ok) {
      view.textContent = 'Mensagem enviada com sucesso!'
      form.reset()
      form.nome.focus()
    } else {
      const data = await response.json()
      view.textContent = 'Erro: ' + (data.error || 'Erro ao enviar mensagem')
    }
  } catch (error) {
    view.textContent = 'Erro de conexão, tente novamente.'
    console.error(error)
  } finally {
    form.querySelector('button[type="submit"]').disabled = false
  }
})
