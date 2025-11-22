import { GerenciadorUI } from './ui.js';

export class GerenciadorSom {
    constructor() {
        if (GerenciadorSom.instancia) {
            return GerenciadorSom.instancia;
        }

        this.contextoIniciado = false;

        this.musicas = {
            'tema-veloz': new Audio('../AUDIO/tema-veloz.mp3'),
            'tema-furia': new Audio('../AUDIO/tema-furia.mp3'),
            'tema-tanque': new Audio('../AUDIO/tema-tanque.mp3'),
            'tema-mago': new Audio('../AUDIO/tema-mago.mp3'),
            'tema-chefe': new Audio('../AUDIO/tema-chefe.mp3'),
        };
        for (const key in this.musicas) {
            this.musicas[key].loop = true;
            this.musicas[key].volume = 0.3;
        }
        this.musicaAtual = null;

        this.sons = {
            'goblin-hit': new Audio('../AUDIO/monstro-goblin-hit.mp3'),
            'goblin-morte': new Audio('../AUDIO/monstro-goblin-morte.mp3'),
            'ogro-hit': new Audio('../AUDIO/monstro-ogro-hit.mp3'),
            'ogro-morte': new Audio('../AUDIO/monstro-ogro-morte.mp3'),
            'slime-hit': new Audio('../AUDIO/monstro-slime-hit.mp3'),
            'slime-morte': new Audio('../AUDIO/monstro-slime-morte.mp3'),
            'esqueleto-hit': new Audio('../AUDIO/monstro-esqueleto-hit.mp3'),
            'esqueleto-morte': new Audio('../AUDIO/monstro-esqueleto-morte.mp3'),
            'chefe-hit': new Audio('../AUDIO/chefe-hit.mp3'),
            'chefe-morte': new Audio('../AUDIO/chefe-morte.mp3'),
        };

        for (const key in this.sons) {
            this.sons[key].volume = 0.5;
        }

        GerenciadorSom.instancia = this;
    }

    static obterInstancia() {
        if (!GerenciadorSom.instancia) {
            GerenciadorSom.instancia = new GerenciadorSom();
        }
        return GerenciadorSom.instancia;
    }

    iniciarContextoAudio() {
        if (this.contextoIniciado) return;

        console.log("Iniciando contexto de áudio e pré-carregando sons...");

        for (const key in this.musicas) {
            this.musicas[key].load();
        }
        for (const key in this.sons) {
            this.sons[key].load();
        }
        this.contextoIniciado = true;
    }

    tocarSom(nomeSom) {
        const som = this.sons[nomeSom];
        if (som) {
            som.currentTime = 0;
            som.play().catch(e => console.error(`Falha ao tocar som ${nomeSom}:`, e));
        } else {
            console.warn(`Som não encontrado: ${nomeSom}`);
        }
    }

    tocarMusica(nomeMusica) {
        if (this.musicaAtual) {
            this.musicaAtual.pause();
            this.musicaAtual.currentTime = 0;
        }

        const novaMusica = this.musicas[nomeMusica];
        if (novaMusica) {

            this.iniciarContextoAudio(); 
            
            novaMusica.play().catch(e => console.error(`Falha ao tocar música ${nomeMusica}:`, e));
            this.musicaAtual = novaMusica;
        } else {
            this.musicaAtual = null;
            console.warn(`Música não encontrada: ${nomeMusica}`);
        }
    }

    pararMusica() {
        if (this.musicaAtual) {
            this.musicaAtual.pause();
            this.musicaAtual.currentTime = 0;
            this.musicaAtual = null;
        }
    }
}

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
        GerenciadorUI.destacarHeroiSelecionado(idHeroi);
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
            GerenciadorUI.invocarChefe();
            GerenciadorSom.obterInstancia().tocarMusica('tema-chefe');
        }
    }
}