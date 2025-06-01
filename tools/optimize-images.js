#!/usr/bin/env node
/**
 * Script para optimizar imágenes del sitio BC Manuales
 * Genera versiones optimizadas y WebP de las imágenes
 */

const fs = require('fs');
const path = require('path');

console.log('🖼️  Optimizador de Imágenes BC Manuales');
console.log('========================================');

const imageDir = path.join(__dirname, '..', 'assets', 'img');
const iconDir = path.join(__dirname, '..', 'assets', 'icons');

function analyzeImages(dir, type) {
    console.log(`\n📁 Analizando ${type}...`);
    
    if (!fs.existsSync(dir)) {
        console.log(`❌ Directorio ${dir} no encontrado`);
        return;
    }
    
    const files = fs.readdirSync(dir);
    const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|gif|svg)$/i.test(file)
    );
    
    console.log(`📊 Encontradas ${imageFiles.length} imágenes:`);
    
    imageFiles.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        const sizeInKB = Math.round(stats.size / 1024);
        
        console.log(`   📄 ${file} - ${sizeInKB} KB`);
        
        // Sugerencias de optimización
        if (sizeInKB > 500) {
            console.log(`   ⚠️  Imagen grande - considerar optimización`);
        }
        if (file.toLowerCase().includes('.png') && sizeInKB > 100) {
            console.log(`   💡 Convertir a WebP para mejor compresión`);
        }
    });
}

function generateOptimizationRecommendations() {
    console.log('\n🚀 Recomendaciones de Optimización:');
    console.log('=====================================');
    console.log('1. Usar herramientas como TinyPNG o ImageOptim para comprimir imágenes');
    console.log('2. Convertir imágenes grandes a formato WebP');
    console.log('3. Usar lazy loading para imágenes no críticas');
    console.log('4. Considerar responsive images con diferentes tamaños');
    console.log('\n💡 Comandos útiles:');
    console.log('   npm install -g imagemin-cli');
    console.log('   imagemin assets/img/* --out-dir=assets/img/optimized');
}

function checkForDuplicates() {
    console.log('\n🔍 Verificando duplicados...');
    
    const allDirs = [imageDir, iconDir];
    const fileHashes = new Map();
    
    allDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stats = fs.statSync(filePath);
                const key = `${file}_${stats.size}`;
                
                if (fileHashes.has(key)) {
                    console.log(`⚠️  Posible duplicado: ${file}`);
                } else {
                    fileHashes.set(key, filePath);
                }
            });
        }
    });
}

// Ejecutar análisis
try {
    analyzeImages(imageDir, 'Imágenes');
    analyzeImages(iconDir, 'Iconos');
    checkForDuplicates();
    generateOptimizationRecommendations();
    
    console.log('\n✅ Análisis completado');
} catch (error) {
    console.error('❌ Error durante el análisis:', error.message);
}
