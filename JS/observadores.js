import { GerenciadorUI } from './ui.js';


export class Observavel {
    constructor() { this.observadores = []; }
    adicionarObservador(observador) { this.observadores.push(observador); }
    notificar(dados) { this.observadores.forEach(observador => observador.atualizar(dados)); }
}
export class Observador {
    atualizar(dados) { throw new Error("O método atualizar() deve ser implementado."); }
}

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
            
            if(dados.som) this.gerenciadorSom.tocarSom(dados.som);

        } else if (dados.tipo === 'MORTE' && dados.monstro.id === this.elementoMonstro.id) {
            this.elementoMonstro.classList.add('dead');
            
            if(dados.som) this.gerenciadorSom.tocarSom(dados.som);
        }
    }
}

export class ObservadorVidaHeroiUI extends Observador {
    constructor(idHeroi, gerenciadorSom) { 
        super();
        this.elementoHeroi = document.getElementById(idHeroi);
        this.elementoBarraVida = this.elementoHeroi.querySelector('.barra-vida-interna-heroi');
        this.gerenciadorSom = gerenciadorSom; 
    }

    atualizar(dados) {
        if (dados.tipo === 'ATUALIZACAO_VIDA_HEROI' && dados.heroi.id === this.elementoHeroi.id) {
            const heroi = dados.heroi;
            const percentual = (heroi.vidaAtual / heroi.vidaMaxima) * 100;
            this.elementoBarraVida.style.width = `${percentual}%`;
            GerenciadorUI.mostrarEfeitoDano(heroi.id, dados.efeito);

        } else if (dados.tipo === 'MORTE_HEROI' && dados.heroi.id === this.elementoHeroi.id) {
            this.elementoHeroi.classList.add('dead');
            
            this.gerenciadorSom.pararMusica();
        }
    }
}

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