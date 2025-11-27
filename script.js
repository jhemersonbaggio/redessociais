// =========================
// Cálculo de uso de redes
// =========================
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
    if (total < 2) {
      impacto = "Uso leve. Provavelmente pouco efeito negativo significativo no seu bem-estar.";
    } else if (total < 4) {
      impacto = "Uso moderado. Pode afetar sua produtividade e aumentar ansiedade leve, especialmente se usado à noite.";
    } else if (total < 6) {
      impacto = "Uso alto. Pode haver impacto no sono, na autoestima e na saúde mental, como aumento de ansiedade ou comparação social.";
    } else {
      impacto = "Uso muito alto. Alto risco de efeitos negativos significativos, como dependência, pior qualidade de sono, ansiedade ou isolamento social.";
    }

    let dicas = [];
    dicas.push("Defina limites diários específicos para cada rede.");
    dicas.push("Use temporizadores ou alarmes para monitorar o tempo.");
    dicas.push("Faça pausas regulares: saia do app, ande, respire.");
    dicas.push("Evite usar redes sociais antes de dormir para melhorar sua qualidade de sono.");
    if (total >= 4) dicas.push("Considere desativar notificações ou usar modos de foco/no-distúrbios.");
    if (total >= 6) dicas.push("Avalie reduzir gradualmente o uso ou buscar atividades alternativas (hobbies, exercício, leitura).");

    resultDiv.innerHTML = `
      <p class="result-text"><strong>Total diário estimado: ${total.toFixed(1)} h</strong></p>
      <p class="result-text">${impacto}</p>
      <hr>
      <p class="result-text"><strong>Dicas para equilibrar:</strong></p>
      <ul class="result-text">
        ${dicas.map(d => `<li>${d}</li>`).join("")}
      </ul>
      <hr>
      <p class="result-text"><em>Lembre-se:</em> uso moderado de redes sociais é normal, mas permanecer consciente sobre quanto tempo você passa pode proteger sua saúde mental.</p>
    `;
  });
});

// =========================
// Mini-jogo das redes sociais (melhorado)
// =========================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startGameBtn");

const jogador = { x: 180, y: 450, width: 40, height: 40 };
const icones = [];
let tempoLivre = 0;
let faltaFoco = 0;
let jogoAtivo = false;
let gerarIconeInterval;

// Criar ícone aleatório
function criarIcone() {
  const tipos = [
    { emoji: "📸", cor: "#833ab4" }, // Instagram
    { emoji: "💬", cor: "#25D366" }, // WhatsApp
    { emoji: "🎵", cor: "#69C9D0" }  // TikTok
  ];
  const escolha = tipos[Math.floor(Math.random() * tipos.length)];
  const icone = {
    x: Math.random() * (canvas.width - 30),
    y: 0,
    size: 40,
    emoji: escolha.emoji,
    cor: escolha.cor,
    velocidade: 2 + Math.random() * 3
  };
  icones.push(icone);
}

// Detectar colisão
function colisao(j, i) {
  return j.x < i.x + i.size &&
         j.x + j.width > i.x &&
         j.y < i.y + i.size &&
         j.y + j.height > i.y;
}

// Finalizar jogo
function finalizarJogo() {
  jogoAtivo = false;
  clearInterval(gerarIconeInterval);
  icones.length = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#333";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Fim do Jogo!", canvas.width / 2, canvas.height / 2 - 30);
  ctx.fillText(`Tempo Livre: ${tempoLivre}`, canvas.width / 2, canvas.height / 2);
  ctx.fillText(`Falta de Foco: ${faltaFoco}`, canvas.width / 2, canvas.height / 2 + 30);
}

// Loop do jogo
function atualizar() {
  if (!jogoAtivo) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenhar jogador
  ctx.fillStyle = "blue";
  ctx.fillRect(jogador.x, jogador.y, jogador.width, jogador.height);

  // Atualizar e desenhar ícones
  icones.forEach((i, index) => {
    i.y += i.velocidade;
    ctx.font = `${i.size}px Arial`;
    ctx.fillText(i.emoji, i.x, i.y);

    if (colisao(jogador, i)) {
      faltaFoco += 1;
      icones.splice(index, 1);
    } else if (i.y > canvas.height) {
      tempoLivre += 1;
      icones.splice(index, 1);
    }
  });

  // Mostrar pontuação
  ctx.fillStyle = "green";
  ctx.font = "16px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Tempo Livre: ${tempoLivre}`, 10, 20);
  ctx.fillStyle = "red";
  ctx.fillText(`Falta de Foco: ${faltaFoco}`, 10, 40);

  // Checar condição de término
  if (tempoLivre + faltaFoco >= 24) {
    finalizarJogo();
    return;
  }

  requestAnimationFrame(atualizar);
}

// Controles do jogador
document.addEventListener("keydown", (e) => {
  if (!jogoAtivo) return;
  if (e.key === "ArrowLeft") jogador.x -= 10;
  if (e.key === "ArrowRight") jogador.x += 10;
  jogador.x = Math.max(0, Math.min(canvas.width - jogador.width, jogador.x));
});

// Iniciar jogo
startBtn.addEventListener("click", () => {
  if (jogoAtivo) return;
  jogoAtivo = true;
  tempoLivre = 0;
  faltaFoco = 0;
  icones.length = 0;
  gerarIconeInterval = setInterval(criarIcone, 1000);
  atualizar();
});
