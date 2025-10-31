// JS/entidades.js
import { Observavel } from './observadores.js'; // Importa o Observavel

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

// --- Heróis ---

// ATUALIZADO: Heroi agora também é um Observavel
export class Heroi extends Observavel {
    constructor(id, nome, descricao, imagem, vidaMaxima) { // Adicionado vidaMaxima
        super(); // Inicializa observadores
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.imagem = imagem;
        
        // NOVAS PROPRIEDADES DE VIDA
        this.vidaMaxima = vidaMaxima;
        this.vidaAtual = vidaMaxima;
        this.estaVivo = true;
    }

    // NOVO MÉTODO: Lógica para herói receber dano
    receberDano(quantidade, tipoEfeito = 'damage-hit') {
        if (!this.estaVivo) return;
        this.vidaAtual = Math.max(0, this.vidaAtual - quantidade);

        // Notifica observadores (a UI da barra de vida do herói)
        this.notificar({
            tipo: 'ATUALIZACAO_VIDA_HEROI',
            heroi: this,
            efeito: tipoEfeito // Passa o efeito visual (hit ou recoil)
        });

        if (this.vidaAtual === 0) {
            this.estaVivo = false;
            // Notifica sobre a morte do herói
            this.notificar({ tipo: 'MORTE_HEROI', heroi: this });
        }
    }

    obterDetalhesAtaque() {
        throw new Error("obterDetalhesAtaque() deve ser implementado.");
    }
}

// Subclasses agora passam a vida máxima para o 'super'
export class HeroiVeloz extends Heroi {
    constructor(id, nome, descricao, imagem) {
        super(id, nome, descricao, imagem, 80); // Vida baixa
    }
    obterDetalhesAtaque() {
        return { dano: 15, recuo: 0, evitaContraAtaque: true };
    }
}
export class HeroiFuria extends Heroi {
    constructor(id, nome, descricao, imagem) {
        super(id, nome, descricao, imagem, 100); // Vida média
    }
    obterDetalhesAtaque() {
        return { dano: 40, recuo: 10, evitaContraAtaque: false };
    }
}
export class HeroiTanque extends Heroi {
    constructor(id, nome, descricao, imagem) {
        super(id, nome, descricao, imagem, 150); // Vida alta
    }
    obterDetalhesAtaque() {
        return { dano: 20, recuo: 0, evitaContraAtaque: false, defesa: 5 };
    }
}
export class HeroiMago extends Heroi {
    constructor(id, nome, descricao, imagem) {
        super(id, nome, descricao, imagem, 90); // Vida média/baixa
    }
    obterDetalhesAtaque() {
        const dano = Math.floor(Math.random() * 30) + 10;
        return { dano: dano, recuo: 0, evitaContraAtaque: false };
    }
}