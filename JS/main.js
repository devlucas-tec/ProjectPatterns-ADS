// JS/main.js

import { GerenciadorJogo, GerenciadorSom } from './gerenciadores.js';
import { FabricaHerois, FabricaMonstros } from './fabricas.js';
// ATUALIZADO: Importa o novo observador de herói
import { ObservadorVidaUI, ObservadorLogicaJogo, ObservadorVidaHeroiUI } from './observadores.js';
import { FachadaCombate } from './fachada.js';
import { GerenciadorUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Inicialização e DI ---
    
    const gerenciadorJogo = GerenciadorJogo.obterInstancia();
    const gerenciadorSom = GerenciadorSom.obterInstancia();
    const fachadaCombate = new FachadaCombate(gerenciadorJogo, gerenciadorSom);
    const fabricaHerois = new FabricaHerois();
    const fabricaMonstros = new FabricaMonstros();
    const observadorLogicaJogo = new ObservadorLogicaJogo(gerenciadorJogo);
    let musicaIniciada = false;

    // --- 2. Criação de Entidades ---
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

    // --- 3. Registro e Aplicação dos Padrões ---
    
    herois.forEach(heroi => {
        gerenciadorJogo.registrarHeroi(heroi);
        GerenciadorUI.renderizarHeroi(heroi);
        
        // NOVO: Adiciona o observador de UI para a vida do herói
        heroi.adicionarObservador(new ObservadorVidaHeroiUI(heroi.id));
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

    // --- 4. Configuração dos Event Listeners ---
    // (Esta seção permanece EXATAMENTE IGUAL)

    document.getElementById('hero-container').addEventListener('click', (e) => {
        if (!musicaIniciada) {
            gerenciadorSom.iniciarMusica();
            musicaIniciada = true;
        }
        
        const cartao = e.target.closest('.card');
        if (cartao) {
            // SÓ PERMITE SELECIONAR O HERÓI SE ELE ESTIVER VIVO
            const heroi = gerenciadorJogo.herois.find(h => h.id === cartao.dataset.idHeroi);
            if (heroi && heroi.estaVivo) {
                gerenciadorJogo.definirHeroiSelecionado(cartao.dataset.idHeroi);
            }
        }
    });

    const ouvinteAtaque = (e) => {
        if (e.target.classList.contains('btn-atacar')) {
            fachadaCombate.executarAtaque(e.target.dataset.monsterId);
        }
    };
    
    document.getElementById('monster-area').addEventListener('click', ouvinteAtaque);
    document.getElementById('boss-area').addEventListener('click', ouvinteAtaque);
});