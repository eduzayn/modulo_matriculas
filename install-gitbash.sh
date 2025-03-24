#!/bin/bash

# URL do instalador do Git Bash
GIT_BASH_URL="https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/Git-2.44.0-64-bit.exe"

# Diretório temporário para download
TEMP_DIR="/tmp"
INSTALLER_NAME="GitInstaller.exe"

echo "Baixando Git Bash..."
curl -L "$GIT_BASH_URL" -o "$TEMP_DIR/$INSTALLER_NAME"

if [ $? -eq 0 ]; then
    echo "Instalando Git Bash..."
    # Instala silenciosamente com opções padrão
    "$TEMP_DIR/$INSTALLER_NAME" /VERYSILENT /NORESTART
    
    # Limpa o instalador após a instalação
    rm "$TEMP_DIR/$INSTALLER_NAME"
    
    echo "Git Bash instalado com sucesso!"
else
    echo "Erro ao baixar o Git Bash. Por favor, tente novamente."
    exit 1
fi 