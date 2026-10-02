# GoVendas-aplicativo-Android-com-integracao-ao-Protheus---Totvs


# GoVendas

Projeto Android nativo para vendas, orçamentos, garantia, seguro e integração REST para TOTVS Protheus.

---

## 🚀 Guia de Configuração e Execução

Este guia está dividido em duas partes:
1. **Ambiente de Teste Mocado (Node.js - Mock Server)** para testes rápidos sem depender de um Protheus real.
2. **Ambiente de Produção (TOTVS Protheus REST)** com dados reais diretamente do ERP.

---

## 🛠️ PARTE 1: Configuração do Ambiente de Teste Mocado (Node.js)

O repositório inclui um servidor mock em **Node.js** (`mock-server/server.js`) que simula todas as APIs REST do Protheus (clientes, produtos, vendedores, faturamento, numeração automática e métricas).

### Pré-requisitos
- Node.js instalado na máquina (versão 16+ recomendada).

### Passo a Passo para Iniciar o Mock Server:
1. Abra um terminal na pasta do projeto e navegue até o diretório do servidor mock:
   ```bash
   cd mock-server
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor mock:
   ```bash
   npm start
   ```
   *(O servidor rodará por padrão na porta `3000` em `http://localhost:3000` ou `http://10.0.2.2:3000` para emuladores Android).*

### Configurando o Aplicativo Android para o Mock Server:
1. Abra o app **GoVendas** no Android Studio / Emulador ou Dispositivo Mobile.
2. Acesse a tela de **Configuração** (ícone de engrenagem).
3. Preencha a URL base com o endereço do mock server (ex: `http://10.0.2.2:3000` no emulador ou `http://<SEU_IP>:3000` no celular físico).
4. Clique em **Testar Conexão** e em **Salvar**.

### Códigos de Teste Disponíveis no Mock:
- **Clientes**: `000001` (Cliente Exemplo Ltda) | `000002` (João da Silva)
- **Vendedores**: `000001` (Vendedor Teste Principal) | `000002` (Carlos Silva)
- **Produtos**: `PROD01`, `PROD02`, `PROD03`, `PROD04`

---

## 🏢 PARTE 2: Configuração do Ambiente de Produção (TOTVS Protheus REST)

Para conectar o aplicativo GoVendas a um servidor **TOTVS Protheus** de produção/homologação e utilizar dados reais do banco de dados, siga os passos abaixo:

### Passo 1: Configurar o arquivo `appserver.ini` do Protheus
Adicione as seções HTTPREST e HTTPURI no arquivo `appserver.ini` do AppServer Protheus:
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
*(Reinicie o serviço do AppServer após alterar o `appserver.ini`).*

### Passo 2: Compilar o Código ADVPL (`WSGOVENDAS.PRW`)
1. Abra o **TOTVS Developer Studio (TDS)** ou **VS Code com extensão AdvPL/TL++**.
2. Importe o arquivo fonte `protheus-advpl/WSGOVENDAS.PRW` para o repositório (RPO) da empresa.
3. Compile o fonte `WSGOVENDAS.PRW`. Este fonte gerencia os seguintes endpoints REST nativos:
   - `POST /api/auth/login` (Autenticação de usuários)
   - `POST /api/vendas/teste-conexao` (Teste de comunicação)
   - `GET /api/orcamentos/proximo-numero` (Numeração sequencial `GetSxBNum` para `SL1` para orçamento e `SC5` para pedido de vendas)
   - `GET /api/clientes` (Consulta e cadastro na tabela `SA1010`)
   - `GET /api/produtos` (Consulta unificada `SB1010` + `SB0010` + `SB2010`)
   - `GET /api/vendedores` (Consulta na tabela `SA3010`)
   - `GET /api/administradoras` (Consulta na tabela `SAE010`)
   - `GET /api/ceplocal` (Consulta de CEP na tabela `JC2010`)
   - `GET /api/dashboard/metricas` (Métricas de Vendas Hoje, Mês, YoY e Evolução 12 Meses nas tabelas `SL1010` e `SC5010`)
   - `POST /api/pedidos` (Gravação de Orçamentos `SL1/SL2/SL4` com Ponto de Entrada `LJ7001` ou Pedidos de Venda `SC5/SC6` com Pontos de Entrada `MATA410`, `M410MNT`, `M410TTS`).

### Passo 3: Configurar o Aplicativo Android para Produção
1. Abra o app **GoVendas** no dispositivo Android.
2. Abra a tela de **Configuração do Ambiente REST** (engrenagem).
3. Preencha os campos com os dados do servidor Protheus:
   - **IP ou domínio**: O IP fixo do servidor Protheus (ex: `192.168.0.177`).
   - **Porta**: `8080` (conforme definido no `appserver.ini`).
   - **Nome do ambiente**: Nome da seção do ambiente (ex: `REST` ou `PROD`).
   - **Usuário Totvs** e **Senha Totvs** (credenciais de acesso).
   - **E-mail de Incidentes**: E-mail para onde o sistema enviará relatórios em caso de falhas de estrutura ou banco.
4. Clique em **Testar Conexão** e em **Salvar**.

---

## 📱 Como Executar o Projeto no Android Studio

1. Abra o `GoVendas`.
2. Simule uma Venda 
