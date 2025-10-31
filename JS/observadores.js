// JS/observadores.js
import { GerenciadorUI } from './ui.js';

// --- Classes Base do Padrão ---
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
export class Observador {
    atualizar(dados) {
        throw new Error("O método atualizar() deve ser implementado.");
    }
}

// --- Implementações Concretas ---

// Observador 1: Atualiza a UI do MONSTRO (Sem alterações)
export class ObservadorVidaUI extends Observador {
    constructor(idMonstro, gerenciadorSom) {
        super();
        this.elementoMonstro = document.getElementById(idMonstro);
        this.elementoBarraVida = this.elementoMonstro.querySelector('.barra-vida-interna');
        this.gerenciadorSom = gerenciadorSom;
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

// NOVO OBSERVADOR: Atualiza a UI do HERÓI
export class ObservadorVidaHeroiUI extends Observador {
    constructor(idHeroi) {
        super();
        this.elementoHeroi = document.getElementById(idHeroi);
        this.elementoBarraVida = this.elementoHeroi.querySelector('.barra-vida-interna-heroi');
    }

    atualizar(dados) {
        if (dados.tipo === 'ATUALIZACAO_VIDA_HEROI' && dados.heroi.id === this.elementoHeroi.id) {
            const heroi = dados.heroi;
            const percentual = (heroi.vidaAtual / heroi.vidaMaxima) * 100;
            this.elementoBarraVida.style.width = `${percentual}%`;
            // O 'dados.efeito' (damage-hit ou damage-recoil) é passado pela entidade
            GerenciadorUI.mostrarEfeitoDano(heroi.id, dados.efeito);

        } else if (dados.tipo === 'MORTE_HEROI' && dados.heroi.id === this.elementoHeroi.id) {
            this.elementoHeroi.classList.add('dead');
            // Você pode adicionar um som de morte de herói aqui se quiser
        }
    }
}


// Observador 3: Atualiza a Lógica do Jogo (Sem alterações)
export class ObservadorLogicaJogo extends Observador {
    constructor(gerenciadorJogo) {
        super();
        this.gerenciadorJogo = gerenciadorJogo;
    }
    atualizar(dados) {
        if (dados.tipo === 'MORTE') {
            this.gerenciadorJogo.checarTodosMonstrosMortos();
        }
    }
}