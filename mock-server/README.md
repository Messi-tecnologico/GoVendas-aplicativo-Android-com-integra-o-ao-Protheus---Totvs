# GoVendas Protheus Mock REST Server

Este servidor simula o backend Protheus REST para testes locais do aplicativo **GoVendas**.

## Como executar:

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado no seu computador.
2. Abra o terminal na pasta `mock-server/` e instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```

## Como conectar o aplicativo GoVendas:

1. Descubra o IP local do seu computador na rede (ex: `192.168.x.x` ou `10.0.2.1` se estiver usando o emulador Android).
2. No aplicativo GoVendas, abra a tela de **Configuração do Ambiente REST** (botão de engrenagem no canto superior direito).
3. Preencha:
   - **IP ou domínio**: O IP do seu computador (ex: `192.168.x.x`).
   - **Porta**: `8080`.
   - **Nome do ambiente**: `REST`.
   - **Usuário Totvs**: `admin`.
   - **Senha Totvs**: `admin`.
4. Clique em **Testar Conexão** e depois salve.
5. Faça o login e teste os pedidos, orçamentos e relatórios!
