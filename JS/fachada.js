// JS/fachada.js
import { GerenciadorUI } from './ui.js';
import { HeroiTanque } from './entidades.js';

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
        // NOVO: Verifica se o herói ou o monstro estão vivos
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
            // ATUALIZADO: Chama o método receberDano do herói
            heroi.receberDano(detalhesAtaque.recuo, 'damage-recoil'); // Passa o efeito 'recoil'
            this.gerenciadorSom.tocarSom('hero-recoil');
        }

        // 3. Monstro contra-ataca (Dano que o monstro devolve)
        if (monstro.estaVivo && !detalhesAtaque.evitaContraAtaque) {
            let danoContraAtaque = monstro.danoBase;

            if (heroi instanceof HeroiTanque) {
                danoContraAtaque = Math.max(0, danoContraAtaque - heroi.defesa);
            }
            
            // ATUALIZADO: Chama o método receberDano do herói
            heroi.receberDano(danoContraAtaque, 'damage-hit'); // Passa o efeito 'hit'
            this.gerenciadorSom.tocarSom('hero-hit');
        }
    }
}