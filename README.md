# Jello 🚀

Aplicação de quadro de gestão visual inspirada no Trello, desenvolvida em Angular, com foco em organização de tarefas por colunas, cartões, responsáveis e palavras-chave.

## ✨ Visão geral

O Jello simula um fluxo de trabalho em etapas, com colunas como:

- Backlog
- Refinamento
- Desenvolvimento
- Desenvolvido
- Teste de qualidade
- Produção
- Pós prod smoke test

A interface foi pensada para ser simples, visualmente clara e com interações de mouse próximas ao comportamento real de ferramentas de gestão de projetos.

## 🏗️ Escolhas de arquitetura

Este projeto usa Angular 22 com componentes standalone e sinais reativos para manter o estado do quadro organizado e fácil de evoluir.

### Principais decisões:

- Angular standalone components: reduz acoplamento e facilita reutilização de blocos visuais.
- Signals: centralizam a leitura e atualização do estado do board e dos usuários.
- Separação de responsabilidades:
  - serviço central para dados e mutações
  - componente de board para orquestração
  - lista por coluna para criação e drag/drop
  - cartão para renderização e ações individuais
- Dados mockados em JSON: permite simular a aplicação sem depender de backend externo.

## 📁 Organização de pastas

```text
src/
├── app/
│   ├── core/
│   │   ├── models/          # interfaces do domínio (User, Card, Board, etc.)
│   │   └── services/        # BoardService com estado e mutações
│   ├── features/
│   │   └── board/           # board, listas e orquestração da UI
│   └── shared/
│       └── components/
│           ├── avatar/      # avatar do usuário
│           └── card/        # cartão individual
├── assets/
│   └── data/
│       └── fakedb.json     # dados iniciais do projeto
└── styles.css              # estilos globais
```

## ⚙️ Requisitos

Antes de começar, tenha instalado em sua máquina:

- Node.js 18+
- npm
- Angular CLI (opcional, mas recomendado)

## 🚀 Como baixar e instalar

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd jello
```

2. Instale as dependências:

```bash
npm install
```

## ▶️ Como subir localmente

Para iniciar o projeto em modo de desenvolvimento:

```bash
npm start
```

ou, se preferir usar o Angular CLI diretamente:

```bash
ng serve
```

Depois, abra no navegador:

```text
http://localhost:4200/
```

> O projeto também pode rodar em outra porta, dependendo da configuração do ambiente local.

## 🧩 Como usar a aplicação

### 1. Navegar pelo quadro

- Visualize as colunas do processo em sequência.
- Role a área da coluna para ver todos os cartões quando houver muitos itens.
- Use o mouse para arrastar cartões entre colunas.

### 2. Criar um novo cartão

- Clique em “Adicionar cartão” no rodapé da coluna desejada.
- Abra o modal de criação.
- Informe o título, escolha palavras-chave e defina o responsável.
- Confirme para criar o cartão.

### 3. Editar um cartão

- Clique no botão de edição do cartão.
- No modal, ajuste:
  - título
  - palavras-chave
  - responsável
- Salve as alterações.

### 4. Excluir um cartão

- Clique no botão de exclusão do cartão.
- O item será removido imediatamente da coluna.

### 5. Mover cartões

- Clique e arraste o cartão para outra coluna.
- A ação atualiza a organização visual do quadro em tempo real.

### 6. Definir responsável

- Use o seletor de responsável dentro do cartão ou no modal de edição.
- Cada cartão pode ter um responsável atribuído, como Ana, Bruno ou outros perfis disponíveis.

## 🧠 Fluxo básico da experiência

```text
Acesso ao quadro
  ↓
Revisa backlog e refinamento
  ↓
Move cards para desenvolvimento
  ↓
Atualiza status conforme progresso
  ↓
Valida qualidade e produção
  ↓
Confirma smoke test pós produção
```

## 🛠️ Build de produção

Para gerar a versão final otimizada:

```bash
npm run build
```

Os artefatos serão gerados na pasta `dist/`.

## 📌 Observações finais

Este projeto foi estruturado para ser um MVP funcional de quadro Kanban/Trello, com foco em usabilidade real, organização visual e manipulação direta com o mouse.

Se quiser evoluir ainda mais, os próximos passos naturais são:

- persistência em backend
- drag and drop mais refinado
- filtros por responsável ou label
- criação de checklist e comentários

---

Feito com ❤️ para organização visual de trabalho em equipe.
