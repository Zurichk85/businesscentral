/**
 * Scripts para el sitio web de Manuales BC
 * @author Adrián Espí Peña
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el resaltado de sintaxis
    if (typeof hljs !== 'undefined') {
        hljs.configure({
            languages: ['javascript', 'typescript', 'csharp', 'xml', 'css', 'html'],
            ignoreUnescapedHTML: true
        });
        
        document.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });
    }

    // Inicializar el portapapeles para los botones de copia
    if (typeof ClipboardJS !== 'undefined') {
        const clipboard = new ClipboardJS('.copy-btn');
        
        clipboard.on('success', function(e) {
            const originalText = e.trigger.innerHTML;
            e.trigger.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(function() {
                e.trigger.innerHTML = originalText;
            }, 2000);
            
            e.clearSelection();
        });
    }

    // Añadir efecto de desplazamiento suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Botón para volver arriba
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Agregar clase 'scrolled' al encabezado cuando se desplaza la página
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Menú móvil para pantallas pequeñas
    const createMobileMenu = () => {
        const nav = document.querySelector('nav');
        if (!nav) return;

        // Crear botón de menú móvil si no existe
        if (!document.querySelector('.mobile-menu-btn')) {
            const mobileMenuBtn = document.createElement('div');
            mobileMenuBtn.className = 'mobile-menu-btn';
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            
            mobileMenuBtn.addEventListener('click', function() {
                nav.classList.toggle('mobile-menu-open');
                
                // Cambiar icono
                if (nav.classList.contains('mobile-menu-open')) {
                    this.innerHTML = '<i class="fas fa-times"></i>';
                } else {
                    this.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
            
            // Insertar el botón antes del primer elemento del menú
            const firstListItem = nav.querySelector('ul li:first-child');
            if (firstListItem) {
                firstListItem.parentNode.insertBefore(mobileMenuBtn, firstListItem);
            }
        }

        // Agregar manejo de eventos para cerrar submenús en móvil
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const dropbtn = dropdown.querySelector('.dropbtn');
            
            if (dropbtn) {
                dropbtn.addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        this.parentNode.classList.toggle('dropdown-open');
                    }
                });
            }
        });
    };

    // Inicializar menú móvil
    createMobileMenu();
    
    // Actualizar menú móvil si cambia el tamaño de la ventana
    window.addEventListener('resize', createMobileMenu);
});

// Funciones adicionales para mejoras específicas de la página
function initializeToc() {
    const headings = document.querySelectorAll('h2[id], h3[id]');
    const tocList = document.querySelector('.toc ul');
    
    if (!tocList || headings.length === 0) return;
    
    // Limpiar TOC existente
    tocList.innerHTML = '';
    
    // Reconstruir TOC basado en los encabezados de la página
    headings.forEach(heading => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        const icon = document.createElement('i');
        
        icon.className = heading.querySelector('i') ? heading.querySelector('i').className : 'fas fa-circle';
        
        link.appendChild(icon);
        link.appendChild(document.createTextNode(' ' + heading.textContent.replace(icon.textContent, '')));
        link.href = '#' + heading.id;
        
        // Añadir indentación para los h3
        if (heading.tagName === 'H3') {
            listItem.style.paddingLeft = '1rem';
        }
        
        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });
}

// Inicializar la tabla de contenidos si existe
if (document.querySelector('.toc')) {
    initializeToc();
}