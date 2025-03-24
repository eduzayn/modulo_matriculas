# Script para instalar o PowerShell 7

# Definir o diretório do projeto
$projectDir = "C:\edunexia_menorepo\apps\matriculas"

# Verificar se o PowerShell 7 já está instalado
$pwshPath = "C:\Program Files\PowerShell\7\pwsh.exe"
if (Test-Path $pwshPath) {
    Write-Host "PowerShell 7 já está instalado em: $pwshPath"
    exit 0
}

# URL do instalador do PowerShell 7
$installerUrl = "https://github.com/PowerShell/PowerShell/releases/download/v7.4.1/PowerShell-7.4.1-win-x64.msi"
$installerPath = "$env:TEMP\PowerShell-7.4.1-win-x64.msi"

# Baixar o instalador
Write-Host "Baixando PowerShell 7..."
Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath

# Instalar o PowerShell 7
Write-Host "Instalando PowerShell 7..."
Start-Process msiexec.exe -ArgumentList "/i $installerPath /quiet /norestart" -Wait

# Verificar a instalação
if (Test-Path $pwshPath) {
    Write-Host "PowerShell 7 foi instalado com sucesso!"
    
    # Configurar a política de execução
    Start-Process $pwshPath -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command Set-ExecutionPolicy RemoteSigned -Scope CurrentUser" -Wait
    
    # Limpar o instalador
    Remove-Item $installerPath -Force
    
    exit 0
} else {
    Write-Host "Erro: Falha ao instalar o PowerShell 7"
    exit 1
} 