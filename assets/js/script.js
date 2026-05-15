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

        mode: "cors",

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

      window.open(data.url, "_blank");

    } else {

      alert("Erro ao gerar pagamento.");

    }

  } catch (error) {

    console.error(error);

    alert("Erro na conexão.");

  }

});

const db = firebase.firestore();

async function carregarInscritos() {

  const lista = document.getElementById("lista-inscritos");

  const total = document.getElementById("total-inscritos");

  const ranking = document.getElementById("ranking-cidades");

  lista.innerHTML = "";

  ranking.innerHTML = "";


  const snapshot = await db
    .collection("inscritos")
    .orderBy("createdAt", "desc")
    .get();


  total.innerHTML =
    `🔥 ${snapshot.size} Trilheiros Confirmados`;


  const cidades = {};


  snapshot.forEach((doc) => {

    const inscrito = doc.data();


    if (!cidades[inscrito.cidade]) {

      cidades[inscrito.cidade] = 0;

    }


    cidades[inscrito.cidade]++;


    lista.innerHTML += `

      <div class="piloto-card">

        <div class="status ${inscrito.status.toLowerCase()}">

          ${inscrito.status}

        </div>

        <div class="piloto-topo">

          <div class="piloto-avatar">
            🏍️
          </div>

          <div class="piloto-info">

            <h3>${inscrito.nome}</h3>

            <span>${inscrito.cidade}</span>

          </div>

        </div>

        <div class="piloto-body">

          <div class="piloto-item">

            🏍️ ${inscrito.moto}

          </div>

        </div>

      </div>

    `;

  });


  Object.entries(cidades)

    .sort((a, b) => b[1] - a[1])

    .forEach(([cidade, quantidade]) => {

      ranking.innerHTML += `

        <div class="ranking-card">

          <h4>${cidade}</h4>

          <span>${quantidade}</span>

          <p>pilotos</p>

        </div>

      `;

    });

}


carregarInscritos();

async function carregarCidades() {

  const lista = document.getElementById("lista-cidades");

  try {

    const response = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
    );

    const cidades = await response.json();

    cidades
      .sort((a, b) =>
        a.nome.localeCompare(b.nome)
      )
      .forEach((cidade) => {

        const option = document.createElement("option");

        option.value = cidade.nome;

        lista.appendChild(option);

      });

  } catch (error) {

    console.error("Erro ao carregar cidades:", error);

  }

}

carregarCidades();