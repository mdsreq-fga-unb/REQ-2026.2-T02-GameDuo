# REQ-2026.2-T02-GameDuo
Repositório de projeto da disciplina de REQ-T2 - 2026.2.

## Como rodar o projeto

O GameDuo tem duas partes que rodam juntas:

- `back/`: API em Laravel (PHP)
- `front/`: Front (React)

### 1. Instale 

- **PHP 8.4.1 ou mais novo** e **Composer**.
- **Node.js 20 ou mais novo** .

### 2. Configure o backend (só na primeira vez)

```bash
cd back
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
```

Abra o `back/.env` e preencha `DB_PASSWORD` com a senha do banco (Supabase). Peça a senha para alguém da equipe. Depois rode:

```bash
php artisan migrate
```

### 3. Instale o frontend (só na primeira vez)

```bash
cd front
npm install
```

### 4. Rode (sempre)

Abra **dois terminais**:

```bash
# Terminal 1: backend
cd back
php artisan serve
```

```bash
# Terminal 2: frontend
cd front
npm run dev
```


