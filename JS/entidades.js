// JS/entidades.js
import { Observavel } from './observadores.js';

// O Monstro é um "Observavel" (sem alterações)
export class Monstro extends Observavel {
    constructor(id, nome, vidaMaxima, imagem, danoBase) {
        super();
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
        
        this.notificar({ 
            tipo: 'ATUALIZACAO_VIDA', 
            monstro: this,
            quantidadeDano: quantidade 
        });

        if (this.vidaAtual === 0) {
            this.estaVivo = false;
            this.notificar({ tipo: 'MORTE', monstro: this });
        }
    }
}

// --- Heróis ---

// Heroi agora também é um Observavel (sem alterações na base)
export class Heroi extends Observavel {
    constructor(id, nome, descricao, imagem, vidaMaxima) {
        super();
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.imagem = imagem;
        
        this.vidaMaxima = vidaMaxima;
        this.vidaAtual = vidaMaxima;
        this.estaVivo = true;
    }

    receberDano(quantidade, tipoEfeito = 'damage-hit') {
        if (!this.estaVivo) return;
        this.vidaAtual = Math.max(0, this.vidaAtual - quantidade);

        this.notificar({
            tipo: 'ATUALIZACAO_VIDA_HEROI',
            heroi: this,
            efeito: tipoEfeito
        });

        if (this.vidaAtual === 0) {
            this.estaVivo = false;
            this.notificar({ tipo: 'MORTE_HEROI', heroi: this });
        }
    }

    obterDetalhesAtaque() {
        throw new Error("obterDetalhesAtaque() deve ser implementado.");
    }
}

// Subclasses com nova lógica
export class HeroiVeloz extends Heroi {
    constructor(id, nome, descricao, imagem) {
        super(id, nome, descricao, imagem, 50); // Vida baixa
    }
    obterDetalhesAtaque() {
        // ATUALIZADO: Veloz tem chance de desviar de contra-ataques
        return { dano: 15, recuo: 0.1, chanceDesvio: 0.1 }; // 10% de chance de desviar
    }
}

export class HeroiFuria extends Heroi { 
    constructor(id, nome, descricao, imagem) {
        super(id, nome, descricao, imagem, 100); // Vida média
    }
    obterDetalhesAtaque() {
        // ATUALIZADO: Fúria dá muito dano, mas sempre toma 10 de recuo e não desvia
        return { dano: 40, recuo: 10, chanceDesvio: 0 };
    }
}

export class HeroiTanque extends Heroi {
    constructor(id, nome, descricao, imagem) {
        super(id, nome, descricao, imagem, 150); // Vida alta
        this.defesa = 10; // NOVA: Propriedade de defesa
    }
    obterDetalhesAtaque() {
        // ATUALIZADO: Tanque tem defesa contra contra-ataques
        return { dano: 20, recuo: 5, chanceDesvio: 0, defesa: this.defesa };
    }
}

export class HeroiMago extends Heroi {
    constructor(id, nome, descricao, imagem) {
        super(id, nome, descricao, imagem, 70); // Vida média/baixa
    }
    obterDetalhesAtaque() {
        // ATUALIZADO: Mago é mais equilibrado, dano variável
        const dano = Math.floor(Math.random() * 25) + 15; // Dano entre 15 e 39
        return { dano: dano, recuo: 0, chanceDesvio: 0 }; // Nenhum desvio por padrão
    }
}