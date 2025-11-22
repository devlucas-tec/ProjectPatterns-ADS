class ArmaDecorator extends Arma {

    constructor(arma) {
        super();
        this.arma = arma;
    }

    custo() {
        return this.arma.custo();
    }

    descricao() {
        return this.arma.descricao();
    }
}