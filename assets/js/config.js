/**
 * Configuración del sitio - BC Manuales
 * Carga la configuración desde el archivo config.json
 */

class SiteConfig {
  constructor() {
    this.config = null;
    this.loaded = false;
  }

  async load() {
    try {
      const response = await fetch('/config.json');
      if (!response.ok) {
        throw new Error(`Error cargando configuración: ${response.status}`);
      }
      this.config = await response.json();
      this.loaded = true;
      console.log('Configuración cargada con éxito');
      return this.config;
    } catch (error) {
      console.error('Error cargando la configuración:', error);
      return null;
    }
  }

  get(path) {
    if (!this.loaded) {
      console.warn('Configuración no cargada aún');
      return null;
    }

    const parts = path.split('.');
    let result = this.config;

    for (const part of parts) {
      if (result === null || result === undefined || typeof result !== 'object') {
        return null;
      }
      result = result[part];
    }

    return result;
  }

  getSiteName() {
    return this.get('siteName') || 'BC Manuales';
  }

  getAuthor() {
    return this.get('author') || 'Adrián Espí Peña';
  }

  getCopyright() {
    return this.get('copyright') || '2025 - Todos los derechos reservados';
  }

  getSocialLinks() {
    return this.get('socialLinks') || {};
  }

  getManuales() {
    return this.get('manuales') || [];
  }

  getRecursos() {
    return this.get('recursos') || [];
  }
}

// Exportar la instancia para uso global
const siteConfig = new SiteConfig();
