// JS/observadores.js
import { GerenciadorUI } from './ui.js';

// --- Classes Base do Padrão ---

// O "Sujeito" (Subject)
export class Observavel {
    constructor() {
        this.observadores = [];
    }
    adicionarObservador(observador) {
        this.observadores.push(observador);
    }
    notificar(dados) {
        this.observadores.forEach(observador => observador.atualizar(dados));
    }
}

// O "Observador" (Observer)
export class Observador {
    atualizar(dados) {
        throw new Error("O método atualizar() deve ser implementado.");
    }
}

// --- Implementações Concretas ---

// Observador 1: Atualiza a UI (Vida, Efeitos)
export class ObservadorVidaUI extends Observador {
    constructor(idMonstro, gerenciadorSom) {
        super();
        this.elementoMonstro = document.getElementById(idMonstro);
        this.elementoBarraVida = this.elementoMonstro.querySelector('.barra-vida-interna');
        this.gerenciadorSom = gerenciadorSom; // Injeção de Dependência
    }

    atualizar(dados) {
        if (dados.tipo === 'ATUALIZACAO_VIDA' && dados.monstro.id === this.elementoMonstro.id) {
            const monstro = dados.monstro;
            const percentual = (monstro.vidaAtual / monstro.vidaMaxima) * 100;
            this.elementoBarraVida.style.width = `${percentual}%`;
            GerenciadorUI.mostrarEfeitoDano(monstro.id, 'damage-hit');

        } else if (dados.tipo === 'MORTE' && dados.monstro.id === this.elementoMonstro.id) {
            this.elementoMonstro.classList.add('dead');
            this.gerenciadorSom.tocarSom('monster-death');
        }
    }
}

// Observador 2: Atualiza a Lógica do Jogo
export class ObservadorLogicaJogo extends Observador {
    constructor(gerenciadorJogo) {
        super();
        this.gerenciadorJogo = gerenciadorJogo; // Injeção de Dependência
    }
    atualizar(dados) {
        if (dados.tipo === 'MORTE') {
            // Avisa o GerenciadorJogo para checar se o boss deve aparecer
            this.gerenciadorJogo.checarTodosMonstrosMortos();
        }
    }
}