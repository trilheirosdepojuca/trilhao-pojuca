// DATA DO EVENTO
const countdown = () => {

  const now = new Date().getTime();

  const distance = eventDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const countdownEl = document.getElementById('countdown');

  if(countdownEl){
    countdownEl.innerHTML = `
      <div class="count-box">
        <span>${days}</span>
        <small>Dias</small>
      </div>

      <div class="count-box">
        <span>${hours}</span>
        <small>Horas</small>
      </div>

      <div class="count-box">
        <span>${minutes}</span>
        <small>Min</small>
      </div>

      <div class="count-box">
        <span>${seconds}</span>
        <small>Seg</small>
      </div>
    `;
  }

};

setInterval(countdown, 1000);

countdown();


// LISTA EXEMPLO DE INSCRITOS
const inscritos = [
  'Alex Lorenzetti',
  'Halisson Hevelon',
  'Júnior Trilheiro',
  'Nego Lama',
  'Biriu',
  'Ojuara'
];

const lista = document.getElementById('lista-inscritos');

if(lista){
  inscritos.forEach(nome => {
    const li = document.createElement('li');
    li.innerText = nome;
    lista.appendChild(li);
  });
}

console.log('Trilhão de Pojuca carregado com sucesso!');