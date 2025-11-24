document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("timeForm");
  const btn = document.getElementById("calcBtn");
  const resultDiv = document.getElementById("result");

  btn.addEventListener("click", () => {
    // pega valores
    const instagram = parseFloat(form.instagram.value) || 0;
    const tiktok = parseFloat(form.tiktok.value) || 0;
    const whatsapp = parseFloat(form.whatsapp.value) || 0;
    const other = parseFloat(form.other.value) || 0;

    // total de horas por dia
    const total = instagram + tiktok + whatsapp + other;

    // definir impacto baseado em total
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

    // dicas baseadas no tempo
    let dicas = [];
    dicas.push("Defina limites diários específicos para cada rede.");
    dicas.push("Use temporizadores ou alarmes para monitorar o tempo.");
    dicas.push("Faça pausas regulares: saia do app, ande, respire.");
    dicas.push("Evite usar redes sociais antes de dormir para melhorar sua qualidade de sono.");
    if (total >= 4) {
      dicas.push("Considere desativar notificações ou usar modos de foco/no-distúrbios.");
    }
    if (total >= 6) {
      dicas.push("Avalie reduzir gradualmente o uso ou buscar atividades alternativas (hobbies, exercício, leitura).");
    }

    // montar resultado em HTML
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
