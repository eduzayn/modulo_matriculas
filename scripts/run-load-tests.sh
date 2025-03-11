#!/bin/bash

# Script para executar testes de carga na aplicação
# Requer k6 instalado: https://k6.io/docs/getting-started/installation/

# Verificar se k6 está instalado
if ! command -v k6 &> /dev/null; then
    echo "k6 não está instalado. Por favor, instale-o primeiro."
    echo "Instruções de instalação: https://k6.io/docs/getting-started/installation/"
    exit 1
fi

# Diretório base do projeto
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Diretório dos testes de performance
TESTS_DIR="$BASE_DIR/tests/performance"

# Verificar se o servidor está rodando
echo "Verificando se o servidor está rodando..."
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "O servidor não está rodando. Por favor, inicie-o primeiro."
    echo "Execute: npm run dev"
    exit 1
fi

# Executar teste de carga
echo "Executando teste de carga..."
k6 run --env BASE_URL=http://localhost:3000 "$TESTS_DIR/load-test.js"

# Verificar resultado
if [ $? -eq 0 ]; then
    echo "Teste de carga concluído com sucesso!"
else
    echo "Teste de carga falhou. Verifique os logs acima para mais detalhes."
    exit 1
fi

echo "Relatório de teste de carga concluído."
