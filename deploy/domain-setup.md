# Подключение домена orenrtisnab.ru

IP сервера: **31.129.103.174**

## Шаг 1. DNS в reg.ru

В личном кабинете reg.ru → домен **orenrtisnab.ru** → **DNS-серверы и зона**.

Если домен использует DNS reg.ru (ns1.reg.ru / ns2.reg.ru), добавьте **A-записи**:

| Имя (хост) | Тип | Значение        | TTL  |
|------------|-----|-----------------|------|
| `@`        | A   | 31.129.103.174  | 3600 |
| `www`      | A   | 31.129.103.174  | 3600 |
| `admin`    | A   | 31.129.103.174  | 3600 |

Сохраните. Распространение DNS — от 5 минут до нескольких часов.

**Проверка с сервера:**

```bash
dig +short orenrtisnab.ru
dig +short www.orenrtisnab.ru
dig +short admin.orenrtisnab.ru
```

Все три должны вернуть `31.129.103.174`.

---

## Шаг 2. Nginx на сервере

```bash
cd /var/www/orenrtisnab
git pull origin main

sudo cp deploy/nginx.conf /etc/nginx/sites-available/orenrtisnab
sudo ln -sf /etc/nginx/sites-available/orenrtisnab /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Проверьте в браузере (пока без HTTPS):

- http://orenrtisnab.ru
- http://admin.orenrtisnab.ru

---

## Шаг 3. SSL-сертификат (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d orenrtisnab.ru -d www.orenrtisnab.ru -d admin.orenrtisnab.ru
```

- Укажите email для уведомлений
- Согласитесь с условиями
- На вопрос про редирект HTTP→HTTPS выберите **2 (Redirect)**

Проверка автообновления:

```bash
sudo certbot renew --dry-run
```

---

## Шаг 4. Включить HTTPS в приложении

```bash
nano /var/www/orenrtisnab/.env
```

Измените / добавьте:

```env
MAIN_DOMAIN=orenrtisnab.ru
ADMIN_SUBDOMAIN=admin.orenrtisnab.ru
ENABLE_HTTPS=true
```

`SERVER_IP=31.129.103.174` можно оставить — сайт будет работать и по IP, и по домену.

```bash
pm2 restart orenrtisnab --update-env
```

---

## Шаг 5. Проверка

- https://orenrtisnab.ru — главная
- https://www.orenrtisnab.ru — редирект на основной (после certbot)
- https://admin.orenrtisnab.ru — админка
- Форма заявки, загрузка фото в каталоге
- Яндекс Метрика в браузере (расширение или вкладка «Сеть»)

---

## Шаг 6. (Опционально) Редирект www → orenrtisnab.ru

Если certbot не настроил, добавьте в `/etc/nginx/sites-available/orenrtisnab`:

```nginx
server {
    listen 443 ssl http2;
    server_name www.orenrtisnab.ru;
    ssl_certificate     /etc/letsencrypt/live/orenrtisnab.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/orenrtisnab.ru/privkey.pem;
    return 301 https://orenrtisnab.ru$request_uri;
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## Частые проблемы

| Симптом | Решение |
|---------|---------|
| DNS не резолвится | Подождать, проверить A-записи в reg.ru |
| certbot: connection failed | DNS ещё не дошёл; порт 80 открыт в firewall |
| 502 Bad Gateway | `pm2 logs orenrtisnab`, проверить `.env` (JWT, пароль) |
| Сайт по HTTPS, но стили не грузятся | `ENABLE_HTTPS=true` + `pm2 restart --update-env` |
| Админка 404 | Host должен быть `admin.orenrtisnab.ru`, не `/admin` на основном домене |

---

## Обновление сайта после правок

```bash
cd /var/www/orenrtisnab
rm -f tsconfig.server.tsbuildinfo
git pull origin main
pnpm install
pnpm build
pm2 restart orenrtisnab --update-env
```
