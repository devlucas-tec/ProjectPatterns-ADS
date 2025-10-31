// JS/fabricas.js

import { Monstro, HeroiVeloz, HeroiFuria, HeroiTanque, HeroiMago } from './entidades.js';

export class FabricaHerois {
    criarHeroi(tipo, id) {
        const imagens = {
            veloz: '../IMG/heroi-veloz.png',
            furia: '../IMG/heroi-furia.png',
            tanque: '../IMG/heroi-tanque.png',
            mago: '../IMG/heroi-mago.png'
        };

        // ATUALIZADO: A lógica de 'vida' foi movida para as classes de entidade
        switch (tipo) {
            case 'veloz':
                return new HeroiVeloz(id, 'Veloz', 'Ataca rápido e evita contra-ataques.', imagens.veloz);
            case 'furia':
                return new HeroiFuria(id, 'Fúria', 'Dano massivo, mas sofre dano.', imagens.furia);
            case 'tanque':
                return new HeroiTanque(id, 'Tanque', 'Dano médio e alta defesa.', imagens.tanque);
            case 'mago':
                return new HeroiMago(id, 'Mago', 'Dano mágico instável.', imagens.mago);
            default:
                throw new Error('Tipo de herói desconhecido');
        }
    }
}

// A FabricaMonstros permanece EXATAMENTE IGUAL
export class FabricaMonstros {
    criarMonstro(tipo, id) {
        const imagens = {
            goblin: '../IMG/monstro-goblin.png',
            ogro: '../IMG/monstro-ogro.png',
            slime: '../IMG/monstro-slime.png',
            esqueleto: '../IMG/monstro-esqueleto.png',
            chefe: '../IMG/chefao-demonio.png'
        };

        switch (tipo) {
            case 'goblin':
                return new Monstro(id, 'Goblin', 80, imagens.goblin, 5);
            case 'ogro':
                return new Monstro(id, 'Ogro', 120, imagens.ogro, 10);
            case 'slime':
                return new Monstro(id, 'Slime', 60, imagens.slime, 3);
            case 'esqueleto':
                return new Monstro(id, 'Esqueleto', 100, imagens.esqueleto, 8);
            case 'chefe':
                return new Monstro(id, 'Rei Demônio', 500, imagens.chefe, 25);
            default:
                throw new Error('Tipo de monstro desconhecido');
        }
    }
}