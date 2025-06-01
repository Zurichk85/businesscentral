#!/usr/bin/env node
/**
 * Generador de reporte del sitio BC Manuales
 * Genera un informe completo del estado del proyecto
 */

const fs = require('fs');
const path = require('path');

console.log('📊 BC Manuales - Reporte del Proyecto');
console.log('====================================');

const projectRoot = path.join(__dirname, '..');
const configPath = path.join(projectRoot, 'config.json');
const packagePath = path.join(projectRoot, 'package.json');

// Función para leer archivos JSON de forma segura
function readJsonFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`❌ Error leyendo ${filePath}:`, error.message);
        return null;
    }
}

// Función para contar archivos en un directorio
function countFiles(dirPath, extensions = []) {
    try {
        if (!fs.existsSync(dirPath)) return 0;
        
        const files = fs.readdirSync(dirPath, { withFileTypes: true });
        return files.filter(file => {
            if (file.isDirectory()) return false;
            if (extensions.length === 0) return true;
            return extensions.some(ext => file.name.toLowerCase().endsWith(ext.toLowerCase()));
        }).length;
    } catch (error) {
        return 0;
    }
}

// Función para obtener el tamaño de un directorio
function getDirectorySize(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) return 0;
        
        let totalSize = 0;
        const files = fs.readdirSync(dirPath, { withFileTypes: true });
        
        files.forEach(file => {
            const filePath = path.join(dirPath, file.name);
            if (file.isDirectory()) {
                totalSize += getDirectorySize(filePath);
            } else {
                const stats = fs.statSync(filePath);
                totalSize += stats.size;
            }
        });
        
        return totalSize;
    } catch (error) {
        return 0;
    }
}

// Función para formatear bytes
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Leer configuración del proyecto
const config = readJsonFile(configPath);
const packageInfo = readJsonFile(packagePath);

console.log('\n🔧 Información del Proyecto:');
console.log(`   Nombre: ${config?.siteName || 'N/A'}`);
console.log(`   Versión: ${config?.version || packageInfo?.version || 'N/A'}`);
console.log(`   Autor: ${config?.author || packageInfo?.author || 'N/A'}`);
console.log(`   Descripción: ${config?.siteDescription || packageInfo?.description || 'N/A'}`);

console.log('\n📚 Contenido:');
console.log(`   Manuales: ${config?.manuales?.length || 0}`);
console.log(`   Recursos: ${config?.recursos?.length || 0}`);

if (config?.manuales) {
    console.log('\n   📖 Manuales disponibles:');
    config.manuales.forEach((manual, index) => {
        const status = manual.file !== '#' ? '✅' : '⏳';
        console.log(`      ${index + 1}. ${status} ${manual.title}`);
    });
}

if (config?.recursos) {
    console.log('\n   🔧 Recursos disponibles:');
    config.recursos.forEach((recurso, index) => {
        console.log(`      ${index + 1}. 🔗 ${recurso.title}`);
    });
}

console.log('\n📁 Estructura de Archivos:');

// Contar archivos por tipo
const assetsDir = path.join(projectRoot, 'assets');
const manualesDir = path.join(projectRoot, 'manuales');
const templatesDir = path.join(projectRoot, 'templates');
const toolsDir = path.join(projectRoot, 'tools');

console.log(`   CSS: ${countFiles(path.join(assetsDir, 'css'), ['.css'])}`);
console.log(`   JavaScript: ${countFiles(path.join(assetsDir, 'js'), ['.js'])}`);
console.log(`   Imágenes: ${countFiles(path.join(assetsDir, 'img'), ['.png', '.jpg', '.jpeg', '.gif', '.svg'])}`);
console.log(`   Iconos: ${countFiles(path.join(assetsDir, 'icons'), ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'])}`);
console.log(`   Manuales HTML: ${countFiles(manualesDir, ['.html'])}`);
console.log(`   Plantillas: ${countFiles(templatesDir, ['.html'])}`);
console.log(`   Herramientas: ${countFiles(toolsDir, ['.js', '.ps1'])}`);

console.log('\n💾 Tamaño del Proyecto:');
const totalSize = getDirectorySize(projectRoot);
const assetsSize = getDirectorySize(assetsDir);
const manualesSize = getDirectorySize(manualesDir);

console.log(`   Tamaño total: ${formatBytes(totalSize)}`);
console.log(`   Assets: ${formatBytes(assetsSize)}`);
console.log(`   Manuales: ${formatBytes(manualesSize)}`);

console.log('\n🔍 Estado del Sistema de Búsqueda:');
const searchIndexPath = path.join(projectRoot, 'search-index.json');
if (fs.existsSync(searchIndexPath)) {
    const searchIndex = readJsonFile(searchIndexPath);
    console.log(`   ✅ Índice de búsqueda generado`);
    console.log(`   📊 Entradas indexadas: ${searchIndex?.length || 0}`);
} else {
    console.log(`   ❌ Índice de búsqueda no encontrado`);
    console.log(`   💡 Ejecuta: npm run build-search`);
}

console.log('\n🛠️ Scripts Disponibles:');
if (packageInfo?.scripts) {
    Object.entries(packageInfo.scripts).forEach(([name, command]) => {
        console.log(`   📋 ${name}: ${command}`);
    });
}

console.log('\n📦 Dependencias:');
if (packageInfo?.devDependencies) {
    console.log(`   Dependencias de desarrollo: ${Object.keys(packageInfo.devDependencies).length}`);
    Object.entries(packageInfo.devDependencies).forEach(([name, version]) => {
        console.log(`      📦 ${name}@${version}`);
    });
}

console.log('\n🔗 Enlaces Sociales:');
if (config?.socialLinks) {
    Object.entries(config.socialLinks).forEach(([platform, url]) => {
        const icon = platform === 'linkedin' ? '💼' : 
                    platform === 'youtube' ? '📺' : 
                    platform === 'github' ? '🐙' : 
                    platform === 'cv' ? '📄' : '🔗';
        console.log(`   ${icon} ${platform}: ${url}`);
    });
}

console.log('\n✅ Checklist de Completación:');
console.log(`   ${config?.manuales ? '✅' : '❌'} Configuración de manuales`);
console.log(`   ${config?.recursos ? '✅' : '❌'} Configuración de recursos`);
console.log(`   ${fs.existsSync(searchIndexPath) ? '✅' : '❌'} Índice de búsqueda`);
console.log(`   ${fs.existsSync(path.join(assetsDir, 'css', 'main.css')) ? '✅' : '❌'} Estilos principales`);
console.log(`   ${fs.existsSync(path.join(assetsDir, 'js', 'main.js')) ? '✅' : '❌'} JavaScript principal`);
console.log(`   ${fs.existsSync(path.join(templatesDir, 'manual-template.html')) ? '✅' : '❌'} Plantilla de manuales`);
console.log(`   ${fs.existsSync(path.join(projectRoot, 'README.md')) ? '✅' : '❌'} Documentación`);

console.log('\n🚀 Recomendaciones:');
console.log('   📝 Agregar más manuales usando las plantillas');
console.log('   🎨 Optimizar imágenes para mejor rendimiento');
console.log('   📊 Configurar Google Analytics para estadísticas');
console.log('   🔒 Implementar HTTPS en producción');
console.log('   🌐 Considerar CDN para mejores tiempos de carga');

console.log('\n✨ Proyecto BC Manuales - Reporte Completado');
console.log('=============================================');
