# Деплой на Beget VPS (Ubuntu)

## 1. Подключение

```bash
ssh root@ВАШ_IP
```

## 2. Установка софта

```bash
apt update && apt upgrade -y
apt install -y git nginx curl

# Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# pnpm
npm install -g pnpm

# Docker (для PostgreSQL)
apt install -y docker.io docker-compose-v2
systemctl enable --now docker
```

## 3. Загрузка проекта

**Вариант А — git:**
```bash
cd /var/www
git clone https://github.com/ВАШ_РЕПО/orenrtisnab.git
cd orenrtisnab
```

**Вариант Б — с компьютера (из папки проекта на Windows):**
```powershell
scp -r C:\orenrtisnab root@ВАШ_IP:/var/www/orenrtisnab
```

На сервере:
```bash
cd /var/www/orenrtisnab
```

## 4. PostgreSQL

```bash
# Смените пароль в docker-compose.yml перед продом!
docker compose up -d
```

## 5. Файл .env

```bash
cp .env.example .env
nano .env
```

Пример для **старта по IP** (замените `31.129.103.174` на ваш):

```env
NODE_ENV=production
PORT=3001

SERVER_IP=31.129.103.174
MAIN_DOMAIN=orenrtisnab.ru
ADMIN_SUBDOMAIN=admin.orenrtisnab.ru

DATABASE_URL=postgresql://orenrtisnab:СИЛЬНЫЙ_ПАРОЛЬ@localhost:5432/orenrtisnab

JWT_SECRET=случайная_строка_минимум_32_символа_xxxxxxxx
ADMIN_USERNAME=admin
ADMIN_PASSWORD=надёжный_пароль_12_символов

VITE_YANDEX_METRIKA_ID=
```

> `SERVER_IP` — чтобы сайт открывался по `http://IP` до подключения домена.

## 6. Сборка и запуск

```bash
pnpm install
pnpm build
```

Автозапуск через pm2:
```bash
npm install -g pm2
pm2 start "pnpm start" --name orenrtisnab
pm2 save
pm2 startup
```

Проверка:
```bash
curl -I http://127.0.0.1:3001
```

## 7. Nginx (порт 80 → приложение)

```bash
nano /etc/nginx/sites-available/orenrtisnab
```

Скопируйте содержимое из `deploy/nginx.conf` (для старта по IP — раскомментируйте блок «Этап 1»).

```bash
ln -sf /etc/nginx/sites-available/orenrtisnab /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

Откройте в браузере: **http://31.129.103.174**

## 8. Подключение домена orenrtisnab.ru

**Полная инструкция:** [`deploy/domain-setup.md`](domain-setup.md)

Кратко:

1. **reg.ru** — A-записи `@`, `www`, `admin` → IP сервера
2. **nginx** — `sudo cp deploy/nginx.conf /etc/nginx/sites-available/orenrtisnab && sudo nginx -t && sudo systemctl reload nginx`
3. **SSL** — `sudo certbot --nginx -d orenrtisnab.ru -d www.orenrtisnab.ru -d admin.orenrtisnab.ru`
4. **.env** — `ENABLE_HTTPS=true`, затем `pm2 restart orenrtisnab --update-env`

## Обновление после правок

```bash
cd /var/www/orenrtisnab
git pull          # или залить файлы заново
pnpm install
pnpm build
pm2 restart orenrtisnab
```
