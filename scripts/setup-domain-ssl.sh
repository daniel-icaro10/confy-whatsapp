#!/usr/bin/env bash
set -e

DOMAIN="tvdramareels.online"
WWW_DOMAIN="www.tvdramareels.online"
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"
NGINX_ENABLED="/etc/nginx/sites-enabled/$DOMAIN"

echo "🌐 Configurando Nginx para $DOMAIN..."

# Instalar Nginx e Certbot se necessário
if ! command -v nginx &> /dev/null; then
    echo "Instalando nginx..."
    apt-get update -q && apt-get install -y nginx certbot python3-certbot-nginx
fi

if ! command -v certbot &> /dev/null; then
    echo "Instalando certbot..."
    apt-get update -q && apt-get install -y certbot python3-certbot-nginx
fi

mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

# Criar configuração do Nginx para proxy reverso da porta 3000
cat << 'EOF' > "$NGINX_CONF"
server {
    listen 80;
    listen [::]:80;
    server_name tvdramareels.online www.tvdramareels.online;

    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
EOF

ln -sf "$NGINX_CONF" "$NGINX_ENABLED"
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

nginx -t && systemctl reload nginx || systemctl restart nginx

echo "🔒 Obtendo certificado SSL gratuito via Let's Encrypt para $DOMAIN..."
certbot --nginx -d "$DOMAIN" -d "$WWW_DOMAIN" --non-interactive --agree-tos -m "admin@$DOMAIN" --redirect || true

systemctl reload nginx || true
echo "✅ Nginx e SSL configurados com sucesso para https://$DOMAIN!"
