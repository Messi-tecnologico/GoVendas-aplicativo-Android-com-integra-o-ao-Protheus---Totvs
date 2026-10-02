const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Set response headers
app.use((req, res, next) => {
    res.setHeader('Connection', 'close');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// 1. Login endpoint
app.post('/api/auth/login', (req, res) => {
    const { usuario, senha, empresaAlias, filial } = req.body || {};
    console.log(`Login attempt - User: ${usuario}, Empresa: ${empresaAlias}, Filial: ${filial}`);

    // Simulate successful Protheus login response
    res.status(200).send(JSON.stringify({
        success: true,
        message: "Login realizado com sucesso",
        token: "mock-protheus-jwt-token-123456",
        filial: filial || "01",
        filialDescricao: "Filial Principal simulada",
        usuario: usuario || "ADMIN"
    }));
});

// 2. Test connection endpoint
app.post('/api/vendas/teste-conexao', (req, res) => {
    res.status(200).send(JSON.stringify({
        status: "OK",
        message: "Conexão com o backend Protheus estabelecida com sucesso!",
        environment: "REST-PROTHEUS-SIMULATOR",
        timestamp: new Date().toISOString()
    }));
});

// 3. Save order / sales endpoint
app.post('/api/pedidos', (req, res) => {
    console.log('Pedido recebido:', req.body);
    const tipoOp = req.body && req.body.tipoOperacao ? req.body.tipoOperacao : 'ORCAMENTO_LOJA';
    const isPedidoVenda = tipoOp === 'PEDIDO_VENDA';
    const isReserva = req.body && req.body.vendaReserva;

    const prefixo = isPedidoVenda ? "PV-" : (isReserva ? "RES-" : "SL-");
    const num = prefixo + Math.floor(Math.random() * 90000 + 10000);
    const msg = isPedidoVenda
        ? "Pedido de Venda gravado com sucesso no Protheus (Tabelas SC5010 / SC6010 via MATA410)"
        : (isReserva ? "Venda Reserva gravada com sucesso no Protheus (SL1/SL2/SL4 - Situação: FR)" : "Orçamento Loja gravado com sucesso no Protheus (Tabelas SL1010 / SL2010 / SL4010 via LJ7001)");

    res.status(200).send(JSON.stringify({
        success: true,
        tipoOperacao: tipoOp,
        tabelas: isPedidoVenda ? "SC5010 / SC6010" : "SL1010 / SL2010 / SL4010",
        message: msg,
        numeroPedidoProtheus: num,
        situacao: isReserva ? "FR" : "00"
    }));
});

// 4. Filiais endpoint
app.get('/api/filiais', (req, res) => {
    res.status(200).send(JSON.stringify([
        { codigo: "01", descricao: "Filial principal" },
        { codigo: "02", descricao: "Filial secundária" },
        { codigo: "03", descricao: "Filial digital" }
    ]));
});

// 5. Clientes endpoint
app.post('/api/clientes', (req, res) => {
    console.log('Novo cliente recebido:', req.body);
    const { nome, cpfCnpj, loja } = req.body || {};
    const codNovo = "00000" + Math.floor(Math.random() * 9 + 3);
    res.status(200).send(JSON.stringify({
        success: true,
        message: "Cliente cadastrado com sucesso no Protheus (SA1010)",
        id: codNovo,
        loja: loja || "01",
        nome: nome || "Novo Cliente",
        cpfCnpj: cpfCnpj || ""
    }));
});

app.get('/api/ceplocal', (req, res) => {
    const cep = (req.query.cep || '').replace(/\D/g, '');
    res.status(200).send(JSON.stringify({
        success: true,
        cep: cep,
        logradouro: "Avenida Eduardo Ribeiro",
        bairro: "Centro",
        localidade: "Manaus",
        uf: "AM",
        cod_municipio: "1302603"
    }));
});

app.get('/api/clientes', (req, res) => {
    const filtro = (req.query.filtro || '').toLowerCase();
    const clientes = [
        { id: "000001", nome: "Cliente Exemplo Ltda", cpfCnpj: "12345678000199", loja: "01", email: "cliente@exemplo.com.br" },
        { id: "000002", nome: "João da Silva", cpfCnpj: "98765432100", loja: "01", email: "joao@email.com" }
    ];
    if (!filtro) {
        return res.status(200).send(JSON.stringify(clientes));
    }
    const filtrados = clientes.filter(c =>
        c.id.toLowerCase().includes(filtro) ||
        c.nome.toLowerCase().includes(filtro) ||
        (c.cpfCnpj && c.cpfCnpj.toLowerCase().includes(filtro))
    );
    res.status(200).send(JSON.stringify(filtrados.length > 0 ? filtrados : clientes));
});

// 6. Vendedores endpoint
app.get('/api/vendedores', (req, res) => {
    const filtro = (req.query.filtro || '').toLowerCase();
    const vendedores = [
        { id: "000001", codigo: "000001", nome: "Vendedor Teste Principal" },
        { id: "000002", codigo: "000002", nome: "Vendedor Carlos Silva" },
        { id: "V001", codigo: "V001", nome: "Vendedor João Comissado" }
    ];
    if (!filtro) {
        return res.status(200).send(JSON.stringify(vendedores));
    }
    const filtrados = vendedores.filter(v =>
        (v.codigo && v.codigo.toLowerCase().includes(filtro)) ||
        (v.id && v.id.toLowerCase().includes(filtro)) ||
        v.nome.toLowerCase().includes(filtro)
    );
    res.status(200).send(JSON.stringify(filtrados.length > 0 ? filtrados : vendedores));
});

// 7. Produtos endpoint
app.get('/api/produtos', (req, res) => {
    const filtro = (req.query.filtro || '').toLowerCase();
    const produtos = [
        { id: "PROD01", codigo: "PROD01", nome: "Serviço de Consultoria Protheus", valor: 1500.00, categoria: "Serviços" },
        { id: "PROD02", codigo: "PROD02", nome: "Licença de Software GoVendas", valor: 350.00, categoria: "Licenças" },
        { id: "PROD03", codigo: "PROD03", nome: "Smartphone Android Teste", valor: 1200.00, categoria: "Hardware" },
        { id: "PROD04", codigo: "PROD04", nome: "Impressora Térmica Bluetooth", valor: 650.00, categoria: "Periféricos" }
    ];
    if (!filtro) {
        return res.status(200).send(JSON.stringify(produtos));
    }
    const filtrados = produtos.filter(p =>
        (p.codigo && p.codigo.toLowerCase().includes(filtro)) ||
        (p.id && p.id.toLowerCase().includes(filtro)) ||
        p.nome.toLowerCase().includes(filtro) ||
        (p.categoria && p.categoria.toLowerCase().includes(filtro))
    );
    res.status(200).send(JSON.stringify(filtrados.length > 0 ? filtrados : produtos));
});

// 8. Administradoras / Bandeiras de Cartão (Tabela SAE do Protheus)
app.get('/api/administradoras', (req, res) => {
    res.status(200).send(JSON.stringify({
        success: true,
        administradoras: [
            { codigo: "001", descricao: "VISA" },
            { codigo: "002", descricao: "MASTERCARD" },
            { codigo: "003", descricao: "ELO" },
            { codigo: "004", descricao: "AMEX" },
            { codigo: "005", descricao: "HIPERCARD" }
        ]
    }));
});

// 9. Proximo numero orçamento / pedido (GetSxBNum simulation: SL1 L1_NUM / SC5 C5_NUM)
app.get('/api/orcamentos/proximo-numero', (req, res) => {
    const filial = req.query.filial || "01";
    const tipoOp = req.query.tipoOperacao || "ORCAMENTO_LOJA";
    const isPedidoVenda = tipoOp === "PEDIDO_VENDA";

    res.status(200).send(JSON.stringify({
        success: true,
        filial: filial,
        tipoOperacao: tipoOp,
        tabela: isPedidoVenda ? "SC5" : "SL1",
        campo: isPedidoVenda ? "C5_NUM" : "L1_NUM",
        proximoNumero: isPedidoVenda ? "PV-000001" : "000001"
    }));
});

// 9.1 Dashboard metricas endpoint (SL1010 & SC5010 real metrics + Evolução 12 Meses)
app.get('/api/dashboard/metricas', (req, res) => {
    const filial = req.query.filial || "01";
    res.status(200).send(JSON.stringify({
        success: true,
        filial: filial,
        vendasHoje: {
            valor: 1549.90,
            quantidade: 1
        },
        vendasMes: {
            valor: 4881.80,
            quantidade: 3
        },
        faturamentoTotal: {
            valorAtual: 4881.80,
            valorAnoAnterior: 4478.71,
            percentualCrescimento: 9.00,
            mesAnoAnterior: "Setembro de 2025"
        },
        evolucaoVendas: [
            { mes: "Mai", valorK: 164.2, valor: 164200.0 },
            { mes: "Jun", valorK: 150.0, valor: 150000.0 },
            { mes: "Jul", valorK: 220.0, valor: 220000.0 },
            { mes: "Ago", valorK: 160.0, valor: 160000.0 },
            { mes: "Set", valorK: 210.0, valor: 210000.0 },
            { mes: "Out", valorK: 170.0, valor: 170000.0 },
            { mes: "Nov", valorK: 140.0, valor: 140000.0 },
            { mes: "Dez", valorK: 230.0, valor: 230000.0 },
            { mes: "Jan", valorK: 249.0, valor: 249000.0 },
            { mes: "Fev", valorK: 235.0, valor: 235000.0 },
            { mes: "Mar", valorK: 215.0, valor: 215000.0 },
            { mes: "Abr", valorK: 116.9, valor: 116900.0 }
        ]
    }));
});

// 10. Buscar orçamentos gravados (Simulação Ramsons SL1/WSWEBORC)
app.get('/api/buscarorcamentos', (req, res) => {
    const busca = (req.query.busca || '').toLowerCase();
    const orcamentos = [
        {
            numero: "000001",
            cliente: "000001 - Cliente Exemplo Ltda",
            vendedor: "000001 - Vendedor Teste Principal",
            data: "27/09/2026",
            valorTotal: 1549.90,
            situacao: "RESERVA_AGUARD_FATURAMENTO"
        },
        {
            numero: "000002",
            cliente: "000002 - João da Silva",
            vendedor: "000002 - Vendedor Carlos Silva",
            data: "26/09/2026",
            valorTotal: 350.00,
            situacao: "ABERTO"
        },
        {
            numero: "000003",
            cliente: "000001 - Cliente Exemplo Ltda",
            vendedor: "V001 - Vendedor João Comissado",
            data: "25/09/2026",
            valorTotal: 1200.00,
            situacao: "FATURADO"
        }
    ];

    if (!busca) {
        return res.status(200).send(JSON.stringify({ success: true, orcamentos: orcamentos }));
    }

    const filtrados = orcamentos.filter(o =>
        o.numero.toLowerCase().includes(busca) ||
        o.cliente.toLowerCase().includes(busca) ||
        o.vendedor.toLowerCase().includes(busca)
    );

    res.status(200).send(JSON.stringify({ success: true, orcamentos: filtrados.length > 0 ? filtrados : orcamentos }));
});

// 11. Validate structure endpoint
app.post('/api/validar-estrutura', (req, res) => {
    res.status(200).send(JSON.stringify({ status: "OK", structureValid: true }));
});

// 11. Send structure report endpoint
app.post('/api/relatorio-estrutura/email', (req, res) => {
    console.log('Relatório de estrutura recebido:', req.body);
    res.status(200).send(JSON.stringify({ success: true, message: "Relatório enviado com sucesso" }));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`==================================================`);
    console.log(` GoVendas Protheus Mock Server running on port ${PORT}`);
    console.log(`==================================================`);
});
