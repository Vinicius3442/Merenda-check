# 🚀 Merenda-Check

> **GovTech de Alta Fidelidade para Rastreabilidade, Controle e Auditoria da Merenda Escolar.**
> Um ecossistema completo e inteligente alinhado às diretrizes do PNAE (Programa Nacional de Alimentação Escolar) para garantir a qualidade, segurança e conformidade da alimentação pública.

---

## 💻 Sobre o Projeto

O **Merenda-Check** é um portal unificado de monitoramento e auditoria que conecta merendeiras, nutricionistas, gestores escolares, fiscais de contrato, fornecedores e os próprios cidadãos. O projeto utiliza um design de ponta com **Estética Premium (Dark Theme, Glassmorphism, HSL tailord cores e micro-animações)** para transformar a gestão governamental em uma experiência moderna e extremamente responsiva.

A plataforma integra regras robustas de negócios com o banco de dados do **Supabase (PostgreSQL)**, oferecendo fluxos offline-resilientes de autenticação, rastreabilidade ponta a ponta e controle patrimonial com alertas automáticos contra desperdício e fraudes.

---

## 🎭 Perfis e Funcionalidades (IAM)

O sistema possui uma estrutura completa de **Controle de Acesso Baseado em Perfis (RBAC)**. Abaixo estão as telas e caminhos de cada ator da rede:

### 1. 🛠️ Administrador (SysAdmin / TI)
*   **Gestão de Identidades (IAM):** Cadastro de servidores, alteração de atribuições (roles) e reset de credenciais com geração automática de senhas provisórias.
*   **Trilha de Auditoria (Audit Trail):** Registro de logs imutáveis de ações críticas do sistema para conformidade com a LGPD e fiscalização do Tribunal de Contas.
*   *Rotas:* `/admin`, `/admin/audit-ti`

### 2. 🥦 Nutrição (PNAE)
*   **Planejamento de Cardápios:** Criação de cronogramas alimentares por semana e por escola, balanceando macronutrientes.
*   **Fichas Técnicas Digitais:** Tabela TACO integrada para busca de alimentos, composição calórica e gramaturas específicas por faixa etária de alunos.
*   *Rotas:* `/nutricao`, `/nutricao/cardapios`, `/nutricao/fichas`

### 3. 📦 Gestor de Escola (Diretoria / Almoxarifado)
*   **Controle de Estoque Físico:** Inventário em tempo real de lotes com alertas visuais de vencimento e consumo urgente.
*   **Análise de Romaneios:** Rastreamento de lotes e exportação de relatórios em PDF de auditoria.
*   *Rotas:* `/gestor`, `/gestor/estoque`, `/gestor/relatorios`

### 4. 🕵️ Auditor Fiscal
*   **Investigação de Alertas:** Triagem de desvios, como sobram de alimentos não justificadas, entrega atrasada ou perda de temperatura na cadeia fria.
*   **Rastreabilidade Criptográfica:** Consulta ao código hash do lote desde a fazenda de agricultura familiar até o prato do aluno.
*   *Rotas:* `/auditor`, `/auditor/escolas`, `/auditor/rastrear`, `/auditor/investigar`

### 5. 🍳 Operador de Cozinha (Merendeiras)
*   **Conferência Visual:** Interface simplificada para entrada de novos insumos por QR Code ou leitura visual de lotes.
*   **Refeições Servidas:** Registro rápido do total de pratos servidos por turno e o peso da "sobra limpa" (desperdício prato-resto).
*   *Rotas:* `/operador`, `/operador/entrada`, `/operador/baixa`, `/operador/refeicao`, `/operador/sobra`

### 6. 🚚 Transportadora (Operador Logístico)
*   **Emissão de Guia de Transporte:** Geração de códigos e lotes de remessa vinculados aos contratos de licitação vigentes.
*   *Rotas:* `/transportadora`, `/transportadora/emitir-lote`

### 7. ⚖️ Licitação e Contratos
*   **Controle de Empenhos:** Gráficos interativos do saldo financeiro restante de cada fornecedor homologado.
*   *Rotas:* `/licitacao`, `/licitacao/fornecedores`

### 8. 🏛️ Portal da Transparência & Totem (Cidadão / Aluno)
*   **Controle Social (Público):** Portal livre de login para pais e cidadãos consultarem o cardápio do dia e gastos públicos.
*   **Ouvidoria da Merenda:** Canal direto para denúncia ou elogio com fotos de pratos.
*   **Totem de Satisfação (Kiosk):** Interface para o aluno na escola avaliar o sabor da refeição com smiles interativos.
*   *Rotas (Sem Login):* `/transparencia`, `/ouvidoria`, `/kiosk`

---

## 🛠️ Tecnologias Utilizadas

### Frontend
*   **React 18** + **Vite** (Fast Refresh e Builds otimizados).
*   **React Router DOM v6** para roteamento dinâmico e proteção hierárquica.
*   **CSS Dinâmico & Custom HSL System:** Layouts com variáveis nativas que proporcionam temas harmoniosos e cantos arredondados suavizados, sem a necessidade de frameworks volumosos de terceiros.
*   **FontAwesome v6** para ícones vetoriais.

### Backend / Banco de Dados
*   **Supabase (PostgreSQL)** como serviço de infraestrutura (BaaS).
*   **Row-Level Security (RLS)** nas tabelas cruciais, protegendo os dados governamentais de vazamentos.
*   **PostgREST** nativo para consultas assíncronas e junções relacionais eficientes (`select(escola:escolas(*))`).

---

## 📦 Como Instalar e Rodar Localmente

### Pré-requisitos
Certifique-se de possuir o [Node.js (versão 18+)](https://nodejs.org/) instalado em seu computador.

### Passo 1: Clonar o Repositório e Instalar Dependências
```bash
# Entre na pasta do projeto
cd Merenda-check-main

# Instale os pacotes necessários
npm install
```

### Passo 2: Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto (use o arquivo `.env.example` como base) e preencha com as credenciais do seu projeto Supabase:
```env
VITE_SUPABASE_URL=https://seu-subdominio-supabase.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica-gerada-pelo-supabase
```

### Passo 3: Configurar o Banco de Dados (Supabase)
1. Acesse o painel do seu **Supabase**.
2. Vá até a seção **SQL Editor**.
3. Clique em **New query** (Nova consulta) e cole todo o conteúdo do arquivo localizado em `supabase/schema.sql`.
4. Execute o script clicando em **Run**.
*(Isso criará as tabelas de `usuarios`, `escolas`, `estoque`, `movimentacoes`, `refeicoes`, `alertas` e `cardapios` com todas as políticas RLS e dados iniciais de demonstração necessários).*

### Passo 4: Rodar o Servidor de Desenvolvimento
```bash
npm run dev
```
O console exibirá o link local (geralmente `http://localhost:5173`). Abra o seu navegador e acesse a plataforma!

---

## 🔑 Contas de Demonstração (Logins)

Ao executar o script `supabase/schema.sql`, os dados estruturais e as escolas de demonstração são inseridos. Para realizar os logins, crie as contas correspondentes no painel **Supabase Auth Dashboard** (ou utilize os emails abaixo no formulário de login; o sistema se encarregará de auto-vincular o `auth_id` no primeiro acesso):

| Perfil | E-mail Padrão | Senha Padrão recomendada | Função no Sistema |
| :--- | :--- | :--- | :--- |
| **Administrador (SysAdmin)** | `admin@merendacheck.gov.br` | *Sua Senha do Supabase Auth* | Gerenciar usuários e ver logs |
| **Nutricionista** | `nutricao@merendacheck.gov.br` | *Sua Senha do Supabase Auth* | Fichas técnicas e cardápios |
| **Gestor Escolar** | `gestor@merendacheck.gov.br` | *Sua Senha do Supabase Auth* | Gerir estoque da escola |
| **Auditor Fiscal** | `auditor@merendacheck.gov.br` | *Sua Senha do Supabase Auth* | Investigar desvios e rastrear |
| **Operador de Cozinha** | `operador@merendacheck.gov.br` | *Sua Senha do Supabase Auth* | Lançar sobras e pratos servidos |

---

## 🛡️ Resiliência e Engenharia do Projeto

Durante a última fase de desenvolvimento, aplicamos práticas de engenharia de software para garantir que o protótipo funcione de forma suave e à prova de falhas:

1.  **Resiliência no Loop de Autenticação (`AuthContext.jsx`):** O sistema possui um mecanismo inteligente de auto-vínculo de perfis. No primeiro login de um usuário cadastrado no Supabase Auth, o sistema detecta seu e-mail, realiza a associação do `auth_id` no banco e, caso haja qualquer bloqueio de RLS no momento da inserção, estabelece um **fallback automático em memória na sessão local**. Isso impede o loop infinito de redirecionamentos de login.
2.  **Proteção contra Travamentos (Crash Shielding):** A renderização de iniciais do usuário no topo da tela e nos cards foi blindada. Se o nome cadastrado for nulo ou inválido, o sistema injeta a sigla genérica `"??"` impedindo erros críticos de JavaScript.
3.  **Tabelas Premium e Responsivas (`.table-wrapper` & `.text-nowrap`):** Todas as grades do sistema foram padronizadas. Os botões de ações não quebram de linha em telas de laptops comuns de 1366px, permanecendo alinhados perfeitamente na horizontal sem esmagar as células da tabela.
4.  **Fichas Técnicas Flexíveis (`.responsive-form-grid`):** O grid de gramaturas colapsa perfeitamente de 3 colunas (desktop) para 1 coluna vertical (mobile), garantindo conforto de digitação para a equipe de nutrição.
