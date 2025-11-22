// 1. Bazuca Simples
const bazucaBasica = new Bazuca();
console.log(`### Bazuca Básica ###`);
console.log(`Descrição: ${bazucaBasica.descricao()}`); 
console.log(`Custo: $${bazucaBasica.custo()}`); 
console.log(bazucaBasica.atirar());

console.log('---------------------------');

let bazucaLaser = new Bazuca();
bazucaLaser = new MiraLaserDecorator(bazucaLaser); 

console.log(`### Bazuca com Mira Laser ###`);
console.log(`Descrição: ${bazucaLaser.descricao()}`); 
console.log(`Custo: $${bazucaLaser.custo()}`); 
console.log(bazucaLaser.atirar());

console.log('---------------------------');