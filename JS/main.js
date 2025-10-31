import { GerenciadorJogo, GerenciadorSom } from './gerenciadores.js';
import { FabricaHerois, FabricaMonstros } from './fabricas.js';
import { ObservadorVidaUI, ObservadorLogicaJogo, ObservadorVidaHeroiUI } from './observadores.js';
import { FachadaCombate } from './fachada.js';
import { GerenciadorUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {

    const gerenciadorJogo = GerenciadorJogo.obterInstancia();
    const gerenciadorSom = GerenciadorSom.obterInstancia();
    const fachadaCombate = new FachadaCombate(gerenciadorJogo, gerenciadorSom);
    const fabricaHerois = new FabricaHerois();
    const fabricaMonstros = new FabricaMonstros();
    const observadorLogicaJogo = new ObservadorLogicaJogo(gerenciadorJogo);
    
    let audioLiberado = false;

    function tentarLiberarAudio() {
        if (audioLiberado) return;
        gerenciadorSom.iniciarContextoAudio();
        audioLiberado = true;
    }

    const herois = [
        fabricaHerois.criarHeroi('veloz', 'hero-1'),
        fabricaHerois.criarHeroi('furia', 'hero-2'),
        fabricaHerois.criarHeroi('tanque', 'hero-3'),
        fabricaHerois.criarHeroi('mago', 'hero-4')
    ];
    const monstros = [
        fabricaMonstros.criarMonstro('goblin', 'monster-1'),
        fabricaMonstros.criarMonstro('ogro', 'monster-2'),
        fabricaMonstros.criarMonstro('slime', 'monster-3'),
        fabricaMonstros.criarMonstro('esqueleto', 'monster-4')
    ];
    const chefe = fabricaMonstros.criarMonstro('chefe', 'boss-1');

    
    herois.forEach(heroi => {
        gerenciadorJogo.registrarHeroi(heroi);
        GerenciadorUI.renderizarHeroi(heroi);
        heroi.adicionarObservador(new ObservadorVidaHeroiUI(heroi.id, gerenciadorSom));
    });

    monstros.forEach(monstro => {
        gerenciadorJogo.registrarMonstro(monstro);
        GerenciadorUI.renderizarMonstro(monstro, 'monster-container');
        monstro.adicionarObservador(new ObservadorVidaUI(monstro.id, gerenciadorSom));
        monstro.adicionarObservador(observadorLogicaJogo);
    });
    
    gerenciadorJogo.registrarChefe(chefe);
    GerenciadorUI.renderizarMonstro(chefe, 'boss-container');
    chefe.adicionarObservador(new ObservadorVidaUI(chefe.id, gerenciadorSom));

    document.getElementById('hero-container').addEventListener('click', (e) => {
        tentarLiberarAudio();
        
        const cartao = e.target.closest('.card');
        if (cartao) {
            const heroi = gerenciadorJogo.herois.find(h => h.id === cartao.dataset.idHeroi);
            
            if (heroi && heroi.estaVivo) {
                gerenciadorJogo.definirHeroiSelecionado(cartao.dataset.idHeroi);
                gerenciadorSom.tocarMusica(heroi.musicaTema);
            }
        }
    });

    const ouvinteAtaque = (e) => {
        tentarLiberarAudio(); 
        
        if (e.target.classList.contains('btn-atacar')) {
            fachadaCombate.executarAtaque(e.target.dataset.monsterId);
        }
    };
    
    document.getElementById('monster-area').addEventListener('click', ouvinteAtaque);
    document.getElementById('boss-area').addEventListener('click', ouvinteAtaque);
});