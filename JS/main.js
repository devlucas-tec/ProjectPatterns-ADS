// JS/main.js

// Importa todas as peças traduzidas, referenciando os arquivos .js
import { GerenciadorJogo, GerenciadorSom } from './gerenciadores.js';
import { FabricaHerois, FabricaMonstros } from './fabricas.js';
import { ObservadorVidaUI, ObservadorLogicaJogo } from './observadores.js';
import { FachadaCombate } from './fachada.js';
import { GerenciadorUI } from './ui.js';

// Ponto de Entrada da Aplicação (main)
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Inicialização e Injeção de Dependência (DI) ---
    
    const gerenciadorJogo = GerenciadorJogo.obterInstancia();
    const gerenciadorSom = GerenciadorSom.obterInstancia();
    const fachadaCombate = new FachadaCombate(gerenciadorJogo, gerenciadorSom);
    const fabricaHerois = new FabricaHerois();
    const fabricaMonstros = new FabricaMonstros();
    const observadorLogicaJogo = new ObservadorLogicaJogo(gerenciadorJogo);
    let musicaIniciada = false;

    // --- 2. Criação de Entidades (Usando Factories) ---

    // Usa os tipos em português
    const herois = [
        fabricaHerois.criarHeroi('veloz', 'hero-1'),
        fabricaHerois.criarHeroi('furia', 'hero-2'),
        fabricaHerois.criarHeroi('tanque', 'hero-3'),
        fabricaHerois.criarHeroi('mago', 'hero-4')
    ];
    // Usa os tipos em português
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

    document.getElementById('hero-container').addEventListener('click', (e) => {
        if (!musicaIniciada) {
            gerenciadorSom.iniciarMusica();
            musicaIniciada = true;
        }
        
        const cartao = e.target.closest('.card');
        if (cartao) {
            gerenciadorJogo.definirHeroiSelecionado(cartao.dataset.idHeroi);
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