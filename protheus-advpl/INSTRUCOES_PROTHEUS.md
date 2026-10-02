# Guia de Configuração do Protheus REST (Opção B)

Este guia explica como integrar o aplicativo Android **GoVendas** com um ambiente TOTVS Protheus de testes/homologação/produção para gravação real nas tabelas do ERP (**SL1/SL2/SL4** para Orçamentos Loja ou **SC5/SC6** para Pedidos de Venda).

---

## 1. Configurar o arquivo `appserver.ini` do Protheus

Adicione a seção REST no arquivo `appserver.ini` do seu servidor Protheus:

```ini
[HTTPREST]
Enable=1
Port=8080
IPsBind=
URIs=HTTPURI
Security=0

[HTTPURI]
URL=/
Instances=2,10
PrepareIn=99,01
```

---

## 2. Compilar o Código ADVPL (`WSGOVENDAS.PRW`)

1. Abra o **TOTVS Developer Studio (TDS)** ou **VS Code com extensão AdvPL/TL++**.
2. Adicione o arquivo `WSGOVENDAS.PRW` (localizado em `protheus-advpl/WSGOVENDAS.PRW`) ao seu RPO (Repository).
3. Compile o programa `WSGOVENDAS.PRW`.
4. Reinicie o serviço do AppServer do Protheus.

---

## 3. Conectar o Aplicativo GoVendas ao Protheus

1. No aplicativo **GoVendas**, abra a tela de **Configuração do Ambiente REST** (botão de engrenagem no canto superior direito).
2. Preencha:
   - **IP ou domínio**: O IP do servidor onde o Protheus AppServer está rodando (ex: `192.168.0.100`).
   - **Porta**: `8080` (ou a porta definida no `appserver.ini`).
   - **Nome do ambiente**: Nome da seção do ambiente (ex: `REST` ou `P12`).
   - **Usuário Totvs**: Seu usuário do Protheus (ex: `admin`).
   - **Senha Totvs**: Sua senha do Protheus.
3. Clique em **Testar Conexão**. O aplicativo enviará uma requisição para `http://<IP>:8080/api/vendas/teste-conexao`.
4. Clique em **Salvar**.

---

## 4. Testar a Gravação nas Tabelas do Protheus (Orçamento vs Pedido de Venda)

- Abra a tela de **Orçamento / Pedido** no app GoVendas.
- Selecione o **Tipo de Operação**:
  - **Orçamento Loja**: O app envia a estrutura JSON contendo os nós `sl1`, `sl2` e `sl4`. O código ADVPL grava via `RecLock` nas tabelas:
    - **SL1**: Cabeçalho do Orçamento (`L1_FILIAL`, `L1_NUM`, `L1_CLIENTE`, `L1_VLRTOT`).
    - **SL2**: Itens do Orçamento (`L2_FILIAL`, `L2_NUM`, `L2_ITEM`, `L2_PRODUTO`, `L2_QUANT`, `L2_VRUNIT`, `L2_LOCAL`).
    - **SL4**: Forma de Pagamento (`L4_FILIAL`, `L4_NUM`, `L4_FORMA`, `L4_VALOR`).
  - **Pedido de Venda**: O app envia a estrutura contendo os nós `sc5` e `sc6`. O código ADVPL grava via `RecLock` nas tabelas:
    - **SC5**: Cabeçalho do Pedido de Venda (`C5_FILIAL`, `C5_NUM`, `C5_CLIENTE`, `C5_LOJA`, `C5_VALOR`).
    - **SC6**: Itens do Pedido de Venda (`C6_FILIAL`, `C6_NUM`, `C6_ITEM`, `C6_PRODUTO`, `C6_QTDVEN`, `C6_PRCVEN`, `C6_LOCAL`).

---

## 5. Suporte a Pontos de Entrada (`LJ7001` e `MATA410`)

O web service `WSGOVENDAS.PRW` possui checagem dinâmica de Pontos de Entrada:
- **Orçamento Loja**: Aciona o Ponto de Entrada **`LJ7001`** (`ExecBlock("LJ7001", .F., .F., { cNumPed, cFilial, oSL1, aSL2, aSL4 })`).
- **Pedido de Venda**: Aciona os Pontos de Entrada do Faturamento **`MATA410`**, **`M410MNT`** e **`M410TTS`** para regras de validação e gravação nativa de pedidos.
