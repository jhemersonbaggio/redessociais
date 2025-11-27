// =======================================================
// CÁLCULO DO USO DE REDES
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("timeForm");
  const btn = document.getElementById("calcBtn");
  const resultDiv = document.getElementById("result");

  btn.addEventListener("click", () => {
    const instagram = parseFloat(form.instagram.value) || 0;
    const tiktok = parseFloat(form.tiktok.value) || 0;
    const whatsapp = parseFloat(form.whatsapp.value) || 0;
    const other = parseFloat(form.other.value) || 0;

    const total = instagram + tiktok + whatsapp + other;

    let impacto = "";
    if (total < 2) impacto = "Uso leve!";
    else if (total < 4) impacto = "Uso moderado! Cuidado.";
    else if (total < 6) impacto = "Uso alto. Afeta sono e foco.";
    else impacto = "Uso MUITO alto! Considere reduzir.";

    resultDiv.innerHTML = `
      <p><strong>Total diário: ${total.toFixed(1)}h</strong></p>
      <p>${impacto}</p>
    `;
  });
});


// =======================================================
// JOGO - CORRIDA CONTRA AS REDES
// =======================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function ajustarCanvas() {
  if (window.innerWidth < 500) {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = canvas.width * 1.4;
  } else {
    canvas.width = 400;
    canvas.height = 560;
  }
}
ajustarCanvas();
window.addEventListener("resize", ajustarCanvas);

// Jogador
const carro = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 80,
  width: 40,
  height: 40,
  emoji: "🚗"
};

// Obstáculos
const obstaculos = [];
let tempoUtil = 0;
let tempoPerdido = 0;
let jogoAtivo = false;
let spawnInterval = null;
let velocidadeBase = 4;

// Criar obstáculo
function criarObstaculo() {
  const tipos = ["📸", "🎵", "💬", "🤳", "❤️", "⭐"];
  obstaculos.push({
    x: Math.random() * (canvas.width - 40),
    y: -40,
    size: 40,
    emoji: tipos[Math.floor(Math.random() * tipos.length)],
    velocidade: velocidadeBase + Math.random() * 3
  });
  velocidadeBase += 0.05; // deixa o jogo mais difícil com o tempo
}

// Colisão
function colidiu(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.width > b.x &&
    a.y < b.y + b.size &&
    a.y + a.height > b.y
  );
}

// Final do jogo
function finalizar() {
  jogoAtivo = false;
  clearInterval(spawnInterval);
  obstaculos.length = 0;

  ctx.fillStyle = "#333";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Fim da Corrida!", canvas.width/2, canvas.height/2 - 40);
  ctx.fillText(`Tempo útil: ${tempoUtil}`, canvas.width/2, canvas.height/2);
  ctx.fillText(`Tempo perdido: ${tempoPerdido}`, canvas.width/2, canvas.height/2 + 40);
}

// Loop do jogo
function atualizar() {
  if (!jogoAtivo) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Carro
  ctx.font = "40px Arial";
  ctx.fillText(carro.emoji, carro.x, carro.y + 40);

  // Obstáculos
  obstaculos.forEach((o, i) => {
    o.y += o.velocidade;
    ctx.font = `${o.size}px Arial`;
    ctx.fillText(o.emoji, o.x, o.y);

    if (colidiu(carro, o)) {
      tempoPerdido++;
      obstaculos.splice(i, 1);
    } else if (o.y > canvas.height) {
      tempoUtil++;
      obstaculos.splice(i, 1);
    }
  });

  // HUD
  ctx.font = "18px Arial";
  ctx.fillStyle = "green";
  ctx.fillText(`Tempo útil: ${tempoUtil}`, 10, 25);
  ctx.fillStyle = "red";
  ctx.fillText(`Tempo perdido: ${tempoPerdido}`, 10, 45);

  if (tempoUtil + tempoPerdido >= 24) {
    finalizar();
    return;
  }

  requestAnimationFrame(atualizar);
}

// Controles - computador
document.addEventListener("keydown", (e) => {
  if (!jogoAtivo) return;
  if (e.key === "ArrowLeft") carro.x -= 20;
  if (e.key === "ArrowRight") carro.x += 20;
  carro.x = Math.max(0, Math.min(canvas.width - carro.width, carro.x));
});

// Controles - celular
let toqueInicial = null;

canvas.addEventListener("touchstart", (e) => {
  toqueInicial = e.touches[0].clientX;
});

canvas.addEventListener("touchmove", (e) => {
  const toqueAtual = e.touches[0].clientX;
  const delta = toqueAtual - toqueInicial;
  carro.x += delta * 0.5;
  carro.x = Math.max(0, Math.min(canvas.width - carro.width, carro.x));
  toqueInicial = toqueAtual;
});

// Iniciar jogo
document.getElementById("startGameBtn").addEventListener("click", () => {
  if (jogoAtivo) return;

  tempoUtil = 0;
  tempoPerdido = 0;
  velocidadeBase = 4;
  carro.x = canvas.width/2 - carro.width/2;
  obstaculos.length = 0;

  jogoAtivo = true;
  spawnInterval = setInterval(criarObstaculo, 800);
  atualizar();
});
