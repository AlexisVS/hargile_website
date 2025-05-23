#!/bin/bash

# Variables
DOMAIN=${1:-hargile.com}
EMAIL=${2:-info@hargile.com}
WEBHOOK_SECRET=$(openssl rand -hex 32)  # Génère un token aléatoire
WWW_DOMAIN="www.${DOMAIN}"  # Gestion explicite du sous-domaine www

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour les logs
log_success() { echo -e "${GREEN}[✓] $1${NC}"; }
log_info() { echo -e "${YELLOW}[i] $1${NC}"; }
log_error() { echo -e "${RED}[✗] $1${NC}"; }
log_warning() { echo -e "${RED}[!] $1${NC}"; }

# Vérification de Docker
command -v docker >/dev/null 2>&1 || { log_error "Docker n'est pas installé. Veuillez l'installer avant de continuer."; exit 1; }

# Détecter la commande docker-compose appropriée
if command -v docker compose >/dev/null 2>&1; then
  DOCKER_COMPOSE="docker compose"
else
  DOCKER_COMPOSE="docker-compose"
fi

log_info "Démarrage de l'initialisation de l'infrastructure pour $DOMAIN"

# 1. Créer la structure de répertoires nécessaire
log_info "Création de la structure de répertoires..."
mkdir -p logs/{webhook,deploy}
mkdir -p volumes/webroot/.well-known/acme-challenge
mkdir -p nginx/conf.d
mkdir -p certbot-etc
mkdir -p certbot-var

# 3. Vérification des DNS avant de continuer
log_info "Vérification des enregistrements DNS..."
DOMAIN_IP=$(dig +short A ${DOMAIN})
WWW_IP=$(dig +short A ${WWW_DOMAIN})

if [ -z "$DOMAIN_IP" ]; then
  log_warning "Aucun enregistrement A trouvé pour $DOMAIN. Vérifiez votre configuration DNS."
  read -p "Continuer quand même ? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_error "Configuration annulée. Veuillez configurer vos DNS correctement."
    exit 1
  fi
fi

# Déterminer si www est configuré
WWW_CONFIGURED=false
if [ -n "$WWW_IP" ]; then
  log_success "Enregistrement DNS pour $WWW_DOMAIN trouvé: $WWW_IP"
  WWW_CONFIGURED=true
else
  log_warning "Aucun enregistrement DNS pour $WWW_DOMAIN trouvé. Seul $DOMAIN sera configuré."
fi

# 3. Créer la configuration Nginx temporaire (pour HTTP uniquement)
log_info "Création de la configuration Nginx temporaire (HTTP uniquement)..."
if [ "$WWW_CONFIGURED" = true ]; then
  SERVER_NAMES="${DOMAIN} ${WWW_DOMAIN}"
else
  SERVER_NAMES="${DOMAIN}"
fi

cat > nginx/conf.d/default.conf << EOL
server {
    listen 80;
    server_name ${SERVER_NAMES};

    # Redirection immédiate vers HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${SERVER_NAMES};

    # Certificats
    ssl_certificate /etc/letsencrypt/live/$host/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$host/privkey.pem;

    # Paramètres SSL optimisés
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Proxy vers Next.js
    location / {
        proxy_pass http://nextjs:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 9000;
    server_name ${SERVER_NAMES};

    # Proxy vers le service webhook
    location / {
        proxy_pass http://$host:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Augmenter le timeout pour les webhooks
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
EOL
log_success "Configuration Nginx temporaire créée avec succès"

# 4. Créer le fichier docker-compose.yml (inchangé)
log_info "Création du fichier docker-compose.yml..."
cat > docker-compose.yml << EOL
services:
  nginx:
    image: nginx:alpine
    container_name: nginx
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./certbot-etc:/etc/letsencrypt:ro
      - ./volumes/webroot:/var/www/html
    ports:
      - "80:80"
      - "443:443"
    environment:
      - TZ=Europe/Paris
    restart: always
    networks:
      - app-network

  nextjs:
    image: node:22-alpine
    container_name: nextjs
    volumes:
      - ..:/app
    working_dir: /app
    command: sh -c "npm install --include=dev && npm run build && npm start"
    env_file:
      - path: ../.env
        required: true
    restart: always
    networks:
      - app-network

  webhook:
    build:
      context: ./webhook
      dockerfile: Dockerfile
    container_name: webhook
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./logs/webhook:/app/logs
      - ./scripts:/app/scripts
      - ..:/app/nextjs-app
    ports:
      - "9000:9000"
    env_file:
        - path: ../.env
          required: true
    environment:
      - SECRET=\${WEBHOOK_SECRET}
      - DEPLOY_SCRIPT=/app/scripts/deploy.sh
      - ROLLBACK_SCRIPT=/app/scripts/rollback.sh
      - LOG_FILE=/app/logs/webhook.log
    restart: always
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
EOL
log_success "Fichier docker-compose.yml créé avec succès"

# 5. Créer le script de renouvellement de certificat (amélioré)
log_info "Création du script de renouvellement de certificat..."
cat > renew-cert.sh << 'EOL'
#!/bin/bash

# Arrêter Nginx pour libérer le port 80
docker compose stop nginx || docker-compose stop nginx

# Renouveler le certificat avec IPv4 uniquement pour éviter les problèmes
docker run --rm -p 80:80 -p 443:443 \
  -v $PWD/certbot-etc:/etc/letsencrypt \
  -v $PWD/certbot-var:/var/lib/letsencrypt \
  certbot/certbot certonly --standalone \
  --preferred-ip-version ipv4 \
  --non-interactive \
  --agree-tos \
  -m $EMAIL \
  $(echo $KNOWN_DOMAINS | sed 's/,/ -d /g' | sed 's/^/-d /')

# Redémarrer Nginx
docker compose start nginx || docker-compose start nginx

# Log du renouvellement
echo "Certificate renewal attempt at $(date)" >> ./logs/certbot.log

# Vérifier si les certificats ont été renouvelés
if [ -f "$PWD/certbot-etc/renewal/${DOMAIN}.conf" ]; then
  echo "Certificate renewal appears successful for ${DOMAIN}" >> ./logs/certbot.log
else
  echo "WARNING: Certificate renewal may have failed for ${DOMAIN}" >> ./logs/certbot.log
fi
EOL
chmod +x renew-cert.sh
log_success "Script de renouvellement créé avec succès"

# 6. Vérifier les certificats SSL existants
log_info "Recherche de certificats SSL existants..."

# Créer une variable pour indiquer si les certificats sont valides
CERTS_VALID=false

# Vérifier dans le répertoire certbot-etc
if [ -d "$PWD/certbot-etc/live/$DOMAIN" ] && [ -e "$PWD/certbot-etc/live/$DOMAIN/fullchain.pem" ]; then
  log_success "Certificats SSL trouvés dans certbot-etc. Utilisation des certificats existants."
  CERTS_VALID=true
else
  # Chercher les certificats dans d'autres emplacements possibles
  log_info "Recherche de certificats SSL dans /etc/letsencrypt..."

  if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    log_info "Certificats trouvés dans /etc/letsencrypt. Copie en cours..."
    mkdir -p $PWD/certbot-etc/live/$DOMAIN
    cp -r /etc/letsencrypt/live/$DOMAIN/* $PWD/certbot-etc/live/$DOMAIN/

    if [ $? -eq 0 ]; then
      log_success "Certificats copiés avec succès."
      CERTS_VALID=true
    else
      log_warning "Échec de la copie des certificats."
    fi
  else
    log_info "Aucun certificat trouvé dans /etc/letsencrypt."
  fi
fi

# Si aucun certificat valide n'a été trouvé, essayer d'en obtenir de nouveaux
if [ "$CERTS_VALID" = false ]; then
  log_info "Tentative d'obtention de nouveaux certificats SSL..."
  log_info "Arrêt des services en cours d'exécution..."
  $DOCKER_COMPOSE down >/dev/null 2>&1

  # Construire la commande certbot avec les domaines à inclure
  DOMAIN_PARAMS="-d $DOMAIN"
  if [ "$WWW_CONFIGURED" = true ]; then
    DOMAIN_PARAMS="$DOMAIN_PARAMS -d $WWW_DOMAIN"
  fi

  log_info "Lancement de Certbot pour obtenir les certificats SSL..."
  log_info "Domaines inclus: $DOMAIN_PARAMS"

  # Utilisation de l'option preferred-ip-version pour forcer IPv4
docker run --rm -p 80:80 -p 443:443 \
  -v "$PWD"/certbot-etc:/etc/letsencrypt \
  -v "$PWD"/certbot-var:/var/lib/letsencrypt \
  certbot/certbot certonly --standalone \
  --preferred-ip-version ipv4 \
  --non-interactive \
  --agree-tos \
  -m "$EMAIL" \
  $(echo "$KNOWN_DOMAINS" | sed 's/,/ -d /g' | sed 's/^/-d /')

  if [ $? -eq 0 ]; then
    log_success "Certificats SSL obtenus avec succès."
    CERTS_VALID=true
  else
    log_warning "Échec de l'obtention des certificats SSL. Configuration en mode HTTP uniquement."
    # Nous continuons avec la configuration HTTP uniquement
  fi
fi

# 8. Démarrer les services
log_info "Démarrage des services..."
$DOCKER_COMPOSE up -d
if [ $? -ne 0 ]; then
  log_error "Échec du démarrage des services. Veuillez vérifier les logs pour plus d'informations."
  exit 1
fi
log_success "Services démarrés avec succès"

# 9. Configuration du cron pour le renouvellement automatique
log_info "Configuration du renouvellement automatique des certificats..."
(crontab -l 2>/dev/null | grep -v "renew-cert.sh") | crontab -
(crontab -l 2>/dev/null; echo "0 3 * * 1 cd $(pwd) && ./renew-cert.sh >> ./logs/certbot.log 2>&1") | crontab -
log_success "Renouvellement automatique configuré avec succès"

# 10. Test de la configuration HTTPS
if [ "$CERTS_VALID" = true ]; then
  log_info "Test de la configuration HTTPS..."
  sleep 5 # Attendre que Nginx démarre complètement

  # Test du domaine principal
  if curl -s -o /dev/null -w "%{http_code}" https://${DOMAIN} --insecure | grep -q "200\|301\|302"; then
    log_success "HTTPS fonctionne correctement pour ${DOMAIN}"
  else
    log_warning "HTTPS semble ne pas fonctionner correctement pour ${DOMAIN}"
  fi

  # Test du sous-domaine www si configuré
  if [ "$WWW_CONFIGURED" = true ]; then
    if curl -s -o /dev/null -w "%{http_code}" https://${WWW_DOMAIN} --insecure | grep -q "200\|301\|302"; then
      log_success "HTTPS fonctionne correctement pour ${WWW_DOMAIN}"
    else
      log_warning "HTTPS semble ne pas fonctionner correctement pour ${WWW_DOMAIN}"
    fi
  fi
fi

# 11. Afficher les informations de configuration
if [ "$CERTS_VALID" = true ]; then
  SITE_URL="https://$DOMAIN"
else
  SITE_URL="http://$DOMAIN"
fi

log_info "===========================================================
Configuration terminée avec succès!

Votre infrastructure est maintenant opérationnelle:
- Domaine: $DOMAIN
- Site: $SITE_URL
- Webhook: http://$DOMAIN:9000
- Secret webhook: $WEBHOOK_SECRET

Pour configurer GitHub webhook:
1. Allez dans votre dépôt GitHub -> Settings -> Webhooks
2. Ajoutez un nouveau webhook:
   - Payload URL: http://$DOMAIN:9000/webhook
   - Content type: application/json
   - Secret: $WEBHOOK_SECRET
   - Events: Just the push event
"

if [ "$CERTS_VALID" = false ]; then
  log_warning "
IMPORTANT: Votre site fonctionne actuellement en HTTP uniquement.
Les certificats SSL n'ont pas pu être obtenus.
Pour résoudre ce problème:
1. Vérifiez que vos enregistrements DNS sont correctement configurés:
   - ${DOMAIN} -> 109.176.197.172
   - www.${DOMAIN} -> 109.176.197.172 (si vous souhaitez le www)
2. Attendez la propagation DNS (peut prendre jusqu'à 24h)
3. Exécutez ensuite:
   ./renew-cert.sh
"
else
  echo "Les certificats seront renouvelés automatiquement."
fi

if [ "$WWW_CONFIGURED" = false ]; then
  log_warning "
NOTE: Le sous-domaine www.${DOMAIN} n'est pas configuré.
Si vous souhaitez utiliser www.${DOMAIN}, ajoutez un enregistrement DNS:
- Type: A
- Nom: www
- Valeur: 109.176.197.172
- TTL: 300

Puis exécutez ce script à nouveau après la propagation DNS.
"
fi

echo "==========================================================="

exit 0
