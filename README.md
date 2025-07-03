# CRUD de Usuários com Autenticação (TypeScript, Node.js, React, PostgreSQL)

## Descrição
Aplicação web completa com autenticação de usuários, manutenção de senhas, operações CRUD (Tarefas), e integração com banco de dados PostgreSQL. Backend em Node.js/Express/Prisma, frontend em React/TypeScript.

## Repositório
[https://github.com/d-broder/crud-usuarios-typescript](https://github.com/d-broder/crud-usuarios-typescript)

## Requisitos
- Node.js 18+
- PostgreSQL 13+

## Instalação e Execução

### 1. Clone o repositório
```bash
# No terminal
git clone https://github.com/d-broder/crud-usuarios-typescript.git
cd crud-usuarios-typescript
```

### 2. Configure o banco de dados
- Crie um banco PostgreSQL local (ex: `postgres`).
- Edite o arquivo `backend/.env` com sua string de conexão:
  ```
  DATABASE_URL="postgresql://usuario:senha@localhost:5432/postgres"
  JWT_SECRET="sua_chave_jwt_super_secreta"
  ```

### 3. Instale as dependências
```bash
cd backend
npm install
cd ../frontend
npm install
```

### 4. Crie as tabelas do banco
No diretório `backend`, execute:
```bash
npx prisma migrate dev --name init
```

### 5. Gere o Prisma Client
```bash
npx prisma generate
```

### 6. Inicie o backend
```bash
cd backend
npm run dev
```
O backend rodará em `http://localhost:3001`.

### 7. Inicie o frontend
```bash
cd frontend
npm run dev
```
O frontend rodará em `http://localhost:5173`.

## Usuário Administrador Inicial
Crie manualmente um usuário admin no banco:
1. Gere um hash bcrypt para a senha desejada:
   ```js
   // No terminal interativo Node.js
   require('bcrypt').hashSync('suaSenha', 10)
   ```
2. Insira no banco:
   ```sql
   INSERT INTO "Usuario" ("Username", "Password", "Nome", "Tipo", "Status", "Quant_Acesso", "Tentativas_Erro")
   VALUES ('admin', '<hash>', 'Administrador', '0', 'A', 0, 0);
   ```

## Funcionalidades
- Cadastro e login de usuários (apenas admin cadastra)
- Alteração e recuperação de senha (simulado)
- CRUD de tarefas (criar, listar, editar, excluir)
- Bloqueio automático após 3 tentativas inválidas
- Controle de acessos

## Scripts úteis
- Script SQL para criar tabela: [`backend/scripts/create_table_usuarios.sql`](backend/scripts/create_table_usuarios.sql)

## Observações
- O sistema segue todos os requisitos do exercício.
- Para dúvidas, consulte o código ou abra uma issue.
