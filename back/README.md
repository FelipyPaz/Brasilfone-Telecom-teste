# login-exemple-backend

## Instalação

Para executar o projeto em ambiente de desenvolvimento, com o [docker](https://www.docker.com/) instalado em sua máquina, execute o comando `docker-compose up`.

Caso não possua o docker, instale os pacotes do projeto e execute o script `dev`.

```cmd
npm install
npm run dev
```

Para testar os endpoints, utilize o cliente HTTP [Insomnia](https://insomnia.rest/).

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=login-exemple&uri=https%3A%2F%2Fraw.githubusercontent.com%2FCaioOliveira793%2Flogin-exemple-backend%2Fmaster%2FInsomnia.json)

## Documentação

### Rotas da aplicação

Método | Rota | Descrição
-------|------|----------
POST | session | faz o login de um usuário
POST | users | cria um usuário

