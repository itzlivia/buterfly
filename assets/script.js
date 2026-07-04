// Seleção de Telas
const telaMenu = document.getElementById('tela-menu');
const telaCabine = document.getElementById('tela-cabine');

// Seleção de Componentes e Botões
const video = document.getElementById('video');
const video2 = document.getElementById('video2');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const btnEntrar = document.getElementById('btn-entrar');
const btnCapturar = document.getElementById('btn-capturar');
const btnSalvar = document.getElementById('btn-salvar');
const btnVoltar = document.getElementById('btn-voltar');
const containerBorboletas = document.getElementById('container-borboletas');

let streamWebcam = null;
let intervaloBorboletas = null; // Guardará o temporizador do efeito

// EVENTO 1: Entrar na Cabine e Ligar Câmera
btnEntrar.addEventListener('click', () => {
    telaMenu.classList.add('hidden');
    telaCabine.classList.remove('hidden');

     // [NOVO] Inicia o efeito de criar borboletas a cada 600 milissegundos
     intervaloBorboletas = setInterval(criarBorboleta, 600);

      // Liga a câmera do usuário
      navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
      .then(stream => {
        streamWebcam = stream;
         video.srcObject = stream; // Adicionado: faz o vídeo da câmera aparecer na tela // Alimenta a câmera da esquerda
         video2.srcObject = stream;  //  Alimenta a câmera da direita
    })
    .catch(err => {
        alert('Erro ao Acessar a Webcam: ' + err);
        voltarProMenu();
    });
});

// EVENTO 2: Tirar a Foto (Capturar)
btnCapturar.addEventListener('click' , () => {
     // Ajusta o tamanho interno do canvas para o tamanho real do vídeo
     canvas.width = video.videoWidth * 2;
     canvas.height = video.videoHeight;

// Desenha a imagem do segundo vídeo na metade direita
    ctx.drawImage(video2, 0, 0, video.videoWidth, 0, video.videoWidth, canvas.height);

     // 3. [NOVO] Carimba a moldura por cima das duas fotos no canvas final
     ctx.drawImage(moldura, 0, 0, canvas.width, canvas.height);

     // Esconde o vídeo e mostra o Canvas estático
    document.querySelector('.duas-cameras').style.display ='none';
    video.style.display = ' none';
    video2.style.display = ' none';
    canvas.style.display = 'block';

     // Atualiza botões
     btnCapturar.innerText = 'Tirar Outra';
     btnSalvar.classList.remove('hidden');
});

// EVENTO 3: Salvar (Baixar) a foto tirada
btnSalvar.addEventListener('click', () => {
     // Converte o canvas em uma imagem downloadável
     const imagemBase64 = canvas.toDataURL('image/jpeg');

     const link= document.createElement('a');
     link.href = imagemBase64;
     link.download = 'minha-fot-cabine.jpg';
     link.click();
})

// EVENTO 4: Botão Voltar/Sair
btnVoltar.addEventListener('click', voltarProMenu);

function voltarProMenu() {
     // Desliga a câmera para economizar bateria/recursos
     if (streamWebcam){
        streamWebcam.getTracks().forEach(track => track.stop());
     }

     // [NOVO] Para de criar borboletas e limpa as existentes
     clearInterval(intervaloBorboletas);
     containerBorboletas.innerHTML = '';

      // Reseta o estado visual dos elementos
      video.style.display = 'block';
      canvas.style.display = 'none';
      btnCapturar.innerText = '🦋Click';
      btnSalvar.classList.add('hidden');

       // Troca as telas
       telaCabine.classList.add('hidden');
       telaMenu.classList.remove('hidden');
}

// Nova função que gera as borboletas dinamicamente
function criarBorboleta() {
     const borboleta = document.createElement('div');
     borboleta.classList.add('borboleta-voadora');
     borboleta.innerText = '🦋';

      // Gera posições e velocidades aleatórias para parecer natural
      const posicaoEsquerda = Math.random() * 100;  // Posição horizontal (0% a 100%)
      const tempoSubida = Math.random() * 3 + 4;  // Tempo para subir (entre 4s e 7s)
      const tempoBalanco = Math.random() * 1 + 1; // Tempo do balanço lateral (entre 1s e 2s)
      const tamanho = Math.random() * 15 + 15;  // Tamanho da borboleta (entre 15px e 30px)

       // Aplica os estilos gerados na borboleta
       borboleta.style.left = `${posicaoEsquerda}%` ;
       borboleta.style.fontSize = `${tamanho}px` ;
       borboleta.style.animationDuration = `${tempoSubida}s, ${tempoBalanco}s `;

        // Adiciona ao container da tela
        containerBorboletas.appendChild(borboleta);

         // Remove a borboleta do HTML após a animação terminar para não travar o site
         setTimeout(() => {
          borboleta.remove();
         }, tempoSubida * 1000);
}