import { Observavel } from './observadores.js';

export class Monstro extends Observavel {
    constructor(id, nome, vidaMaxima, imagem, danoBase, somHit, somMorte) {
        super();
        this.id = id;
        this.nome = nome;
        this.vidaMaxima = vidaMaxima;
        this.vidaAtual = vidaMaxima;
        this.imagem = imagem;
        this.danoBase = danoBase;
        this.estaVivo = true;
        
        this.somHit = somHit;
        this.somMorte = somMorte;
    }

    receberDano(quantidade) {
        if (!this.estaVivo) return;
        this.vidaAtual = Math.max(0, this.vidaAtual - quantidade);

        this.notificar({ 
            tipo: 'ATUALIZACAO_VIDA', 
            monstro: this,
            quantidadeDano: quantidade,
            som: this.somHit 
        });

        if (this.vidaAtual === 0) {
            this.estaVivo = false;
            this.notificar({ 
                tipo: 'MORTE', 
                monstro: this,
                som: this.somMorte 
            });
        }
    }
}

export class Heroi extends Observavel {
    constructor(id, nome, descricao, imagem, vidaMaxima, musicaTema) {
        super();
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.imagem = imagem;
        this.vidaMaxima = vidaMaxima;
        this.vidaAtual = vidaMaxima;
        this.estaVivo = true;
        
        this.musicaTema = musicaTema;
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

export class HeroiVeloz extends Heroi {
    constructor(id, nome, descricao, imagem) {
        super(id, nome, descricao, imagem, 80, 'tema-veloz'); 
    }
    obterDetalhesAtaque() {
        return { dano: 15, recuo: 0, chanceDesvio: 0.4 };
    }
}
export class HeroiFuria extends Heroi {
    constructor(id, nome, descricao, imagem) {
        super(id, nome, descricao, imagem, 100, 'tema-furia'); 
    }
    obterDetalhesAtaque() {
        return { dano: 40, recuo: 10, chanceDesvio: 0 };
    }
}
export class HeroiTanque extends Heroi {
    constructor(id, nome, descricao, imagem) {
        super(id, nome, descricao, imagem, 150, 'tema-tanque');
        this.defesa = 0.7;
    }
    obterDetalhesAtaque() {
        return { dano: 20, recuo: 5, chanceDesvio: 0, defesa: this.defesa };
    }
}
export class HeroiMago extends Heroi {
    constructor(id, nome, descricao, imagem) {
        super(id, nome, descricao, imagem, 90, 'tema-mago');
    }
    obterDetalhesAtaque() {
        const dano = Math.floor(Math.random() * 25) + 15;
        return { dano: dano, recuo: 7, chanceDesvio: 0 };
    }
}