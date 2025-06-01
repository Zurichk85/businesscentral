/**
 * Configuración para Google Analytics
 * BC Manuales - Sitio Web de Business Central
 */

// Configuración de Google Analytics
const ANALYTICS_CONFIG = {
    // Cambiar por tu ID de Google Analytics cuando esté listo para producción
    GA_TRACKING_ID: 'GA_TRACKING_ID_PLACEHOLDER',
    
    // Configuración de eventos personalizados
    events: {
        MANUAL_VIEW: 'manual_view',
        SEARCH_PERFORMED: 'search_performed',
        RESOURCE_CLICKED: 'resource_clicked',
        CODE_COPIED: 'code_copied'
    },
    
    // Configuración de seguimiento
    trackingOptions: {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
    }
};

/**
 * Inicializar Google Analytics
 */
function initializeAnalytics() {
    // Solo inicializar si tenemos un ID válido y no es placeholder
    if (ANALYTICS_CONFIG.GA_TRACKING_ID && 
        ANALYTICS_CONFIG.GA_TRACKING_ID !== 'GA_TRACKING_ID_PLACEHOLDER') {
        
        // Cargar el script de Google Analytics
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA_TRACKING_ID}`;
        document.head.appendChild(script);
        
        // Configurar gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', ANALYTICS_CONFIG.GA_TRACKING_ID, ANALYTICS_CONFIG.trackingOptions);
        
        console.log('📊 Google Analytics inicializado');
    } else {
        console.log('📊 Google Analytics no configurado (modo desarrollo)');
    }
}

/**
 * Enviar evento personalizado
 */
function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
}

/**
 * Seguimiento específico para el sitio
 */
function trackManualView(manualId, manualTitle) {
    trackEvent(ANALYTICS_CONFIG.events.MANUAL_VIEW, {
        'manual_id': manualId,
        'manual_title': manualTitle
    });
}

function trackSearch(searchTerm, resultsCount) {
    trackEvent(ANALYTICS_CONFIG.events.SEARCH_PERFORMED, {
        'search_term': searchTerm,
        'results_count': resultsCount
    });
}

function trackResourceClick(resourceId, resourceTitle) {
    trackEvent(ANALYTICS_CONFIG.events.RESOURCE_CLICKED, {
        'resource_id': resourceId,
        'resource_title': resourceTitle
    });
}

function trackCodeCopy(codeType) {
    trackEvent(ANALYTICS_CONFIG.events.CODE_COPIED, {
        'code_type': codeType
    });
}

// Exportar funciones globalmente si no estamos en un módulo
if (typeof module === 'undefined') {
    window.Analytics = {
        init: initializeAnalytics,
        trackManualView,
        trackSearch,
        trackResourceClick,
        trackCodeCopy
    };
}
