// JS/gerenciadores.js
import { GerenciadorUI } from './ui.js';

// Padrão Singleton: GerenciadorSom
export class GerenciadorSom {
    constructor() {
        if (GerenciadorSom.instancia) {
            return GerenciadorSom.instancia;
        }
        this.sons = {
            'monster-hit': new Audio('../AUDIO/monster-hit.wav'),
            'hero-hit': new Audio('../AUDIO/hero-hit.wav'),
            'hero-recoil': new Audio('../AUDIO/hero-recoil.wav'),
            'monster-death': new Audio('../AUDIO/monster-death.wav'),
        };
        this.musicaFundo = new Audio('../AUDIO/background-music.mp3');
        this.musicaFundo.loop = true;
        this.musicaFundo.volume = 0.3;
        GerenciadorSom.instancia = this;
    }
    static obterInstancia() {
        if (!GerenciadorSom.instancia) {
            GerenciadorSom.instancia = new GerenciadorSom();
        }
        return GerenciadorSom.instancia;
    }
    tocarSom(nomeSom) {
        const som = this.sons[nomeSom];
        if (som) {
            som.currentTime = 0;
            som.play();
        }
    }
    iniciarMusica() {
        this.musicaFundo.play().catch(e => console.warn("Música bloqueada pelo navegador."));
    }
}


// Padrão Singleton: GerenciadorJogo
export class GerenciadorJogo {
    constructor() {
        if (GerenciadorJogo.instancia) {
            return GerenciadorJogo.instancia;
        }
        this.herois = [];
        this.monstros = [];
        this.heroiSelecionado = null;
        this.chefeInvocado = false;
        GerenciadorJogo.instancia = this;
    }
    static obterInstancia() {
        if (!GerenciadorJogo.instancia) {
            GerenciadorJogo.instancia = new GerenciadorJogo();
        }
        return GerenciadorJogo.instancia;
    }
    registrarHeroi(heroi) { this.herois.push(heroi); }
    registrarMonstro(monstro) { this.monstros.push(monstro); }
    definirHeroiSelecionado(idHeroi) {
        this.heroiSelecionado = this.herois.find(h => h.id === idHeroi);
        GerenciadorUI.destacarHeroiSelecionado(idHeroi); // Dependência do UI
    }
    obterHeroiSelecionado() { return this.heroiSelecionado; }
    obterMonstro(idMonstro) {
        const todosMonstros = [...this.monstros, this.chefe];
        return todosMonstros.find(m => m.id === idMonstro);
    }
    registrarChefe(chefe) { this.chefe = chefe; }
    checarTodosMonstrosMortos() {
        const todosMortos = this.monstros.every(m => !m.estaVivo);
        if (todosMortos && !this.chefeInvocado) {
            this.chefeInvocado = true;
            GerenciadorUI.invocarChefe(); // Dependência do UI
        }
    }
}