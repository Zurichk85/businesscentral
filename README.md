# BC Manuales

Sitio web con manuales y recursos para desarrolladores de Business Central.

## 🚀 Características

- **Manuales Técnicos**: Guías paso a paso para desarrollo en Business Central
- **Sistema de Búsqueda**: Búsqueda en tiempo real en todo el contenido
- **Recursos Externos**: Enlaces a herramientas útiles para desarrolladores
- **Configuración Centralizada**: Todo configurable desde `config.json`
- **Plantillas**: Sistema de plantillas para crear nuevos manuales
- **Herramientas de Mantenimiento**: Scripts automatizados para gestión del sitio

## 📁 Estructura del Proyecto

```
├── assets/                     # Recursos estáticos
│   ├── css/                   # Hojas de estilo
│   │   ├── main.css          # Estilos principales
│   │   ├── manuales.css      # Estilos específicos para manuales
│   │   └── search.css        # Estilos del sistema de búsqueda
│   ├── js/                   # Scripts JavaScript
│   │   ├── config.js         # Carga de configuración
│   │   ├── main.js           # Funcionalidad principal
│   │   ├── search.js         # Sistema de búsqueda
│   │   └── ui-config.js      # Configuración de UI
│   ├── img/                  # Imágenes
│   ├── icons/                # Iconos del sitio
│   └── fonts/                # Fuentes personalizadas
├── manuales/                  # Manuales técnicos
│   ├── servicios-web.html    # Manual de servicios web
│   └── integracion-apis.html # Manual de APIs REST
├── templates/                 # Plantillas para nuevos contenidos
│   └── manual-template.html  # Plantilla base para manuales
├── tools/                     # Herramientas de desarrollo
│   └── generate-search-index.js # Generador de índice de búsqueda
├── config.json               # Configuración central del sitio
├── maintainer.ps1            # Script de mantenimiento
├── package.json              # Dependencias del proyecto
├── search-index.json         # Índice de búsqueda generado
└── index.html                # Página principal
```

## 🛠️ Herramientas de Desarrollo

### Script de Mantenimiento (`maintainer.ps1`)

```powershell
# Mostrar ayuda
.\maintainer.ps1 help

# Limpiar archivos temporales
.\maintainer.ps1 clean

# Crear nuevo manual
.\maintainer.ps1 new-manual

# Validar estructura del sitio
.\maintainer.ps1 validate

# Crear copia de seguridad
.\maintainer.ps1 backup
```

### NPM Scripts

```bash
# Generar índice de búsqueda
npm run build-search

# Servidor de desarrollo
npm run dev

# Servidor HTTP simple
npm run serve
```

## 📝 Crear Nuevo Manual

### Opción 1: Usando el Script (Recomendado)
```powershell
.\maintainer.ps1 new-manual
```

### Opción 2: Manual
1. Copiar `templates/manual-template.html`
2. Renombrar y colocar en `manuales/`
3. Editar el contenido
4. Agregar entrada en `config.json`
5. Regenerar índice de búsqueda: `npm run build-search`

## ⚙️ Configuración

Toda la configuración del sitio se encuentra en `config.json`:

```json
{
  "siteName": "BC Manuales",
  "siteDescription": "Manuales y recursos para desarrolladores de Business Central",
  "author": "Adrián Espí Peña",
  "version": "1.0.0",
  "copyright": "2025 Adrián Espí Peña - Todos los derechos reservados",
  "socialLinks": {
    "linkedin": "...",
    "youtube": "...",
    "github": "...",
    "cv": "..."
  },
  "manuales": [
    {
      "id": "manual-id",
      "title": "Título del Manual",
      "description": "Descripción breve",
      "file": "manuales/archivo.html",
      "icon": "fas fa-icon"
    }
  ],
  "recursos": [
    {
      "id": "recurso-id",
      "title": "Nombre del Recurso",
      "description": "Descripción del recurso",
      "url": "https://ejemplo.com",
      "icon": "fas fa-icon"
    }
  ]
}
```

## 🔍 Sistema de Búsqueda

El sitio incluye un sistema de búsqueda en tiempo real que:

- Indexa automáticamente todo el contenido HTML
- Busca en títulos, descripciones y contenido
- Muestra resultados instantáneos
- Funciona sin conexión

Para regenerar el índice:
```bash
npm run build-search
```

## 🎨 Personalización

### Estilos
- `assets/css/main.css`: Estilos base y layout
- `assets/css/manuales.css`: Estilos específicos para manuales
- `assets/css/search.css`: Estilos del sistema de búsqueda

### JavaScript
- `assets/js/main.js`: Funcionalidad principal
- `assets/js/config.js`: Carga de configuración
- `assets/js/search.js`: Sistema de búsqueda
- `assets/js/ui-config.js`: Actualización de UI desde config

## 📋 Dependencias

- **jsdom**: Para procesamiento de HTML en el generador de índice
- **http-server**: Servidor HTTP simple para desarrollo
- **live-server**: Servidor con recarga automática para desarrollo

## 🚀 Despliegue

El sitio es completamente estático y puede desplegarse en cualquier servidor web:

1. GitHub Pages
2. Netlify
3. Vercel
4. Servidor web tradicional

## 📄 Licencia

© 2025 Adrián Espí Peña - Todos los derechos reservados

## 🤝 Contribución

Para contribuir al proyecto:

1. Crear nuevos manuales usando las plantillas
2. Mejorar los estilos CSS
3. Agregar nuevas funcionalidades JavaScript
4. Optimizar el rendimiento
5. Reportar bugs o sugerir mejoras
