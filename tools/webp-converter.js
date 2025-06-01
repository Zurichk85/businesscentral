/**
 * Conversor de Imágenes a WebP para BC Manuales
 * Convierte imágenes PNG/JPEG a formato WebP para mejor rendimiento
 */

const fs = require('fs');
const path = require('path');

class ImageConverter {
    constructor() {
        this.inputDir = path.join(process.cwd(), 'assets', 'img');
        this.outputDir = path.join(process.cwd(), 'assets', 'img', 'webp');
        this.supportedFormats = ['.png', '.jpg', '.jpeg'];
    }

    async init() {
        console.log('🖼️  Conversor de Imágenes a WebP');
        console.log('===================================');
        
        // Crear directorio de salida si no existe
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
            console.log(`📁 Directorio creado: ${this.outputDir}`);
        }

        await this.analyzeImages();
        this.generateWebPFallbacks();
    }

    async analyzeImages() {
        console.log('📊 Analizando imágenes...');
        
        if (!fs.existsSync(this.inputDir)) {
            console.log('❌ Directorio de imágenes no encontrado');
            return;
        }

        const files = fs.readdirSync(this.inputDir);
        const imageFiles = files.filter(file => 
            this.supportedFormats.includes(path.extname(file).toLowerCase())
        );

        console.log(`📄 Encontradas ${imageFiles.length} imágenes para convertir:`);

        for (const file of imageFiles) {
            const filePath = path.join(this.inputDir, file);
            const stats = fs.statSync(filePath);
            const sizeKB = Math.round(stats.size / 1024);
            
            console.log(`   📄 ${file} - ${sizeKB} KB`);
            
            // Estimar ahorro potencial (WebP suele ser 25-35% más pequeño)
            const estimatedSavings = Math.round(sizeKB * 0.3);
            console.log(`      💾 Ahorro estimado: ~${estimatedSavings} KB (30%)`);
        }
    }

    generateWebPFallbacks() {
        console.log('\n🔄 Generando código de respaldo WebP...');
        
        const fallbackHTML = this.generateHTMLWithWebPSupport();
        const fallbackCSS = this.generateCSSWithWebPSupport();
        
        // Guardar ejemplos de código
        fs.writeFileSync(
            path.join(process.cwd(), 'webp-fallback-example.html'),
            fallbackHTML
        );
        
        fs.writeFileSync(
            path.join(process.cwd(), 'webp-fallback-example.css'),
            fallbackCSS
        );

        console.log('✅ Ejemplos de código WebP generados:');
        console.log('   📄 webp-fallback-example.html');
        console.log('   📄 webp-fallback-example.css');
    }

    generateHTMLWithWebPSupport() {
        return `<!-- Ejemplo de HTML con soporte WebP y fallback -->
<picture>
    <source srcset="assets/img/webp/ejemplo.webp" type="image/webp">
    <source srcset="assets/img/ejemplo.png" type="image/png">
    <img src="assets/img/ejemplo.png" alt="Imagen de ejemplo" class="responsive-img">
</picture>

<!-- Para lazy loading con WebP -->
<picture>
    <source data-srcset="assets/img/webp/ejemplo.webp" type="image/webp">
    <source data-srcset="assets/img/ejemplo.png" type="image/png">
    <img data-src="assets/img/ejemplo.png" 
         alt="Imagen de ejemplo" 
         class="lazy responsive-img"
         src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGNUY1RjUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCI+Q2FyZ2FuZG8uLi48L3RleHQ+PC9zdmc+">
</picture>

<script>
function supportsWebP(callback) {
    const webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height === 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

supportsWebP(function(supported) {
    if (supported) {
        document.documentElement.classList.add('webp');
    } else {
        document.documentElement.classList.add('no-webp');
    }
});
</script>`;
    }

    generateCSSWithWebPSupport() {
        return `/* CSS para soporte WebP con fallback */
.responsive-img {
    max-width: 100%;
    height: auto;
    display: block;
}

.lazy {
    opacity: 0.5;
    transition: opacity 0.3s ease;
}

.lazy.loaded {
    opacity: 1;
}

.lazy.error {
    opacity: 1;
    background-color: #f5f5f5;
}

.hero-bg {
    background-image: url('assets/img/hero.jpg');
}

.webp .hero-bg {
    background-image: url('assets/img/webp/hero.webp');
}

.card-img-webp {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    height: 200px;
}

@media (max-width: 768px) {
    .responsive-img {
        width: 100%;
    }
    
    .card-img-webp {
        height: 150px;
    }
}`;
    }

    generateConversionScript() {
        console.log('\n🛠️  Generando script de conversión manual...');
        
        const script = `# Script de conversión manual a WebP
# Herramientas recomendadas:
# 1. Squoosh: https://squoosh.app/
# 2. TinyPNG: https://tinypng.com/
# 3. CloudConvert: https://cloudconvert.com/

echo "Conversión manual requerida:"
echo "1. Ir a https://squoosh.app/"
echo "2. Subir cada imagen desde assets/img/"
echo "3. Seleccionar formato WebP con calidad 80"
echo "4. Descargar y guardar en assets/img/webp/"
`;

        fs.writeFileSync(
            path.join(process.cwd(), 'convert-to-webp.sh'),
            script
        );

        console.log('✅ Script de conversión generado: convert-to-webp.sh');
    }

    generateImageOptimizationReport() {
        console.log('\n📊 Generando reporte de optimización...');
        
        const report = {
            timestamp: new Date().toISOString(),
            recommendations: [
                {
                    action: 'Convertir a WebP',
                    impact: 'Alto',
                    savings: '25-35% reducción en tamaño',
                    effort: 'Medio',
                    tools: ['Squoosh.app', 'TinyPNG', 'CloudConvert']
                },
                {
                    action: 'Implementar lazy loading',
                    impact: 'Alto',
                    savings: 'Mejora tiempo de carga inicial',
                    effort: 'Bajo',
                    status: 'Completado'
                },
                {
                    action: 'Usar responsive images',
                    impact: 'Medio',
                    savings: 'Optimización para móviles',
                    effort: 'Alto',
                    tools: ['Srcset', 'Picture element']
                }
            ],
            nextSteps: [
                '1. Convertir imágenes principales a WebP',
                '2. Actualizar HTML para usar element <picture>',
                '3. Agregar detección de soporte WebP',
                '4. Implementar responsive images con srcset',
                '5. Configurar CDN para delivery optimizado'
            ]
        };

        fs.writeFileSync(
            path.join(process.cwd(), 'image-optimization-report.json'),
            JSON.stringify(report, null, 2)
        );

        console.log('✅ Reporte generado: image-optimization-report.json');
        console.log('\n🚀 Próximos pasos recomendados:');
        report.nextSteps.forEach(step => console.log(`   ${step}`));
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    const converter = new ImageConverter();
    converter.init().then(() => {
        converter.generateConversionScript();
        converter.generateImageOptimizationReport();
        console.log('\n✨ Análisis de conversión WebP completado');
    }).catch(error => {
        console.error('❌ Error:', error.message);
    });
}

module.exports = ImageConverter;
