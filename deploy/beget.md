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

```nginx
server {
    listen 80;
    server_name 31.129.103.174;   # потом добавите orenrtisnab.ru www.orenrtisnab.ru

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
ln -sf /etc/nginx/sites-available/orenrtisnab /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

Откройте в браузере: **http://31.129.103.174**

## 8. Когда подключите домен (reg.ru)

1. DNS: A-записи `orenrtisnab.ru`, `www`, `admin` → IP сервера
2. В nginx `server_name` добавьте домены
3. SSL:
   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot --nginx -d orenrtisnab.ru -d www.orenrtisnab.ru -d admin.orenrtisnab.ru
   ```
4. Для админки — отдельный `server { server_name admin.orenrtisnab.ru; ... }` (см. `deploy/nginx.example.conf`)
5. `SERVER_IP` в `.env` можно оставить или убрать

## Обновление после правок

```bash
cd /var/www/orenrtisnab
git pull          # или залить файлы заново
pnpm install
pnpm build
pm2 restart orenrtisnab
```
