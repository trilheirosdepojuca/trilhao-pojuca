const eventDate = new Date('2026-09-06T09:00:00').getTime();

function updateCountdown(){

    const now = new Date().getTime();

    const distance = eventDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const countdown = document.getElementById('countdown');

    countdown.innerHTML = `
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

setInterval(updateCountdown,1000);

updateCountdown();