const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const quitButton = document.getElementById("quitButton");

let gameRunning = false;

// Variáveis da bolinha
let xBolinha = 300;
let yBolinha = 200;
let diametro = 20;
let raio = diametro / 2;

// Velocidade da bolinha
let velocidadeXBolinha = 6;
let velocidadeYBolinha = 4;

// Variáveis da raquete do jogador
let xRaqueteJogador = 7;
let yRaqueteJogador = 150;
const raqueteComprimento = 10;
const raqueteAltura = 90;

// Variáveis da raquete do oponente
let xRaqueteOponente = 579;
let yRaqueteOponente = 150;
const velocidadeRaqueteOponente = 4;

// Placar do jogo
let pontuacaoJogador = 0;
let pontuacaoOponente = 0;

// Função para iniciar o jogo
function iniciarJogo() {
    resetarBolinha();
    gameRunning = true;
    startButton.disabled = true;
    requestAnimationFrame(jogo);
}

// Função para sair do jogo
function sairDoJogo() {
    gameRunning = false;
    startButton.disabled = false;
    quitButton.disabled = true;
    resetarBolinha();
    pontuacaoJogador = 0;
    pontuacaoOponente = 0;
    desenharJogo();
}

// Função para desenhar a bolinha
function desenharBolinha() {
    context.fillStyle = "#772";
    context.beginPath();
    context.arc(xBolinha, yBolinha, raio, 0, Math.PI * 2);
    context.closePath();
    context.fill();
}

// Função para desenhar a raquete do jogador
function desenharRaqueteJogador() {
    context.fillStyle = "#772";
    context.fillRect(xRaqueteJogador, yRaqueteJogador, raqueteComprimento, raqueteAltura);
}

// Função para desenhar a raquete do oponente
function desenharRaqueteOponente() {
    context.fillStyle = "#772";
    context.fillRect(xRaqueteOponente, yRaqueteOponente, raqueteComprimento, raqueteAltura);
}

// Função para desenhar o placar
function desenharPlacar() {
    context.fillStyle = "#FFF";
    context.font = "19px Arial";
    context.fillText("Jogador: " + pontuacaoJogador, 80, 40);
    context.fillText("Oponente: " + pontuacaoOponente, canvas.width - 160, 40);
}

function desenharLinhaPontilhada() {
    context.strokeStyle = "#772";
    context.setLineDash([10, 10]); // Define o estilo da linha como pontilhada
    context.beginPath();
    context.moveTo(canvas.width / 2, 0); // Começa a linha no meio do campo, no topo
    context.lineTo(canvas.width / 2, canvas.height); // Termina a linha no meio do campo, na base
    context.stroke();
}

// Função para movimentar a raquete do jogador
function moverRaqueteJogador(event) {
    const limiteSuperior = canvas.height - raqueteAltura;
    const limiteInferior = 0;

    const teclaPressionada = event.key;
    if (teclaPressionada === "ArrowUp" && yRaqueteJogador > limiteInferior) {
        yRaqueteJogador -= 10;
    }
    if (teclaPressionada === "ArrowDown" && yRaqueteJogador < limiteSuperior) {
        yRaqueteJogador += 10;
    }
}

// Função para movimentar a raquete do oponente
function moverRaqueteOponente() {
    const centroRaqueteOponente = yRaqueteOponente + raqueteAltura / 2;
    if (centroRaqueteOponente < yBolinha - 35 && yRaqueteOponente < canvas.height - raqueteAltura) {
        yRaqueteOponente += velocidadeRaqueteOponente;
    }
    if (centroRaqueteOponente > yBolinha + 35 && yRaqueteOponente > 0) {
        yRaqueteOponente -= velocidadeRaqueteOponente;
    }
}

// Função para atualizar a posição da bolinha
function atualizarBolinha() {
    xBolinha += velocidadeXBolinha;
    yBolinha += velocidadeYBolinha;

    // Verifica colisão com as bordas
    if (yBolinha + raio > canvas.height || yBolinha - raio < 0) {
        velocidadeYBolinha *= -1;
    }

    // Verifica colisão com a raquete do jogador
    if (
        xBolinha - raio < xRaqueteJogador + raqueteComprimento &&
        yBolinha - raio < yRaqueteJogador + raqueteAltura &&
        yBolinha + raio > yRaqueteJogador
    ) {
        velocidadeXBolinha *= -1;
    }

    // Verifica colisão com a raquete do oponente
    if (
        xBolinha + raio > xRaqueteOponente &&
        yBolinha - raio < yRaqueteOponente + raqueteAltura &&
        yBolinha + raio > yRaqueteOponente
    ) {
        velocidadeXBolinha *= -1;
    }

    // Verifica se a bolinha saiu pela lateral
    if (xBolinha + raio > canvas.width) {
        pontuacaoJogador++;
        resetarBolinha();
    } else if (xBolinha - raio < 0) {
        pontuacaoOponente++;
        resetarBolinha();
    }

}

// Função para resetar a posição da bolinha
function resetarBolinha() {
    xBolinha = canvas.width / 2;
    yBolinha = canvas.height / 2;
    velocidadeXBolinha *= -1;
    velocidadeYBolinha = Math.random() > 0.5 ? 6 : -6;
}

// Função para desenhar os elementos do jogo
function desenharJogo() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    desenharLinhaPontilhada(); // Adiciona a linha pontilhada no meio
    desenharBolinha();
    desenharRaqueteJogador();
    desenharRaqueteOponente();
    desenharPlacar();
}

// Desenhar elementos iniciais antes do jogo começar
desenharJogo();


// Adicionar evento de escuta de teclado
document.addEventListener("keydown", moverRaqueteJogador);

// Função principal do jogo
function jogo() {
    if (!gameRunning) {
        return;
    }

    // Atualiza o jogo...
    atualizarBolinha();
    moverRaqueteOponente();
    desenharJogo();

    // Chama novamente a função para o próximo frame
    requestAnimationFrame(jogo);
}

// Evento de clique no botão de iniciar
startButton.addEventListener("click", iniciarJogo);

// Evento de clique no botão de sair
quitButton.addEventListener("click", sairDoJogo);