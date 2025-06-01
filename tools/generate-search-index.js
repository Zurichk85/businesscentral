#!/usr/bin/env node
/**
 * Generador de índice de búsqueda para BC Manuales
 * Este script crea un índice de búsqueda para todo el sitio
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const config = require('../config.json');

// Configuración
const SITE_ROOT = path.resolve(__dirname, '..');
const MANUALES_DIR = path.join(SITE_ROOT, 'manuales');
const OUTPUT_FILE = path.join(SITE_ROOT, 'search-index.json');

// Array para almacenar el índice de búsqueda
const searchIndex = [];

// Procesar todos los manuales definidos en config.json
async function processAllManuales() {
    console.log('Generando índice de búsqueda...');
    
    // Procesar la página principal
    await processMainPage();
    
    // Procesar cada manual
    for (const manual of config.manuales) {
        if (manual.file && manual.file !== '#') {
            const filePath = path.join(SITE_ROOT, manual.file);
            
            if (fs.existsSync(filePath)) {
                await processManualPage(filePath, manual);
            } else {
                console.warn(`⚠️ Archivo no encontrado: ${manual.file}`);
            }
        }
    }
    
    // Guardar el índice generado
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(searchIndex, null, 2));
    console.log(`✅ Índice de búsqueda generado: ${OUTPUT_FILE}`);
    console.log(`📊 Total de entradas en el índice: ${searchIndex.length}`);
}

// Procesar la página principal
async function processMainPage() {
    const filePath = path.join(SITE_ROOT, 'index.html');
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const dom = new JSDOM(content);
        const document = dom.window.document;
        
        // Extraer secciones relevantes
        const sections = document.querySelectorAll('main section');
        
        sections.forEach(section => {
            const id = section.id;
            const title = section.querySelector('h1, h2, h3')?.textContent || 'Página principal';
            const content = section.textContent.replace(/\s+/g, ' ').trim();
            
            searchIndex.push({
                title: `${title} - Página principal`,
                content: content.substring(0, 500),
                url: `./index.html${id ? '#' + id : ''}`,
                tags: ['inicio', 'principal', 'home']
            });
        });
        
        // Entrada para la página completa
        searchIndex.push({
            title: document.title || 'BC Manuales - Página principal',
            content: document.body.textContent.replace(/\s+/g, ' ').trim().substring(0, 500),
            url: './index.html',
            tags: ['inicio', 'principal', 'home', 'business central', 'manuales']
        });
        
        console.log('✅ Procesada página principal');
    } catch (error) {
        console.error('❌ Error al procesar la página principal:', error);
    }
}

// Procesar un manual individual
async function processManualPage(filePath, manualConfig) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const dom = new JSDOM(content);
        const document = dom.window.document;
        
        // Extraer secciones del manual
        const sections = document.querySelectorAll('main section');
        
        sections.forEach(section => {
            const heading = section.querySelector('h1, h2, h3');
            
            if (heading) {
                const id = heading.id;
                const title = heading.textContent.trim();
                const content = section.textContent.replace(/\s+/g, ' ').trim();
                
                searchIndex.push({
                    title: `${title} - ${manualConfig.title}`,
                    content: content.substring(0, 500),
                    url: `./${manualConfig.file}${id ? '#' + id : ''}`,
                    tags: [manualConfig.id, 'manual', ...extractKeywords(content)]
                });
            }
        });
        
        // Entrada para el manual completo
        searchIndex.push({
            title: manualConfig.title,
            content: document.body.textContent.replace(/\s+/g, ' ').trim().substring(0, 500),
            url: `./${manualConfig.file}`,
            tags: [manualConfig.id, 'manual', 'business central', ...extractKeywords(manualConfig.description)]
        });
        
        console.log(`✅ Procesado manual: ${manualConfig.title}`);
    } catch (error) {
        console.error(`❌ Error al procesar manual ${manualConfig.title}:`, error);
    }
}

// Extraer palabras clave del contenido
function extractKeywords(text) {
    if (!text) return [];
    
    // Lista de palabras vacías (stop words) en español
    const stopWords = new Set([
        'a', 'al', 'algo', 'algunas', 'algunos', 'ante', 'antes', 'como', 'con', 'contra', 'cual', 'cuando',
        'de', 'del', 'desde', 'donde', 'durante', 'e', 'el', 'ella', 'ellas', 'ellos', 'en', 'entre',
        'era', 'erais', 'eran', 'eras', 'eres', 'es', 'esa', 'esas', 'ese', 'eso', 'esos', 'esta', 'estaba',
        'estabais', 'estaban', 'estabas', 'estad', 'estada', 'estadas', 'estado', 'estados', 'estamos', 'estando',
        'estar', 'estaremos', 'estará', 'estarán', 'estarás', 'estaré', 'estaréis', 'estaría', 'estaríais',
        'estaríamos', 'estarían', 'estarías', 'estas', 'este', 'estemos', 'esto', 'estos', 'estoy', 'estuve',
        'estuviera', 'estuvierais', 'estuvieran', 'estuvieras', 'estuvieron', 'estuviese', 'estuvieseis',
        'estuviesen', 'estuvieses', 'estuvimos', 'estuviste', 'estuvisteis', 'estuviéramos', 'estuviésemos',
        'estuvo', 'está', 'estábamos', 'estáis', 'están', 'estás', 'esté', 'estéis', 'estén', 'estés', 'fue',
        'fuera', 'fuerais', 'fueran', 'fueras', 'fueron', 'fuese', 'fueseis', 'fuesen', 'fueses', 'fui',
        'fuimos', 'fuiste', 'fuisteis', 'fuéramos', 'fuésemos', 'ha', 'habida', 'habidas', 'habido', 'habidos',
        'habiendo', 'habrá', 'habrán', 'habrás', 'habré', 'habréis', 'habría', 'habríais', 'habríamos',
        'habrían', 'habrías', 'habéis', 'había', 'habíais', 'habíamos', 'habían', 'habías', 'han', 'has',
        'hasta', 'hay', 'haya', 'hayamos', 'hayan', 'hayas', 'hayáis', 'he', 'hemos', 'hube', 'hubiera',
        'hubierais', 'hubieran', 'hubieras', 'hubieron', 'hubiese', 'hubieseis', 'hubiesen', 'hubieses',
        'hubimos', 'hubiste', 'hubisteis', 'hubiéramos', 'hubiésemos', 'hubo', 'la', 'las', 'le', 'les',
        'lo', 'los', 'me', 'mi', 'mis', 'mucho', 'muchos', 'muy', 'más', 'mí', 'mía', 'mías', 'mío', 'míos',
        'nada', 'ni', 'no', 'nos', 'nosotras', 'nosotros', 'nuestra', 'nuestras', 'nuestro', 'nuestros', 'o',
        'os', 'otra', 'otras', 'otro', 'otros', 'para', 'pero', 'poco', 'por', 'porque', 'que', 'quien',
        'quienes', 'qué', 'se', 'sea', 'seamos', 'sean', 'seas', 'seremos', 'será', 'serán', 'serás', 'seré',
        'seréis', 'sería', 'seríais', 'seríamos', 'serían', 'serías', 'seáis', 'sido', 'siendo', 'sin', 'sobre',
        'sois', 'somos', 'son', 'soy', 'su', 'sus', 'suya', 'suyas', 'suyo', 'suyos', 'sí', 'también', 'tanto',
        'te', 'tendremos', 'tendrá', 'tendrán', 'tendrás', 'tendré', 'tendréis', 'tendría', 'tendríais',
        'tendríamos', 'tendrían', 'tendrías', 'tened', 'tenemos', 'tenga', 'tengamos', 'tengan', 'tengas',
        'tengo', 'tengáis', 'tenida', 'tenidas', 'tenido', 'tenidos', 'teniendo', 'tenéis', 'tenía', 'teníais',
        'teníamos', 'tenían', 'tenías', 'ti', 'tiene', 'tienen', 'tienes', 'todo', 'todos', 'tu', 'tus', 'tuve',
        'tuviera', 'tuvierais', 'tuvieran', 'tuvieras', 'tuvieron', 'tuviese', 'tuvieseis', 'tuviesen',
        'tuvieses', 'tuvimos', 'tuviste', 'tuvisteis', 'tuviéramos', 'tuviésemos', 'tuvo', 'tuya', 'tuyas',
        'tuyo', 'tuyos', 'tú', 'un', 'una', 'uno', 'unos', 'vosotras', 'vosotros', 'vuestra', 'vuestras',
        'vuestro', 'vuestros', 'y', 'ya', 'yo', 'él', 'éramos'
    ]);
    
    // Extraer palabras
    const words = text.toLowerCase()
        .replace(/[^\w\sáéíóúüñ]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopWords.has(word));
    
    // Contar frecuencia de palabras
    const wordFreq = {};
    words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    // Ordenar por frecuencia y devolver las más comunes
    return Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(entry => entry[0]);
}

// Ejecutar el generador
processAllManuales();
