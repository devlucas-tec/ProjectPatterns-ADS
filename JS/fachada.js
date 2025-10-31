// JS/fachada.js
import { GerenciadorUI } from './ui.js';
// ATUALIZADO: Importa todos os tipos de herói que podem ter lógica específica
import { HeroiVeloz, HeroiFuria, HeroiTanque, HeroiMago } from './entidades.js';

export class FachadaCombate {
    constructor(gerenciadorJogo, gerenciadorSom) {
        this.gerenciadorJogo = gerenciadorJogo;
        this.gerenciadorSom = gerenciadorSom;
    }

    executarAtaque(idMonstro) {
        const heroi = this.gerenciadorJogo.obterHeroiSelecionado();
        const monstro = this.gerenciadorJogo.obterMonstro(idMonstro);

        if (!heroi) {
            alert("Por favor, selecione um herói primeiro!");
            return;
        }
        if (!heroi.estaVivo) {
            alert(heroi.nome + " está fora de combate!");
            return;
        }
        if (!monstro || !monstro.estaVivo) return;

        const detalhesAtaque = heroi.obterDetalhesAtaque();
        
        // 1. Herói ataca o monstro
        monstro.receberDano(detalhesAtaque.dano);
        this.gerenciadorSom.tocarSom('monster-hit');

        // 2. Herói sofre dano de Recuo (ex: Fúria)
        if (detalhesAtaque.recuo > 0) {
            heroi.receberDano(detalhesAtaque.recuo, 'damage-recoil');
            this.gerenciadorSom.tocarSom('hero-recoil');
        }

        // 3. Monstro contra-ataca (Dano que o monstro devolve)
        // ATUALIZADO: Considera desvio e defesa
        if (monstro.estaVivo && heroi.estaVivo) { // Monstro e herói devem estar vivos para contra-atacar/receber dano
            let danoContraAtaque = monstro.danoBase;

            // Lógica do Veloz: Chance de desviar
            if (heroi instanceof HeroiVeloz && Math.random() < detalhesAtaque.chanceDesvio) {
                console.log(`${heroi.nome} desviou do ataque de ${monstro.nome}!`);
                // Não recebe dano, mas ainda mostra efeito visual
                GerenciadorUI.mostrarEfeitoDano(heroi.id, 'damage-recoil'); // Efeito de desvio, pode ser diferente
                this.gerenciadorSom.tocarSom('hero-recoil'); // Som de desvio
                return; // O herói desviou, não toma dano nem som de "hit"
            }

            // Lógica do Tanque: Reduz dano de contra-ataque
            if (heroi instanceof HeroiTanque) {
                danoContraAtaque = Math.max(0, danoContraAtaque - heroi.defesa);
                console.log(`${heroi.nome} (Tanque) reduziu o dano para ${danoContraAtaque}.`);
            }
            
            // Lógica do Fúria (ele recebe o dano normal do contra-ataque, além do recuo)
            // Lógica do Mago (ele recebe o dano normal do contra-ataque)
            
            heroi.receberDano(danoContraAtaque, 'damage-hit'); // Chama o método de receber dano do herói
            this.gerenciadorSom.tocarSom('hero-hit');
        }
    }
}