# Shortener Link API

Essa API tem como objetivo encurtar urls, foi feita com o framework NestJS e utiliza o banco de dados PostgreSQL.

## Instalação

1. Clone o repositório
2. Rode `pnpm install` para instalar as dependências
3. Crie um arquivo `.env` com as variáveis de ambiente (veja o exemplo em `.env.example`)
4. Rode `pnpm migrate` para criar as tabelas no banco de dados
5. Rode `pnpm build` para compilar o projeto
6. Rode `pnpm start:dev` para iniciar a API em modo de desenvolvimento

## Rotas

### POST /auth/register

Cria um novo usuário

* Corpo da requisição:
	+ email: string
	+ password: string
* Resposta:
	+ access_token: string

### POST /auth/login

Faz o login de um usuário

* Corpo da requisição:
	+ email: string
	+ password: string
* Resposta:
	+ access_token: string

### POST /url-shortener

Encurta uma url

* Corpo da requisição:
	+ urlOriginal: string
* Resposta:
	+ urlShort: string

### GET /url-shortener/:id

Retorna uma url encurtada pelo id

* Resposta:
	+ urlShort: string

### PATCH /url-shortener/:id

Edita uma url encurtada pelo id

* Corpo da requisição:
	+ novaUrl: string
* Resposta:
	+ urlShort: string

### DELETE /url-shortener/:id

Deleta uma url encurtada pelo id

* Resposta:
	+ mensagem de sucesso

## Variáveis de ambiente
ENV_PORT=3000
JWT_SECRET=secret
CODE_LENGTH=6
URL=http://localhost:3000

DATABASE_URL=${DATABASE_URL}

## Tecnologias utilizadas

* NestJS
* PrismaORM
* PostgreSQL
* JWT
* bcrypt

## Testes

* Rode `pnpm test` para rodar os testes
