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

    // Construir la navegación a partir de la configuración
    populateManualesNavigation();
    populateRecursosNavigation();
    populateSocialLinks();

    // Renderizar tarjetas de manuales y recursos
    renderManuales();
    renderRecursos();

    console.log('Interfaz actualizada con la configuración');
}

// Crear un enlace de navegación con icono
function createNavLink(icon, title, href, external = false) {
    const link = document.createElement('a');
    link.href = href;

    if (external) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }

    const iconEl = document.createElement('i');
    iconEl.className = icon;
    link.appendChild(iconEl);
    link.appendChild(document.createTextNode(` ${title}`));

    return link;
}

// Poblar el dropdown de manuales
function populateManualesNavigation() {
    const container = document.getElementById('manuales-dropdown');
    const manuales = siteConfig.getManuales();

    if (container && manuales.length) {
        container.innerHTML = '';
        manuales.forEach(manual => {
            if (manual.file && manual.file !== '#') {
                container.appendChild(createNavLink(manual.icon || 'fas fa-file', manual.title, manual.file));
            }
        });
    }
}

// Poblar el dropdown de recursos
function populateRecursosNavigation() {
    const container = document.getElementById('recursos-dropdown');
    const recursos = siteConfig.getRecursos();

    if (container && recursos.length) {
        container.innerHTML = '';
        recursos.forEach(recurso => {
            if (recurso.url) {
                container.appendChild(createNavLink(recurso.icon || 'fas fa-link', recurso.title, recurso.url, true));
            }
        });
    }
}

// Poblar el dropdown y el pie con las redes sociales
function populateSocialLinks() {
    const container = document.getElementById('social-dropdown');
    const footerContainer = document.getElementById('footer-social-links');
    const socialLinks = siteConfig.getSocialLinks();

    const items = [
        { key: 'linkedin', icon: 'fab fa-linkedin', title: 'LinkedIn' },
        { key: 'youtube', icon: 'fab fa-youtube', title: 'YouTube' },
        { key: 'cv', icon: 'fas fa-user', title: 'CV' },
        { key: 'github', icon: 'fab fa-github', title: 'GitHub' }
    ];

    if (container) {
        container.innerHTML = '';
        items.forEach(item => {
            const url = socialLinks[item.key];
            if (url) {
                container.appendChild(createNavLink(item.icon, item.title, url, true));
            }
        });
    }

    if (footerContainer) {
        footerContainer.innerHTML = '';
        items.forEach(item => {
            const url = socialLinks[item.key];
            if (url) {
                const link = createNavLink(item.icon, '', url, true);
                footerContainer.appendChild(link);
            }
        });
    }
}

// Renderizar las tarjetas de manuales en la página principal
function renderManuales() {
    const container = document.getElementById('manuales-container');
    const manuales = siteConfig.getManuales();

    if (!container || !manuales.length) return;

    container.innerHTML = '';

    manuales.forEach(manual => {
        const card = document.createElement('div');
        card.className = 'card';

        const icon = document.createElement('i');
        icon.className = `${manual.icon || 'fas fa-file-alt'} card-icon`;
        icon.setAttribute('aria-hidden', 'true');

        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';

        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = manual.title;

        const desc = document.createElement('p');
        desc.className = 'card-text';
        desc.textContent = manual.description;

        const link = document.createElement('a');
        link.className = 'btn';
        link.href = manual.file;
        link.innerHTML = '<i class="fas fa-book-open" aria-hidden="true"></i> Leer manual';

        cardContent.appendChild(title);
        cardContent.appendChild(desc);
        cardContent.appendChild(link);

        card.appendChild(icon);
        card.appendChild(cardContent);
        container.appendChild(card);
    });
}

// Renderizar las tarjetas de recursos en la página principal
function renderRecursos() {
    const container = document.getElementById('recursos-grid');
    const recursos = siteConfig.getRecursos();

    if (!container || !recursos.length) return;

    container.innerHTML = '';

    recursos.forEach(recurso => {
        const card = document.createElement('div');
        card.className = 'card';

        const icon = document.createElement('i');
        icon.className = `${recurso.icon || 'fas fa-link'} card-icon`;
        icon.setAttribute('aria-hidden', 'true');

        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';

        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = recurso.title;

        const desc = document.createElement('p');
        desc.className = 'card-text';
        desc.textContent = recurso.description;

        const link = document.createElement('a');
        link.className = 'btn btn-outline';
        link.href = recurso.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = '<i class="fas fa-external-link-alt" aria-hidden="true"></i> Abrir recurso';

        cardContent.appendChild(title);
        cardContent.appendChild(desc);
        cardContent.appendChild(link);

        card.appendChild(icon);
        card.appendChild(cardContent);
        container.appendChild(card);
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
