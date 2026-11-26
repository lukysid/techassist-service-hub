# TechAssist Service Hub

Sistema web para gerenciamento de uma assistência técnica de informática, desenvolvido com React, TypeScript, TanStack Router e TanStack Query.

## Integração com a API Technoworks

O projeto usa a API REST educacional Technoworks como armazenamento remoto. Os registros são enviados para a coleção do RA configurado e separados logicamente pelo campo `tipo`:

- `cliente`: cadastro de clientes.
- `ordem`: ordens de serviço.

A API retorna os IDs dos documentos criados; o TechAssist utiliza esses IDs nas consultas, atualizações e exclusões. A listagem recebe os documentos da coleção e filtra cada tipo no frontend.

### Configuração local

1. Copie `.env.example` para `.env.local`.
2. Abra `.env.local`.
3. Substitua `SEU_RA` pelo seu Registro Acadêmico.

```env
VITE_API_URL=https://technoworks.com.br
VITE_TECHNOWORKS_RA=SEU_RA
```

O arquivo `.env.local` é ignorado pelo Git. Não coloque senhas, tokens ou outros segredos em variáveis `VITE_*`, pois elas são disponibilizadas ao navegador.

Se o RA não estiver configurado, o projeto utiliza o armazenamento local de demonstração (`mock-store`).

### Operações implementadas

| Área | Operações |
| --- | --- |
| Clientes | Listar, cadastrar e excluir (não permite excluir cliente com OS vinculada) |
| Ordens de serviço | Listar, cadastrar, alterar status e excluir |
| Dashboard | Indicadores calculados a partir das consultas de clientes e ordens |

### Endpoints usados

- `GET /rest/{ra}?limite=100`
- `POST /rest/{ra}`
- `PATCH /rest/{ra}/{id}`
- `DELETE /rest/{ra}/{id}`

O frontend interpreta o envelope JSON da API pelo campo `dados`. Não utilize `DELETE /rest/{ra}`, pois esse endpoint apaga todos os registros do RA.

### Observações

- O endpoint de listagem retorna até 100 registros por chamada conforme o limite solicitado.
- O RA identifica o espaço de dados do aluno; não é uma senha ou mecanismo de autenticação.
- A integração depende de a API permitir chamadas do navegador (CORS). Se o navegador bloquear a chamada, será necessário ajustar a configuração do servidor da API.
- A integração remota precisa ser testada com o RA do aluno no ambiente local.

## Desenvolvimento

Requer Node.js e npm.

```sh
npm install
npm run dev
``

Para validar a compilação:

```sh
npm run build
``

This project was built with [Lovable](https://lovable.dev).
