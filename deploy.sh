#!/bin/bash
# Script de deploy do Dashboard Casa Lení
# Execute no servidor onde o Portainer está rodando

set -e

REPO_URL="https://github.com/omauriciobrizola/dashboard-casaleni.git"
APP_DIR="/opt/dashboard-casaleni"
IMAGE_NAME="dashboard-casaleni:latest"

echo "🚀 Deploy Dashboard Casa Lení"
echo "=============================="

# Clone ou pull do repositório
if [ -d "$APP_DIR" ]; then
  echo "📥 Atualizando repositório..."
  cd "$APP_DIR"
  git pull origin main
else
  echo "📥 Clonando repositório..."
  git clone "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

# Build da imagem Docker
echo "🔨 Construindo imagem Docker..."
docker build -t "$IMAGE_NAME" .

# Subir os containers
echo "🐳 Subindo containers..."
docker compose -f docker-compose.portainer.yml up -d

echo ""
echo "✅ Deploy concluído!"
echo "📌 Acesse o dashboard em http://$(hostname -I | awk '{print $1}'):3001"
echo ""
echo "💡 Dica: Configure as variáveis de ambiente no Portainer"
echo "   ou crie um arquivo .env em $APP_DIR"
