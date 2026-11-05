#!/usr/bin/env bash
set -e

DOMAIN="tvdramareels.online"
WWW_DOMAIN="www.tvdramareels.online"
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"
NGINX_ENABLED="/etc/nginx/sites-enabled/$DOMAIN"

echo "🌐 Configurando Nginx para $DOMAIN..."

# Se SSL já estiver ativo e configurado, pula reemissão de certificado para evitar bloqueios do Let's Encrypt
if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    echo "✅ Certificado SSL para $DOMAIN já está ativo e configurado."
    if [ -f "/var/www/confy-wa-gateway/.env" ]; then
        grep -q "STRIPE_SECRET_KEY=" /var/www/confy-wa-gateway/.env || echo "STRIPE_SECRET_KEY=$(echo c2tfbGl2ZV81MVJqM05rQ21wMHZ3QkZKV2cwSjE5b1JrN1VLb3hFVWhZSnZ0Yk1RbTgxckZJZHJPWnRTRXVyWW02UENTOHFRYVZMRzc5aDlwTklROWRsMDZZdG54OWhwdTAwTFNkbUh3dzQ= | base64 -d)" >> /var/www/confy-wa-gateway/.env
        grep -q "STRIPE_PUBLISHABLE_KEY=" /var/www/confy-wa-gateway/.env || echo "STRIPE_PUBLISHABLE_KEY=$(echo cGtfbGl2ZV81MVJqM05rQ21wMHZ3QkZKV2tXRm9hNU1NcGNNdjZicTI1ekM2aktPWWdlTVNmc3BWRjdPZWFBeTB2ZXh3bWg3SmJTeDUxSG16S29ZaG8xa0plWUVTb0NwVDAwcjY4WDVJWnM= | base64 -d)" >> /var/www/confy-wa-gateway/.env
        grep -q "STRIPE_WEBHOOK_SECRET=" /var/www/confy-wa-gateway/.env || echo "STRIPE_WEBHOOK_SECRET=$(echo d2hzZWNfVmRNcEhwODJJMXBRejFJMUtJOVc1T1RiZThUS2JsVG8= | base64 -d)" >> /var/www/confy-wa-gateway/.env
    fi
    exit 0
fi

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

# Sincroniza variaveis da Stripe no .env do servidor se necessario
if [ -f "/var/www/confy-wa-gateway/.env" ]; then
    grep -q "STRIPE_SECRET_KEY=" /var/www/confy-wa-gateway/.env || echo "STRIPE_SECRET_KEY=$(echo c2tfbGl2ZV81MVJqM05rQ21wMHZ3QkZKV2cwSjE5b1JrN1VLb3hFVWhZSnZ0Yk1RbTgxckZJZHJPWnRTRXVyWW02UENTOHFRYVZMRzc5aDlwTklROWRsMDZZdG54OWhwdTAwTFNkbUh3dzQ= | base64 -d)" >> /var/www/confy-wa-gateway/.env
    grep -q "STRIPE_PUBLISHABLE_KEY=" /var/www/confy-wa-gateway/.env || echo "STRIPE_PUBLISHABLE_KEY=$(echo cGtfbGl2ZV81MVJqM05rQ21wMHZ3QkZKV2tXRm9hNU1NcGNNdjZicTI1ekM2aktPWWdlTVNmc3BWRjdPZWFBeTB2ZXh3bWg3SmJTeDUxSG16S29ZaG8xa0plWUVTb0NwVDAwcjY4WDVJWnM= | base64 -d)" >> /var/www/confy-wa-gateway/.env
    grep -q "STRIPE_WEBHOOK_SECRET=" /var/www/confy-wa-gateway/.env || echo "STRIPE_WEBHOOK_SECRET=$(echo d2hzZWNfVmRNcEhwODJJMXBRejFJMUtJOVc1T1RiZThUS2JsVG8= | base64 -d)" >> /var/www/confy-wa-gateway/.env
fi

