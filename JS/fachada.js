// JS/fachada.js
import { GerenciadorUI } from './ui.js';
import { HeroiTanque } from './entidades.js'; // Importa para checar 'instanceof'

// Padrão Facade: Simplifica a complexidade do combate
export class FachadaCombate {
    constructor(gerenciadorJogo, gerenciadorSom) {
        this.gerenciadorJogo = gerenciadorJogo; // Injeção de Dependência
        this.gerenciadorSom = gerenciadorSom; // Injeção de Dependência
    }

    executarAtaque(idMonstro) {
        const heroi = this.gerenciadorJogo.obterHeroiSelecionado();
        const monstro = this.gerenciadorJogo.obterMonstro(idMonstro);

        if (!heroi) {
            alert("Por favor, selecione um herói primeiro!");
            return;
        }
        if (!monstro || !monstro.estaVivo) return; // Não ataca monstros mortos

        const detalhesAtaque = heroi.obterDetalhesAtaque();
        
        // 1. Herói ataca o monstro
        monstro.receberDano(detalhesAtaque.dano);
        this.gerenciadorSom.tocarSom('monster-hit');

        // 2. Herói sofre dano de Recuo (se aplicável)
        if (detalhesAtaque.recuo > 0) {
            GerenciadorUI.mostrarEfeitoDano(heroi.id, 'damage-recoil');
            this.gerenciadorSom.tocarSom('hero-recoil');
        }

        // 3. Monstro contra-ataca (se vivo e o herói não evitar)
        if (monstro.estaVivo && !detalhesAtaque.evitaContraAtaque) {
            let danoContraAtaque = monstro.danoBase;

            // Lógica do Tank (depende da classe HeroiTanque)
            if (heroi instanceof HeroiTanque) {
                danoContraAtaque = Math.max(0, danoContraAtaque - heroi.defesa);
            }
            
            GerenciadorUI.mostrarEfeitoDano(heroi.id, 'damage-hit');
            this.gerenciadorSom.tocarSom('hero-hit');
        }
    }
}