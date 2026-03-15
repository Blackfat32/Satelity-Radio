const player = document.getElementById('player');
const mainBtn = document.getElementById('mainBtn');
const icon = document.getElementById('icon');
const stationSelect = document.getElementById('stationSelect');
const statusText = document.getElementById('statusText');
const eq = document.getElementById('eq');
const volume = document.getElementById('volume');

let isPlaying = false;

// URL de alta disponibilidad (Radio Paradise - Rock Mix)
// Esta URL es muy estable y permite conexiones desde reproductores web.
const fallbackURL = "https://stream.radioparadise.com/rock-128";

// Configuración inicial
player.src = stationSelect.value;
player.preload = "none"; // Evita que el navegador intente cargar todo antes de dar play

mainBtn.addEventListener('click', () => {
    if (!isPlaying) {
        statusText.innerText = "CARGANDO...";
        
        // Si la URL del selector falla, intenta con la de respaldo
        if(!player.src) player.src = stationSelect.value;

        player.load(); // Refresca la conexión en vivo
        
        // El secreto: esperar un poco a que el navegador registre la carga
        setTimeout(() => {
            player.play()
                .then(() => {
                    isPlaying = true;
                    statusText.innerText = "EN VIVO";
                    icon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
                    eq.classList.add('playing');
                })
                .catch(err => {
                    console.error("Fallo de reproducción:", err);
                    statusText.innerText = "REINTENTANDO...";
                    // Intento de rescate con URL ultra-estable
                    player.src = fallbackURL;
                    player.play();
                });
        }, 100);

    } else {
        player.pause();
        // Para radio en vivo, es mejor "vaciar" el src al pausar para no consumir datos
        player.src = ""; 
        isPlaying = false;
        statusText.innerText = "PAUSADO";
        icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
        eq.classList.remove('playing');
        // Restaurar la URL para el próximo play
        player.src = stationSelect.value;
    }
});

stationSelect.addEventListener('change', () => {
    player.src = stationSelect.value;
    if (isPlaying) {
        statusText.innerText = "CAMBIANDO...";
        player.play();
    }
});

volume.addEventListener('input', (e) => {
    player.volume = e.target.value;
});

// Listener de errores para diagnóstico
player.onerror = () => {
    statusText.innerText = "ERROR DE SEÑAL";
    isPlaying = false;
    eq.classList.remove('playing');
    icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
};