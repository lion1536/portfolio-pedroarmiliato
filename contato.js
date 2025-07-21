const form = document.getElementById("contatoForm");
const view = document.getElementById("status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  const mensagem = form.mensagem.value.trim();

  // Validação extra (opcional)
  if (!nome || !email || !mensagem) {
    view.textContent = "Por favor, preencha todos os campos.";
    return;
  }

  view.textContent = "Enviando...";
  form.querySelector('button[type="submit"]').disabled = true;

  try {
    const response = await fetch(
      "https://portfolio-pedroarmiliato-production.up.railway.app/api/contato",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, mensagem }),
      }
    );

    if (response.ok) {
      view.textContent = "Mensagem enviada com sucesso!";
      form.reset();
    } else {
      const data = await response.json();
      view.textContent = "Erro: " + (data.error || "Erro ao enviar mensagem");
    }
  } catch (error) {
    view.textContent = "Erro de conexão, tente novamente.";
    console.error(error);
  } finally {
    form.querySelector('button[type="submit"]').disabled = false;
  }
});
