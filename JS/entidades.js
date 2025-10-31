import { Observavel } from './observadores.js';

// O Monstro é um "Observavel"
export class Monstro extends Observavel {
    constructor(id, nome, vidaMaxima, imagem, danoBase) {
        super(); // Inicializa a lista de observadores
        this.id = id;
        this.nome = nome;
        this.vidaMaxima = vidaMaxima;
        this.vidaAtual = vidaMaxima;
        this.imagem = imagem;
        this.danoBase = danoBase;
        this.estaVivo = true;
    }

    receberDano(quantidade) {
        if (!this.estaVivo) return;
        this.vidaAtual = Math.max(0, this.vidaAtual - quantidade);
        
        // Notifica observers sobre a vida
        this.notificar({ 
            tipo: 'ATUALIZACAO_VIDA', 
            monstro: this,
            quantidadeDano: quantidade 
        });

        if (this.vidaAtual === 0) {
            this.estaVivo = false;
            // Notifica observers sobre a morte
            this.notificar({ tipo: 'MORTE', monstro: this });
        }
    }
}

export class Heroi {
    constructor(id, nome, descricao, imagem) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.imagem = imagem;
    }
    obterDetalhesAtaque() {
        throw new Error("obterDetalhesAtaque() deve ser implementado.");
    }
}

export class HeroiVeloz extends Heroi {
    obterDetalhesAtaque() {
        return { dano: 15, recuo: 0, evitaContraAtaque: true };
    }
}
export class HeroiFuria extends Heroi {
    obterDetalhesAtaque() {
        return { dano: 40, recuo: 10, evitaContraAtaque: false };
    }
}
export class HeroiTanque extends Heroi {
    obterDetalhesAtaque() {
        return { dano: 20, recuo: 0, evitaContraAtaque: false, defesa: 5 };
    }
}
export class HeroiMago extends Heroi {
    obterDetalhesAtaque() {
        const dano = Math.floor(Math.random() * 30) + 10;
        return { dano: dano, recuo: 0, evitaContraAtaque: false };
    }
}