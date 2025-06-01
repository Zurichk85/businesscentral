# Configuración de Google Analytics para BC Manuales

## Pasos para configurar Google Analytics

1. **Crear cuenta de Google Analytics:**
   - Ir a https://analytics.google.com/
   - Crear una nueva propiedad para "BC Manuales"
   - Obtener el ID de seguimiento (formato: G-XXXXXXXXXX)

2. **Actualizar configuración:**
   - Editar `assets/js/analytics.js`
   - Reemplazar `GA_MEASUREMENT_ID` con tu ID real
   - Ejemplo: `'GA_MEASUREMENT_ID': 'G-ABC1234567'`

3. **Verificar implementación:**
   - Usar Google Tag Assistant para verificar
   - Comprobar eventos personalizados:
     - `manual_view`: Cuando se visualiza un manual
     - `search_performed`: Cuando se realiza una búsqueda
     - `resource_clicked`: Cuando se hace clic en un recurso
     - `code_copied`: Cuando se copia código

## Eventos personalizados implementados

```javascript
// Ejemplo de eventos trackados automáticamente
trackEvent('manual_view', {
  manual: 'personalizacion-paginas',
  title: 'Personalización de Páginas en Business Central'
});

trackEvent('search_performed', {
  query: 'api rest',
  results_count: 5
});

trackEvent('resource_clicked', {
  resource: 'traductor',
  url: 'https://rendbctrans.onrender.com/'
});

trackEvent('code_copied', {
  manual: 'integracion-apis',
  language: 'al'
});
```

## Configuración de objetivos

Se recomienda configurar los siguientes objetivos en Google Analytics:

1. **Engagement con manuales:** Tiempo en página > 2 minutos
2. **Interacción con código:** Evento `code_copied`
3. **Uso de recursos:** Evento `resource_clicked`
4. **Búsquedas exitosas:** Evento `search_performed` con resultados > 0

## Privacidad y GDPR

El sitio actualmente NO recopila cookies de terceros ni datos personales.
Solo se rastrea:
- Páginas visitadas
- Eventos de interacción anónimos
- No se almacenan IPs ni datos personales

Si decides implementar cookies, considera agregar un banner de consentimiento.
