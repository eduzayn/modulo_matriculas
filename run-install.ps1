# Script wrapper para executar a instalação com privilégios elevados
$scriptPath = "C:\edunexia_menorepo\apps\matriculas\install-powershell.ps1"

# Verificar se o script existe
if (Test-Path $scriptPath) {
    # Executar o script com privilégios elevados
    Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`"" -Verb RunAs -Wait
    Write-Host "Instalação concluída!"
} else {
    Write-Host "Erro: Script de instalação não encontrado em $scriptPath"
} 