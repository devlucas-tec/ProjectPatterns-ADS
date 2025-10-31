// JS/fabricas.js

// Importa as classes que a fábrica precisa construir
import { Monstro, HeroiVeloz, HeroiFuria, HeroiTanque, HeroiMago } from './entidades.js';

// Padrão Factory: Heróis
export class FabricaHerois {
    criarHeroi(tipo, id) {
        // Aponta para os nomes de arquivo em português
        const imagens = {
            veloz: '../IMG/heroi-veloz.png',         // Você precisa criar esta imagem
            furia: '../IMG/heroi-furia.png',     // Imagem que você enviou
            tanque: '../IMG/heroi-tanque.png',       // Você precisa criar esta imagem
            mago: '../IMG/heroi-mago.png'            // Você precisa criar esta imagem
        };

        // 'tipos' traduzidos
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

export class FabricaMonstros {
    criarMonstro(tipo, id) {
        // Aponta para os nomes exatos das suas imagens
        const imagens = {
            goblin: '../IMG/monstro-goblin.png',     // Imagem que você enviou
            ogro: '../IMG/monstro-ogro.png',         // Imagem que você enviou
            slime: '../IMG/monstro-slime.png',       // Imagem que você enviou
            esqueleto: '../IMG/monstro-esqueleto.png', // Imagem que você enviou
            chefe: '../IMG/chefao-demonio.png'       // Imagem que você enviou
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