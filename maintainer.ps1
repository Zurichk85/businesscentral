#!/usr/bin/env pwsh
# Script de mantenimiento para el sitio de BC Manuales
param(
    [Parameter(Mandatory=$false)]
    [string]$Task = "help"
)

# Configuración
$siteRoot = $PSScriptRoot
$configFile = Join-Path $siteRoot "config.json"
$manualDir = Join-Path $siteRoot "manuales"
$assetsDir = Join-Path $siteRoot "assets"

# Funciones de utilidad
function Show-Help {
    Write-Host "Herramienta de mantenimiento para BC Manuales" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Uso: .\maintener.ps1 [tarea]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Tareas disponibles:" -ForegroundColor Green
    Write-Host "  help        - Muestra esta ayuda"
    Write-Host "  clean       - Limpia archivos temporales"
    Write-Host "  new-manual  - Crea un nuevo manual a partir de una plantilla"
    Write-Host "  validate    - Valida la estructura del sitio"
    Write-Host "  backup      - Crea una copia de seguridad del sitio"
    Write-Host ""
}

function New-Manual {
    # Solicitar información del manual
    $id = Read-Host "ID del manual (utilizado en URLs, ej: instalacion-bc)"
    $title = Read-Host "Título del manual"
    $description = Read-Host "Descripción breve"
    $icon = Read-Host "Icono Font Awesome (ej: fas fa-cogs)"
    
    # Crear el archivo del manual
    $manualPath = Join-Path $manualDir "$id.html"
    
    # Comprobar si ya existe
    if (Test-Path $manualPath) {
        Write-Host "Error: Ya existe un manual con ese ID" -ForegroundColor Red
        return
    }
    
    # Leer la plantilla
    $templatePath = Join-Path $siteRoot "templates/manual-template.html"
    if (!(Test-Path $templatePath)) {
        # Si no existe la plantilla, crear una a partir de un manual existente
        $templateContent = Get-Content (Join-Path $manualDir "servicios-web.html") -Raw
        $templateContent = $templateContent -replace "Integración con Business Central desde .NET", "{TITLE}"
        $templateContent = $templateContent -replace "token-acceso", "{SECTION1-ID}"
        $templateContent = $templateContent -replace "peticion-servicio", "{SECTION2-ID}"
        $templateContent = $templateContent -replace "mostrar-datos", "{SECTION3-ID}"
        $templateContent = $templateContent -replace '<h2 id="token-acceso">.*?</h2>', '<h2 id="{SECTION1-ID}">{SECTION1-TITLE}</h2>'
        $templateContent = $templateContent -replace '<h2 id="peticion-servicio">.*?</h2>', '<h2 id="{SECTION2-ID}">{SECTION2-TITLE}</h2>'
        $templateContent = $templateContent -replace '<h2 id="mostrar-datos">.*?</h2>', '<h2 id="{SECTION3-ID}">{SECTION3-TITLE}</h2>'
        
        # Crear directorio de plantillas si no existe
        if (!(Test-Path (Join-Path $siteRoot "templates"))) {
            New-Item -Path (Join-Path $siteRoot "templates") -ItemType Directory | Out-Null
        }
        
        # Guardar la plantilla
        $templateContent | Out-File $templatePath -Encoding utf8
        Write-Host "Plantilla de manual creada en: $templatePath" -ForegroundColor Green
    }
    
    # Leer la plantilla
    $templateContent = Get-Content $templatePath -Raw
    
    # Reemplazar variables
    $manualContent = $templateContent
    $manualContent = $manualContent -replace "{TITLE}", $title
    $manualContent = $manualContent -replace "{SECTION1-ID}", "seccion1"
    $manualContent = $manualContent -replace "{SECTION2-ID}", "seccion2"
    $manualContent = $manualContent -replace "{SECTION3-ID}", "seccion3"
    $manualContent = $manualContent -replace "{SECTION1-TITLE}", "Primera Sección"
    $manualContent = $manualContent -replace "{SECTION2-TITLE}", "Segunda Sección"
    $manualContent = $manualContent -replace "{SECTION3-TITLE}", "Tercera Sección"
    
    # Guardar el nuevo manual
    $manualContent | Out-File $manualPath -Encoding utf8
    Write-Host "Manual creado en: $manualPath" -ForegroundColor Green
    
    # Actualizar el archivo config.json
    $config = Get-Content $configFile -Raw | ConvertFrom-Json
    
    # Crear el nuevo objeto manual
    $newManual = @{
        id = $id
        title = $title
        description = $description
        file = "manuales/$id.html"
        icon = $icon
    }
    
    # Añadir el manual a la configuración
    $config.manuales += $newManual
    
    # Guardar la configuración actualizada
    $config | ConvertTo-Json -Depth 4 | Out-File $configFile -Encoding utf8
    Write-Host "Configuración actualizada" -ForegroundColor Green
}

function Clean-Site {
    # Eliminar archivos temporales
    Write-Host "Limpiando archivos temporales..." -ForegroundColor Yellow
    
    # Buscar y eliminar archivos de respaldo
    Get-ChildItem -Path $siteRoot -Recurse -Include *.bak, *.tmp | ForEach-Object {
        Remove-Item $_.FullName -Force
        Write-Host "Eliminado: $($_.FullName)" -ForegroundColor Gray
    }
    
    Write-Host "Limpieza completada" -ForegroundColor Green
}

function Validate-Site {
    $errors = 0
    $warnings = 0
    
    Write-Host "Validando estructura del sitio..." -ForegroundColor Yellow
    
    # Comprobar archivos principales
    $requiredFiles = @("index.html", "config.json", "README.md")
    foreach ($file in $requiredFiles) {
        $filePath = Join-Path $siteRoot $file
        if (!(Test-Path $filePath)) {
            Write-Host "ERROR: Archivo requerido no encontrado: $file" -ForegroundColor Red
            $errors++
        }
    }
    
    # Comprobar directorios requeridos
    $requiredDirs = @("assets", "assets/css", "assets/js", "assets/img", "manuales")
    foreach ($dir in $requiredDirs) {
        $dirPath = Join-Path $siteRoot $dir
        if (!(Test-Path $dirPath)) {
            Write-Host "ERROR: Directorio requerido no encontrado: $dir" -ForegroundColor Red
            $errors++
        }
    }
    
    # Validar configuración
    try {
        $config = Get-Content $configFile -Raw | ConvertFrom-Json
        
        # Comprobar manuales en la configuración
        if (!$config.manuales -or $config.manuales.Count -eq 0) {
            Write-Host "ADVERTENCIA: No hay manuales definidos en config.json" -ForegroundColor Yellow
            $warnings++
        } else {
            Write-Host "Encontrados $($config.manuales.Count) manuales en la configuración" -ForegroundColor Green
            
            # Comprobar que existen los archivos de manuales
            foreach ($manual in $config.manuales) {
                if ($manual.file -and $manual.file -ne "#") {
                    $manualPath = Join-Path $siteRoot $manual.file
                    if (!(Test-Path $manualPath)) {
                        Write-Host "ERROR: Archivo de manual no encontrado: $($manual.file)" -ForegroundColor Red
                        $errors++
                    }
                }
            }
        }
    } catch {
        Write-Host "ERROR: Archivo config.json inválido: $_" -ForegroundColor Red
        $errors++
    }
    
    # Mostrar resumen
    Write-Host ""
    Write-Host "Validación completada con $errors errores y $warnings advertencias" -ForegroundColor $(if ($errors -eq 0) { "Green" } else { "Red" })
}

function Backup-Site {
    $date = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupDir = Join-Path $siteRoot "backups"
    $backupFile = Join-Path $backupDir "bcmanuales_$date.zip"
    
    # Crear directorio de backups si no existe
    if (!(Test-Path $backupDir)) {
        New-Item -Path $backupDir -ItemType Directory | Out-Null
    }
    
    Write-Host "Creando copia de seguridad..." -ForegroundColor Yellow
    
    # Crear archivo zip
    if (Get-Command Compress-Archive -ErrorAction SilentlyContinue) {
        # PowerShell 5+
        Compress-Archive -Path "$siteRoot\*" -DestinationPath $backupFile -Force
    } else {
        # Alternativa para PowerShell antiguos
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        [System.IO.Compression.ZipFile]::CreateFromDirectory($siteRoot, $backupFile)
    }
    
    Write-Host "Copia de seguridad creada en: $backupFile" -ForegroundColor Green
}

# Ejecutar tarea solicitada
switch ($Task.ToLower()) {
    "help" { Show-Help }
    "clean" { Clean-Site }
    "new-manual" { New-Manual }
    "validate" { Validate-Site }
    "backup" { Backup-Site }
    default {
        Write-Host "Tarea desconocida: $Task" -ForegroundColor Red
        Show-Help
    }
}
