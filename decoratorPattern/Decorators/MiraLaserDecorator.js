class MiraLaserDecorator extends ArmaDecorator {

    custo() {
        return super.custo() + 100;
    }

    descricao() {
        return super.descricao() + " com Mira Laser";
    }

    atirar() {
        return `${this.arma.atirar()} (Precisão aumentada com Mira Laser)`;
    }
}