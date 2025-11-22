let currentPendingOrder = null;

function updateOrderStatusUI(status, detalhes = "") {
    const statusElement = document.getElementById('orderStatus');
    const paymentControls = document.getElementById('paymentControls');
    
    statusElement.innerHTML = `<strong>Status:</strong> <span style="color: ${status === 'PENDENTE' ? '#f5a623' : (status === 'PAGO' ? '#417505' : '#d0021b')};">${status}</span>${detalhes}`;
    
    if (status === 'PENDENTE') {
        paymentControls.style.display = 'block';
    } else {
        paymentControls.style.display = 'none';
    }
}

class ConfiguracaoSistema {
    static instance = null;
    constructor() {
        if (ConfiguracaoSistema.instance) {
            return ConfiguracaoSistema.instance; 
        }
        this.ambiente = 'PRODUCAO';
        this.versao = '1.0.0';
        ConfiguracaoSistema.instance = this;
    }

    static getInstance() {
        if (!ConfiguracaoSistema.instance) {
            ConfiguracaoSistema.instance = new ConfiguracaoSistema();
        }
        return ConfiguracaoSistema.instance;
    }

    getDetails() {
        return `Ambiente: ${this.ambiente}, Versão: ${this.versao}`;
    }
}


class Pedido {
    constructor() {
        this.observadores = [];
    }

    anexar(observador) {
        this.observadores.push(observador);
    }

    notificar(evento, detalhes = '') {
        this.observadores.forEach(obs => obs.atualizar(evento, detalhes));
    }
}

class NotificadorInterface {
    constructor(elementId) {
        this.elemento = document.getElementById(elementId);
    }

    atualizar(evento, detalhes) {
        const item = document.createElement('div');
        item.className = 'notification-item';
        item.textContent = `[${new Date().toLocaleTimeString()}] ${evento}. ${detalhes}`;
        this.elemento.prepend(item); 
    }
}


class ServicoDePagamento {
    processar(valor) {
        throw new Error("Método 'processar' deve ser implementado.");
    }
}

class PagamentoCartao extends ServicoDePagamento {
    processar(valor) {
        const config = ConfiguracaoSistema.getInstance();
        console.log(`[Factory] Processando Cartão de R$ ${valor.toFixed(2)} (${config.ambiente})`);
        return true; 
    }
}

class PagamentoBoleto extends ServicoDePagamento {
    processar(valor) {
        console.log(`[Factory] Gerando Boleto de R$ ${valor.toFixed(2)}. Prazo de 3 dias.`);
        return true;
    }
}

class PagamentoPix extends ServicoDePagamento {
    processar(valor) {
        console.log(`[Factory] Processando PIX de R$ ${valor.toFixed(2)}. Transação instantânea.`);
        return true;
    }   
}

class PagamentoEspecie extends ServicoDePagamento {
    constructor(sistemaPedidos) {
        super();
        this.sistemaPedidos = sistemaPedidos;
    }

    processar(valor) {
        console.log(`[Factory] Processando pagamento em espécie de R$ ${valor.toFixed(2)}. Dinheiro na mão é vendaval.`);
        
        this.sistemaPedidos.notificar(
            "VAI PAGAR EM ESPÉCIE? TÁS NESSE TEMPO AINDA É?",
            "Pagamento em espécie é coisa dos maias, incas e astecas! Crie vergonha na cara, caba de pea"
        );

        return false; 
    }
}

class FactoryDePagamentos {
    criarServico(tipo) {
        switch (tipo) {
            case 'cartao':
                return new PagamentoCartao();
            case 'boleto':
                return new PagamentoBoleto();
            case 'pix':
                return new PagamentoPix();
            case 'especie' :
                return new PagamentoEspecie(sistemaPedidos);
            default:
                console.error("Tipo de pagamento desconhecido.");
                return null;
        }
    }
}


class ProcessadorDePedidos {
    constructor(servicoPagamento) {
        this.pagamento = servicoPagamento;
    }

    iniciarProcessamento(valor) {
        console.log("[DI] Processador de Pagamento iniciando...");
        if (!this.pagamento || !this.pagamento.processar) { console.error("[ERRO] Serviço de Pagamento inválido injetado.");
            return false;

        }
        return this.pagamento.processar(valor);
    }
}


class InterfaceECommerceFacade {
    constructor(pedido) {
        this.pedido = pedido; 
        this.factory = new FactoryDePagamentos(); 
    }
    
    criarNovoPedido(valor) {
        currentPendingOrder = {
            id: Date.now(),
            valor: valor,
            status: 'PENDENTE'
        };
        this.pedido.notificar("Pedido Criado", `ID: ${currentPendingOrder.id}, Valor: R$ ${valor.toFixed(2)}.`);
        updateOrderStatusUI('PENDENTE', `<br>ID: ${currentPendingOrder.id} | Valor: R$ ${valor.toFixed(2)}`);
    }

    processarPagamento(pedido, tipoPagamento) {
        if (!pedido || pedido.status !== 'PENDENTE') {
            this.pedido.notificar("Erro", "Não há pedido pendente para pagar.");
            return;
        }

        console.log("\n--- FACADE: Iniciando transação de pagamento ---");

        const servicoDePagamento = this.factory.criarServico(tipoPagamento);

        const processador = new ProcessadorDePedidos(servicoDePagamento); 
        
        const sucesso = processador.iniciarProcessamento(pedido.valor);

        if (sucesso) {

            pedido.status = 'PAGO';
            currentPendingOrder = null; 

            this.pedido.notificar(
                "Pagamento Confirmado", 
                `Pedido ID: ${pedido.id} | Método: ${tipoPagamento.toUpperCase()}`
            );
            updateOrderStatusUI('PAGO', `<br>ID: ${pedido.id} | Pago com ${tipoPagamento.toUpperCase()} | Valor: R$ ${pedido.valor.toFixed(2)}`);
        } else {
            this.pedido.notificar("Pagamento Falhou", `Pedido ID: ${pedido.id}`);
            updateOrderStatusUI('FALHA', `<br>ID: ${pedido.id} | Pagamento Recusado`);
        }
        
        console.log("--- FACADE: Transação de Pagamento concluída ---\n");
    }
}


const config = ConfiguracaoSistema.getInstance();
document.getElementById('singletonInfo').textContent = config.getDetails();

const sistemaPedidos = new Pedido();
const notificadorUI = new NotificadorInterface('notifications');
sistemaPedidos.anexar(notificadorUI); 

const fachadaECommerce = new InterfaceECommerceFacade(sistemaPedidos);


function realizarPedidoDemo() {
    
    if (currentPendingOrder) {
        console.warn("Já existe um pedido pendente. Pague-o primeiro.");
        return;
    }

    const valorInput = document.getElementById('orderValue').value;
    const valor = parseFloat(valorInput);

    if (isNaN(valor) || valor <= 0) {
        console.error("ERRO: Por favor, digite um valor válido e positivo para o pedido.");
        return;
    }
    
    fachadaECommerce.criarNovoPedido(valor);
}

function pagarPedidoPendenteDemo() {
    if (!currentPendingOrder) {
        console.error("ERRO: Não há pedido pendente para pagar.");
        return;
    }

    const tipoPagamento = document.getElementById('paymentMethodPay').value;
    
    fachadaECommerce.processarPagamento(currentPendingOrder, tipoPagamento);
}
