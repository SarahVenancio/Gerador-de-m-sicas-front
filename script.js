const artistaModeloInput = document.getElementById('artista-modelo');
const divPalavras = document.getElementById('palavras');
const btnGerarMusica = document.getElementById('gerar-musica-btn');
const btnLimparCampos = document.getElementById('limpar-btn');
const divResposta = document.getElementById('resposta');
const preLetra = document.getElementById('letra-gerada');

function limparCampos() {
    artistaModeloInput.value = '';
    const inputs = divPalavras.querySelectorAll('.palavra-input');
    inputs.forEach(input => input.value = '');
    divResposta.classList.add('hidden');
    preLetra.textContent = '';
}

async function enviarFormularioGerarMusica() {
    btnGerarMusica.disabled = true;
    btnGerarMusica.textContent = 'Gerando Música...';

    const artista = artistaModeloInput.value.trim();
    const palavras = Array.from(divPalavras.querySelectorAll('.palavra-input'))
        .map(input => input.value.trim())
        .filter(p => p !== '');

    if (!artista) {
        alert("Informe o artista de inspiração.");
        btnGerarMusica.disabled = false;
        btnGerarMusica.textContent = 'Gerar Música';
        return;
    }

    if (palavras.length < 3) {
        alert("Informe pelo menos 3 palavras.");
        btnGerarMusica.disabled = false;
        btnGerarMusica.textContent = 'Gerar Música';
        return;
    }

    try {
        const resposta = await fetch("https://gerador-de-m-sicas-back.vercel.app/mpb", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                artista_modelo: artista,
                palavras: palavras
            })
        });

        const json = await resposta.json();

        if (json.erro || !json.letra) {
            preLetra.textContent = "Erro ao gerar música: " + (json.erro || "resposta inesperada.");
            divResposta.classList.remove('hidden');
        } else {
            preLetra.textContent = json.letra.join("\n");
            divResposta.classList.remove('hidden');
        }

    } catch (e) {
        preLetra.textContent = "Erro ao se comunicar com o servidor: " + e.message;
        divResposta.classList.remove('hidden');
    }

    btnGerarMusica.disabled = false;
    btnGerarMusica.textContent = 'Gerar Música';
}

document.addEventListener("DOMContentLoaded", () => {
    btnGerarMusica.addEventListener("click", enviarFormularioGerarMusica);
    btnLimparCampos.addEventListener("click", limparCampos);
});


// Chatbot
  const abrirChat = document.getElementById("abrir-chat");
  const fecharChat = document.getElementById("fechar-chat");
  const chatBox = document.getElementById("chatbox");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMensagens = document.getElementById("chat-mensagens");

  abrirChat.addEventListener("click", () => {
    chatBox.classList.remove("hidden");
  });

  fecharChat.addEventListener("click", () => {
    chatBox.classList.add("hidden");
  });

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const pergunta = chatInput.value.trim();
    if (!pergunta) return;

    adicionarMensagem("Você", pergunta);
    chatInput.value = "";
    adicionarMensagem("Assistente", "⏳ Pensando...");

    try {
      const resp = await fetch("https://gerador-de-m-sicas-back.vercel.app/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta }),
      });

      const json = await resp.json();
      chatMensagens.lastChild.remove();
      adicionarMensagem("Assistente", json.resposta || "Não foi possível responder.");
    } catch (err) {
      chatMensagens.lastChild.remove();
      adicionarMensagem("Assistente", "❌ Erro ao conectar.");
    }
  });

  function adicionarMensagem(remetente, texto) {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${remetente}:</strong> ${texto}`;
    chatMensagens.appendChild(div);
    chatMensagens.scrollTop = chatMensagens.scrollHeight;
  }