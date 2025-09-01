$sourcePath = Join-Path (Get-Location) "src\components\ui\blocks\fixed-AppSidebar.vue"
$targetPath = Join-Path (Get-Location) "src\components\ui\blocks\AppSidebar.vue"

# Vérifier si le fichier source existe
if (-not (Test-Path $sourcePath)) {
    Write-Error "Le fichier source n'existe pas: $sourcePath"
    exit 1
}

# Lire le contenu du fichier source
try {
    $content = Get-Content -Path $sourcePath -Raw -Encoding UTF8
    # Supprimer le fichier cible s'il existe
    if (Test-Path $targetPath) {
        Remove-Item -Path $targetPath -Force
    }
    # Écrire le contenu dans le fichier cible
    $content | Out-File -FilePath $targetPath -Encoding UTF8 -Force
    Write-Host "Le fichier a été copié avec succès!"
} catch {
    Write-Error "Une erreur s'est produite: $_"
    exit 1
}
