/**
 * Lazy Loading de Imágenes para BC Manuales
 * Mejora el rendimiento cargando imágenes solo cuando son necesarias
 */

class LazyImageLoader {
    constructor() {
        this.imageObserver = null;
        this.init();
    }

    init() {
        // Verificar soporte para Intersection Observer
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                // Cargar imagen cuando esté 100px antes de ser visible
                rootMargin: '100px'
            });

            this.observeImages();
        } else {
            // Fallback para navegadores sin soporte
            this.loadAllImages();
        }
    }

    observeImages() {
        // Buscar todas las imágenes con data-src (lazy loading)
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        lazyImages.forEach(img => {
            this.imageObserver.observe(img);
        });

        // También observar imágenes que se agreguen dinámicamente
        this.observeNewImages();
    }

    loadImage(img) {
        // Mostrar placeholder mientras carga
        img.style.opacity = '0.5';
        img.style.transition = 'opacity 0.3s ease';

        // Crear una nueva imagen para precargar
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            // Imagen cargada exitosamente
            img.src = img.dataset.src;
            img.style.opacity = '1';
            img.classList.add('loaded');
            
            // Eliminar data-src para evitar recargas
            delete img.dataset.src;
            
            // Trigger custom event
            img.dispatchEvent(new CustomEvent('imageLoaded', {
                detail: { src: img.src }
            }));
        };

        imageLoader.onerror = () => {
            // Error cargando imagen
            img.style.opacity = '1';
            img.alt = 'Error cargando imagen';
            img.classList.add('error');
            
            // Mostrar placeholder de error si está disponible
            if (img.dataset.fallback) {
                img.src = img.dataset.fallback;
            }
        };

        // Iniciar la carga
        imageLoader.src = img.dataset.src;
    }

    loadAllImages() {
        // Fallback: cargar todas las imágenes inmediatamente
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        lazyImages.forEach(img => {
            this.loadImage(img);
        });
    }

    observeNewImages() {
        // Observar cambios en el DOM para nuevas imágenes
        if ('MutationObserver' in window) {
            const mutationObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            // Verificar si el nodo añadido es una imagen lazy
                            if (node.tagName === 'IMG' && node.dataset.src) {
                                this.imageObserver.observe(node);
                            }
                            
                            // Verificar imágenes lazy dentro del nodo añadido
                            const lazyImages = node.querySelectorAll ? 
                                node.querySelectorAll('img[data-src]') : [];
                            
                            lazyImages.forEach(img => {
                                this.imageObserver.observe(img);
                            });
                        }
                    });
                });
            });

            mutationObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // Método público para cargar una imagen específica
    loadImageNow(img) {
        if (img.dataset.src) {
            this.loadImage(img);
            if (this.imageObserver) {
                this.imageObserver.unobserve(img);
            }
        }
    }

    // Método público para cargar todas las imágenes restantes
    loadAllRemainingImages() {
        const remainingImages = document.querySelectorAll('img[data-src]');
        remainingImages.forEach(img => {
            this.loadImageNow(img);
        });
    }
}

// Utilidades para lazy loading
const LazyLoadUtils = {
    // Convertir imagen normal a lazy loading
    makeImageLazy(img, placeholder = null) {
        if (img.src && !img.dataset.src) {
            img.dataset.src = img.src;
            img.src = placeholder || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNGNUY1RjUiLz48L3N2Zz4=';
            img.classList.add('lazy');
        }
    },

    // Crear placeholder SVG
    createPlaceholder(width, height, color = '#f5f5f5') {
        return `data:image/svg+xml;base64,${btoa(`
            <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="${width}" height="${height}" fill="${color}"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="Arial, sans-serif" font-size="14">
                    Cargando...
                </text>
            </svg>
        `)}`;
    },

    // Auto-convertir imágenes en un contenedor
    convertImagesInContainer(container, placeholder = null) {
        const images = container.querySelectorAll('img:not([data-src])');
        images.forEach(img => {
            this.makeImageLazy(img, placeholder);
        });
    }
};

// Inicializar lazy loading cuando el DOM esté listo
let lazyLoader = null;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        lazyLoader = new LazyImageLoader();
    });
} else {
    lazyLoader = new LazyImageLoader();
}

// Exportar para uso global
window.LazyImageLoader = LazyImageLoader;
window.LazyLoadUtils = LazyLoadUtils;
window.lazyLoader = lazyLoader;
