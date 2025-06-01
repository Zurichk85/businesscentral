/**
 * Sistema de búsqueda para BC Manuales
 * Este script proporciona funcionalidad de búsqueda en todo el sitio
 */

// Índice de búsqueda (se cargará dinámicamente)
let searchIndex = [];
let searchReady = false;

// Inicializar el sistema de búsqueda
async function initSearch() {
    try {
        // Cargar el índice de búsqueda
        const response = await fetch('../search-index.json');
        searchIndex = await response.json();
        searchReady = true;
        
        // Activar la funcionalidad de búsqueda
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        const searchContainer = document.getElementById('search-container');
        
        if (searchInput && searchResults) {
            // Mostrar resultados al escribir
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim().toLowerCase();
                
                if (query.length < 2) {
                    searchResults.innerHTML = '';
                    searchResults.style.display = 'none';
                    return;
                }
                
                const results = performSearch(query);
                displayResults(results, searchResults);
            });
            
            // Ocultar resultados al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!searchContainer.contains(e.target)) {
                    searchResults.style.display = 'none';
                }
            });
            
            // Navegación con teclado en resultados
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    searchResults.style.display = 'none';
                    searchInput.blur();
                } else if (e.key === 'Enter') {
                    const firstResult = searchResults.querySelector('a');
                    if (firstResult) {
                        firstResult.click();
                    }
                } else if (e.key === 'ArrowDown') {
                    const firstResult = searchResults.querySelector('a');
                    if (firstResult) {
                        e.preventDefault();
                        firstResult.focus();
                    }
                }
            });
            
            // Navegación con teclado dentro de los resultados
            searchResults.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    
                    const links = Array.from(searchResults.querySelectorAll('a'));
                    const currentIndex = links.indexOf(document.activeElement);
                    
                    if (e.key === 'ArrowUp' && currentIndex > 0) {
                        links[currentIndex - 1].focus();
                    } else if (e.key === 'ArrowDown' && currentIndex < links.length - 1) {
                        links[currentIndex + 1].focus();
                    } else if (e.key === 'ArrowUp' && currentIndex === 0) {
                        searchInput.focus();
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error al inicializar el sistema de búsqueda:', error);
    }
}

// Realizar búsqueda en el índice
function performSearch(query) {
    if (!searchReady || query.length < 2) {
        return [];
    }
    
    // Dividir la consulta en palabras para búsqueda de términos múltiples
    const terms = query.toLowerCase().split(/\s+/);
    
    return searchIndex
        .filter(item => {
            // Verificar si todos los términos coinciden con el contenido
            return terms.every(term => 
                item.title.toLowerCase().includes(term) || 
                item.content.toLowerCase().includes(term) ||
                (item.tags && item.tags.some(tag => tag.toLowerCase().includes(term)))
            );
        })
        .sort((a, b) => {
            // Priorizar coincidencias en el título
            const aInTitle = terms.every(term => a.title.toLowerCase().includes(term));
            const bInTitle = terms.every(term => b.title.toLowerCase().includes(term));
            
            if (aInTitle && !bInTitle) return -1;
            if (!aInTitle && bInTitle) return 1;
            
            // Luego priorizar por etiquetas
            const aInTags = a.tags && terms.every(term => 
                a.tags.some(tag => tag.toLowerCase().includes(term))
            );
            const bInTags = b.tags && terms.every(term => 
                b.tags.some(tag => tag.toLowerCase().includes(term))
            );
            
            if (aInTags && !bInTags) return -1;
            if (!aInTags && bInTags) return 1;
            
            // Por defecto ordenar alfabéticamente
            return a.title.localeCompare(b.title);
        })
        .slice(0, 10); // Limitar a 10 resultados
}

// Mostrar resultados de búsqueda
function displayResults(results, container) {
    if (!container) return;
    
    if (results.length === 0) {
        container.innerHTML = '<div class="no-results">No se encontraron resultados</div>';
        container.style.display = 'block';
        return;
    }
    
    let html = '';
    
    results.forEach(result => {
        html += `
            <a href="${result.url}" class="search-result-item">
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-preview">${getContentPreview(result.content, 120)}</div>
            </a>
        `;
    });
    
    container.innerHTML = html;
    container.style.display = 'block';
}

// Extraer una vista previa del contenido
function getContentPreview(content, maxLength) {
    if (content.length <= maxLength) {
        return content;
    }
    
    return content.substring(0, maxLength) + '...';
}

// Inicializar cuando se carga el DOM
document.addEventListener('DOMContentLoaded', initSearch);
