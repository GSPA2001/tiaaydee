const card = document.getElementById("card");
const openButton = document.getElementById("openButton");
const resetButton = document.getElementById("resetButton");

function setOpen(open) {
  card.classList.toggle("is-open", open);
  card.setAttribute("aria-expanded", String(open));

  openButton.textContent = open
    ? "Cerrar tarjeta 💌"
    : "Abrir mi regalo 💌";
}

// Clic directo en la tarjeta para abrir/cerrar
card.addEventListener("click", (e) => {
  // Solo interactúa si la tarjeta está cerrada
  if (!card.classList.contains("is-open")) {
    setOpen(true);
  }
});

openButton.addEventListener("click", (event) => {
  event.stopPropagation();
  setOpen(!card.classList.contains("is-open"));
});

resetButton.addEventListener("click", () => {
  setOpen(false);
  
  // Opcional: Cerrar video al reiniciar
  if (videoWrapper && videoWrapper.style.display === 'block') {
    videoWrapper.style.display = 'none';
    if (youtubePlayer) youtubePlayer.src = '';
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
});

// --- Lógica del reproductor de la canción ---
const songBtn = document.getElementById('songBtn');
const videoWrapper = document.getElementById('videoWrapper');
const youtubePlayer = document.getElementById('youtubePlayer');

if (songBtn && videoWrapper && youtubePlayer) {
  songBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que la tarjeta se abra/cierre al tocar el botón
    
    const isOpen = videoWrapper.style.display === 'block';
    
    if (isOpen) {
      videoWrapper.style.display = 'none';
      youtubePlayer.src = ''; // Detiene el video al cerrar
    } else {
      videoWrapper.style.display = 'block';
      if (!youtubePlayer.getAttribute('src')) {
        youtubePlayer.src = youtubePlayer.getAttribute('data-src');
      }
    }
  });

  videoWrapper.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// Luciérnagas doradas
const canvas = document.getElementById("can");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let lights = [];

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  lights = Array.from(
    {
      length: Math.min(
        45,
        Math.max(18, Math.floor(width / 9))
      )
    },
    () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.7 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2,
      speed: 0.12 + Math.random() * 0.36,
      drift: (Math.random() - 0.5) * 0.35
    })
  );
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  const now = performance.now() / 1000;

  for (const light of lights) {
    light.y -= light.speed;

    light.x +=
      light.drift +
      Math.sin(now + light.phase) * 0.15;

    if (light.y < -5) {
      light.y = height + 5;
      light.x = Math.random() * width;
    }

    if (light.x < -5) {
      light.x = width + 5;
    }

    if (light.x > width + 5) {
      light.x = -5;
    }

    const alpha =
      0.25 +
      (Math.sin(now * 1.7 + light.phase) + 1) * 0.22;

    ctx.beginPath();
    ctx.arc(
      light.x,
      light.y,
      light.radius,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = `rgba(255, 218, 164, ${alpha})`;
    ctx.shadowColor = "rgba(255, 198, 131, .7)";
    ctx.shadowBlur = 9;
    ctx.fill();
  }

  ctx.shadowBlur = 0;
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize, {
  passive: true
});

resize();
animate();