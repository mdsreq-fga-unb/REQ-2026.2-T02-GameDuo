# GameDuo — Backend

Estrutura inicial em PHP com Laravel.

## Executar localmente

Dentro da pasta `back`:

```bash
composer install
```

Na primeira configuração, caso ainda não exista um `.env`:

```bash
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
```

Inicie o servidor:

```bash
php artisan serve
```

Acesse http://127.0.0.1:8000. A rota inicial retorna uma mensagem JSON.

Também é possível iniciar com `composer dev`. Não é necessário instalar Node ou npm.

## Testes

```bash
php artisan test
```

Login, cadastro, recuperação de senha e CRUD ainda não foram implementados.

## Organização do código

A organização segue as pastas do backend de referência `novowscpf`, adaptada
para Laravel 13. A raiz da aplicação continua sendo `back/`.

```text
app/
├── Console/              # Comandos personalizados
├── Exceptions/           # Exceções personalizadas
├── Helpers/              # Funções auxiliares
├── Http/
│   ├── Controllers/
│   │   └── Api/          # Controllers dos endpoints da API
│   ├── Middleware/       # Filtros de requisições
│   └── Requests/         # Validação dos dados recebidos
├── Models/               # Modelos e relacionamentos do banco
├── Providers/            # Registro de serviços e interfaces
├── Repositories/         # Consultas e persistência dos dados
├── Services/
│   └── Classes/          # Implementações das regras de negócio
├── Utils/                # Utilitários gerais
└── library/              # Integrações com serviços externos
routes/
├── api.php               # Endpoints com prefixo /api
├── web.php               # Rota inicial
└── console.php           # Rotas de comandos do console
```

As interfaces de serviços podem ficar em `app/Services`, com suas implementações
em `app/Services/Classes`, seguindo a referência. Os arquivos `.gitkeep` mantêm
as pastas vazias no Git e podem ser removidos quando elas receberem código.

A rota `GET /api` retorna uma mensagem JSON para verificar a API.
As futuras rotas de autenticação e CRUD serão definidas em `routes/api.php`.
Ainda não há autenticação ou regras de negócio implementadas.

O projeto de referência utiliza Laravel 7. No Laravel 13, o registro das rotas,
middlewares e tratamento de exceções fica em `bootstrap/app.php`; não é necessário
copiar os antigos arquivos `Kernel.php` ou `Handler.php`. As migrations ficam em
`database/migrations` e os seeders em `database/seeders`.

O conteúdo de `novowscpf-develop/` é apenas referência e não faz parte da execução
do GameDuo. Nenhum código de negócio, credencial ou dependência dele foi copiado.
