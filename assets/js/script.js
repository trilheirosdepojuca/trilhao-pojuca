const telefoneInput = document.getElementById("telefone");

telefoneInput.addEventListener("input", (e) => {

  let value = e.target.value;

  value = value.replace(/\D/g, "");

  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");

  value = value.replace(/(\d{5})(\d)/, "$1-$2");

  value = value.replace(/(-\d{4})\d+?$/, "$1");

  e.target.value = value;

});


const form = document.getElementById("form-inscricao");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const cidade = document.getElementById("cidade").value;
  const moto = document.getElementById("moto").value;
  const observacoes = document.getElementById("observacoes").value;

  try {

    const response = await fetch(
      "https://criarpagamento-c6ftk5nesq-uc.a.run.app",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          nome,
          telefone,
          cidade,
          moto,
          observacoes
        })
      }
    );

    const data = await response.json();

    if (data.url) {

      window.location.href = data.url;

    } else {

      alert("Erro ao gerar pagamento.");

    }

  } catch (error) {

    console.error(error);

    alert("Erro na conexão.");

  }

});