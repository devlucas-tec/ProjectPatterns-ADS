import { GerenciadorUI } from './ui.js';
import { HeroiVeloz, HeroiTanque } from './entidades.js'; 

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
        
        monstro.receberDano(detalhesAtaque.dano);

        if (detalhesAtaque.recuo > 0) {
            heroi.receberDano(detalhesAtaque.recuo, 'damage-recoil');
            this.gerenciadorSom.tocarSom('hero-recoil'); 
        }

        if (monstro.estaVivo && heroi.estaVivo) {
            let danoContraAtaque = monstro.danoBase;

            if (heroi instanceof HeroiVeloz && Math.random() < detalhesAtaque.chanceDesvio) {
                console.log(`${heroi.nome} desviou do ataque de ${monstro.nome}!`);
                GerenciadorUI.mostrarEfeitoDano(heroi.id, 'damage-recoil');
                this.gerenciadorSom.tocarSom('hero-recoil'); 
                return; 
            }

            if (heroi instanceof HeroiTanque) {
                danoContraAtaque = Math.max(0, danoContraAtaque - heroi.defesa);
            }
            
            heroi.receberDano(danoContraAtaque, 'damage-hit');
            this.gerenciadorSom.tocarSom('hero-hit');
        }
    }
}