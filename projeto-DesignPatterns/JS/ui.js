export class GerenciadorUI {

    static renderizarHeroi(heroi) {
        const containerHerois = document.getElementById('hero-container');
        const cartao = document.createElement('div');
        cartao.className = 'card';
        cartao.id = heroi.id;
        cartao.dataset.idHeroi = heroi.id;
        cartao.innerHTML = `
            <img src="${heroi.imagem}" alt="${heroi.nome}">
            <h3>${heroi.nome}</h3>
            <div class="barra-vida barra-vida-heroi">
                <div class="barra-vida-interna barra-vida-interna-heroi"></div>
            </div>
            <p>${heroi.descricao}</p>
        `;
        containerHerois.appendChild(cartao);
    }

    static renderizarMonstro(monstro, idContainer) {
        const containerMonstros = document.getElementById(idContainer);
        const cartao = document.createElement('div');
        cartao.className = 'card';
        cartao.id = monstro.id;
        cartao.innerHTML = `
            <img src="${monstro.imagem}" alt="${monstro.nome}">
            <h3>${monstro.nome}</h3>
            <div class="barra-vida">
                <div class="barra-vida-interna"></div>
            </div>
            <button class="btn-atacar" data-monster-id="${monstro.id}">GOLPEAR</button>
        `;
        containerMonstros.appendChild(cartao);
    }

    static destacarHeroiSelecionado(idHeroi) {
        document.querySelectorAll('#hero-selection .card').forEach(cartao => {
            cartao.classList.remove('selected');
        });
        document.getElementById(idHeroi).classList.add('selected');
    }
    
    static invocarChefe() {
        document.getElementById('monster-area').classList.add('hidden');
        document.getElementById('boss-area').classList.remove('hidden');
    }

    static mostrarEfeitoDano(idElemento, classeEfeito) {
        const elemento = document.getElementById(idElemento);
        if (elemento) {
            elemento.classList.add(classeEfeito);
            setTimeout(() => { elemento.classList.remove(classeEfeito); }, 300);
        }
    }
}