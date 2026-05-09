// Funciones para actualizar la interfaz con datos de la configuración
function updateUIFromConfig() {
    if (!siteConfig.loaded) return;
    
    // Actualizar el título de la página
    const siteName = siteConfig.getSiteName();
    if (siteName) {
        document.title = document.title || siteName;
        
        // Actualizar texto del logo si existe
        const logoText = document.querySelector('.logo-text');
        if (logoText) {
            logoText.textContent = siteName;
        }
    }
    
    // Actualizar el copyright
    const copyright = siteConfig.getCopyright();
    if (copyright) {
        const copyrightEls = document.querySelectorAll('.copyright p');
        copyrightEls.forEach(el => {
            if (el.textContent.includes('©')) {
                el.textContent = `© ${copyright}`;
            }
        });
    }
    
    // Actualizar enlaces de navegación de manuales
    updateManualesNavigation();
    
    // Actualizar enlaces de recursos
    updateRecursosNavigation();
    
    console.log('Interfaz actualizada con la configuración');
}

function updateManualesNavigation() {
    const manuales = siteConfig.getManuales();
    const manualLinks = document.querySelectorAll('.dropdown-content a[href*="manual"]');
    
    if (!manuales || !manualLinks.length) return;
    
    // Recorrer los enlaces del menú
    manualLinks.forEach(link => {
        // Buscar el manual correspondiente en la configuración
        const href = link.getAttribute('href');
        const currentId = href.includes('#') ? href.split('#')[1] : '';
        
        const manual = manuales.find(m => m.id === currentId || href.includes(m.id));
        
        if (manual) {
            // Actualizar enlace
            if (manual.file && manual.file !== '#') {
                link.setAttribute('href', manual.file);
            }
            
            // Actualizar icono si existe
            if (manual.icon) {
                const iconEl = link.querySelector('i');
                if (iconEl) {
                    iconEl.className = manual.icon;
                }
            }
            
            // Actualizar texto
            const iconEl = link.querySelector('i');
            if (iconEl) {
                // Mantener el icono y actualizar solo el texto
                link.innerHTML = '';
                link.appendChild(iconEl);
                link.appendChild(document.createTextNode(' ' + manual.title));
            } else {
                link.textContent = manual.title;
            }
        }
    });
}

function updateRecursosNavigation() {
    const recursos = siteConfig.getRecursos();
    const recursosLinks = document.querySelectorAll('.dropdown-content a[href*="rendbctrans"]');
    
    if (!recursos || !recursosLinks.length) return;
    
    // Recorrer los enlaces de recursos
    recursosLinks.forEach(link => {
        const href = link.getAttribute('href');
        const recurso = recursos.find(r => href.includes(r.url) || r.url.includes(href));
        
        if (recurso) {
            // Actualizar enlace
            if (recurso.url) {
                link.setAttribute('href', recurso.url);
                link.setAttribute('target', '_blank');
            }
            
            // Actualizar icono si existe
            if (recurso.icon) {
                const iconEl = link.querySelector('i');
                if (iconEl) {
                    iconEl.className = recurso.icon;
                }
            }
            
            // Actualizar texto
            const iconEl = link.querySelector('i');
            if (iconEl) {
                // Mantener el icono y actualizar solo el texto
                link.innerHTML = '';
                link.appendChild(iconEl);
                link.appendChild(document.createTextNode(' ' + recurso.title));
            } else {
                link.textContent = recurso.title;
            }
        }
    });
}

// Inicializar UI desde configuración si está disponible
function initUIConfig() {
    if (window.siteConfig) {
        // Cargar configuración y actualizar UI cuando esté lista
        siteConfig.load().then(() => {
            try {
                updateUIFromConfig();
            } catch (e) {
                console.error('Error actualizando UI desde configuración:', e);
            }
        });
    } else {
        console.warn('siteConfig no está disponible en window');
    }
}

// Ejecutar inicialización si el DOM ya está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUIConfig);
} else {
    initUIConfig();
}
