class Bazuca extends Arma {

    custo() {
        return 1500;
    }

    descricao() {
        return "Bazuca";
    }

    Atirar() {
        return `BOOM! A ${this.descricao()} atirou!`;
    }
}