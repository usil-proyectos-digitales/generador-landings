import { initDynamicCarousel } from '../../utils/carousel-manager.js';

/**
 * Inicializa el widget Bloque Videos.
 * @param {HTMLElement} container 
 */
export const init = (container) => {
    // Si container es nulo o indefinido, salir
    if (!container) return;
    if (!container.querySelector || !container.querySelector('[id^="bloque-videos-v10-"]')) return;

    // console.log('Bloque Videos inicializado', container);

    const doc = container.ownerDocument || document;
    const win = doc.defaultView || window;

    // --- DEFINICIONES DE FUNCIONES ---

    // Inicializar carrusel para v10.1
    const initVideosCarousel = () => {
        // Buscar la sección dentro del contenedor, o verificar si el contenedor mismo es la sección
        let sections = [];
        if (container.matches && container.matches('section[data-widget-variant="v10.1"]')) {
            sections = [container];
        } else {
            sections = container.querySelectorAll('section[data-widget-variant="v10.1"]');
        }
        
        sections.forEach(section => {
            const gridContainer = section.querySelector('.hk-videos');
            if (!gridContainer) return;

            initDynamicCarousel({
                container: gridContainer,
                itemSelector: '.hk-video-item',
                threshold: 3, // Activar si hay más de 3 elementos (4 o más)
                removeClasses: ['flex', 'gap-12', 'justify-center', 'items-center'],
                swiperConfig: {
                    watchSlidesProgress: true, // Necesario para detectar slides visibles
                    slidesPerView: 1,
                    spaceBetween: 24,
                    breakpoints: {
                        550: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        1000: {
                            slidesPerView: 3,
                            spaceBetween: 24,
                        },
                    },
                    on: {
                        init: function() {
                            this.slides.forEach(slide => {
                                slide.style.width = 'auto';
                                slide.classList.remove('w-[calc((100%-6rem)/3)]');
                            });
                        },
                        // Detectar cambios en el carrusel para pausar videos que salen de pantalla
                        slideChange: function() {
                            this.slides.forEach(slide => {
                                // Si el slide no tiene la clase visible, pausar su video
                                if (!slide.classList.contains('swiper-slide-visible')) {
                                    const liteEl = slide.querySelector('lite-youtube');
                                    if (liteEl) {
                                        const iframe = liteEl.shadowRoot ? liteEl.shadowRoot.querySelector('iframe') : null;
                                        if (iframe && iframe.contentWindow) {
                                            // console.log('[USIL-WIDGETS] Pausing hidden video in slide', slide);
                                            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            });
        });
    };

    // Inicializar Lite Youtube Overlays
    const initLiteYoutubeOverlays = () => {
        const liteEls = container.querySelectorAll('lite-youtube');
        liteEls.forEach(el => {
            // Buscar overlays en el padre (wrapper .hk-video)
            const wrapper = el.closest('.hk-video');
            if (!wrapper) return;

            const overlays = wrapper.querySelectorAll('.hk-lite-play-overlay, .hk-lite-title-overlay, .hk-lite-full-overlay');
            if (!overlays.length) return;

            const hide = () => { 
                overlays.forEach(o => o.style.display = 'none'); 
            };

            // Verificar si ya está activo (iframe presente)
            if (el.shadowRoot && (el.shadowRoot.querySelector('iframe') || el.classList.contains('lyt-activated'))) {
                hide();
                return;
            }

            // Detectar click en el wrapper (captura para asegurar que lo atrapamos)
            // Usamos el wrapper porque los overlays tienen pointer-events: none, así que el click llega al lite-youtube
            // pero capturarlo en el wrapper es más seguro y cubre todo el área.
            wrapper.addEventListener('click', hide, { once: true, capture: true });
            
            // También observar cambios en el shadowRoot por si se activa de otra forma (teclado, autoplay, etc)
            if (el.shadowRoot) {
                const mo = new MutationObserver(() => {
                    const frame = el.shadowRoot.querySelector('#frame');
                    const hasIframe = el.shadowRoot.querySelector('iframe');
                    const activated = (frame && frame.classList.contains('activated')) || el.classList.contains('lyt-activated');
                    
                    if (hasIframe || activated) {
                        hide();
                        mo.disconnect();
                    }
                });
                mo.observe(el.shadowRoot, { childList: true, subtree: true, attributes: true });
            } else {
                // Fallback si shadowRoot no está abierto o disponible aún (Elementor a veces retrasa la hidratación)
                // Intentar un polling breve
                let checks = 0;
                const checkShadow = setInterval(() => {
                    checks++;
                    if (el.shadowRoot || checks > 20) {
                        clearInterval(checkShadow);
                        if (el.shadowRoot) {
                             const mo = new MutationObserver(() => {
                                const frame = el.shadowRoot.querySelector('#frame');
                                const hasIframe = el.shadowRoot.querySelector('iframe');
                                const activated = (frame && frame.classList.contains('activated')) || el.classList.contains('lyt-activated');
                                
                                if (hasIframe || activated) {
                                    hide();
                                    mo.disconnect();
                                }
                            });
                            mo.observe(el.shadowRoot, { childList: true, subtree: true, attributes: true });
                        }
                    }
                }, 100);
            }
        });
    };

    // Inicializar control de concurrencia (solo un video reproduciendo a la vez)
    const initVideoConcurrency = () => {
        const liteEls = container.querySelectorAll('lite-youtube');
        
        // 1. Configuración de parámetros para CADA video en este widget
        liteEls.forEach(el => {
            let params = el.getAttribute('params') || '';
            let needsUpdate = false;
            
            // Asegurarnos que enablejsapi=1 esté presente
            if (!params.includes('enablejsapi=1')) {
                params = params ? `${params}&enablejsapi=1` : 'enablejsapi=1';
                needsUpdate = true;
            }

            if (!params.includes('origin=')) {
                // En Elementor, el origin puede ser complejo si estamos en un iframe
                const origin = win.location.origin;
                params = `${params}&origin=${origin}&widget_referrer=${origin}`;
                needsUpdate = true;
            }

            if (needsUpdate) {
                el.setAttribute('params', params);
            }
        });

        // 2. Inicializar Gestor Global (Solo una vez por página)
        if (!win._usilVideoManagerInitialized) {
            win._usilVideoManagerInitialized = true;
            
            console.log('[USIL-WIDGETS] Initializing Global Video Manager');

            const pauseAllOthers = (currentEl) => {
                // Buscar TODOS los videos en el documento (incluyendo otros widgets)
                const allVideos = doc.querySelectorAll('lite-youtube');
                console.log(`[USIL-WIDGETS] Found ${allVideos.length} total videos. Current is:`, currentEl);
                
                allVideos.forEach(other => {
                    if (other === currentEl) return;
                    
                    // Intentar pausar
                    const iframe = other.shadowRoot ? other.shadowRoot.querySelector('iframe') : null;
                    if (iframe && iframe.contentWindow) {
                        // Usar objeto JSON y stringify para asegurar formato correcto
                        try {
                            const command = JSON.stringify({
                                "event": "command",
                                "func": "pauseVideo",
                                "args": []
                            });
                            console.log('[USIL-WIDGETS] Sending pause command to', other);
                            iframe.contentWindow.postMessage(command, '*');
                        } catch (e) {
                            console.error('[USIL-WIDGETS] Error sending pause command', e);
                        }
                    } else {
                        console.log('[USIL-WIDGETS] Skipping video (no iframe or contentWindow)', other);
                    }
                });
            };

            // A. Delegación de eventos Global para Clicks
            doc.addEventListener('click', (e) => {
                const liteEl = e.target.closest('lite-youtube');
                if (liteEl) {
                    console.log('[USIL-WIDGETS] Global click detected on', liteEl);
                    pauseAllOthers(liteEl);
                }
            }, { capture: true }); // Capture para interceptar antes del iframe


        // B. Polling Global de Foco (para detectar cambios dentro de iframes)
        let lastActiveVideo = null;
        
        setInterval(() => {
            if (typeof customElements !== 'undefined' && customElements.get('lite-youtube')) {
                // Buscar en todos los lite-youtube del documento
                const allVideos = doc.querySelectorAll('lite-youtube');
                
                allVideos.forEach(el => {
                    // Verificar si el shadowRoot tiene el foco activo
                    if (el.shadowRoot && el.shadowRoot.activeElement) {
                        const shadowActive = el.shadowRoot.activeElement;
                        if (shadowActive.tagName === 'IFRAME') {
                                // Este video tiene el foco activo
                                if (el !== lastActiveVideo) {
                                // console.log('[USIL-WIDGETS] Focus switched to new video', el);
                                pauseAllOthers(el);
                                lastActiveVideo = el;
                            }
                        }
                    }
                });
            }
        }, 800); // Chequear cada 800ms
    }
};

// --- EJECUCIÓN ---
// Esperar a que lite-youtube esté definido
if (typeof customElements !== 'undefined') {
    customElements.whenDefined('lite-youtube').then(() => {
        // console.log('[USIL-WIDGETS] lite-youtube defined, initializing concurrency logic.');
        initVideoConcurrency();
    });
} else {
    console.error('[USIL-WIDGETS] customElements API not supported.');
    // Fallback?
    initVideoConcurrency();
}

// --- 1. Lógica del Selector de Variantes (Solo para Preview) ---
// En Elementor NO ejecutamos el selector de variantes para no ocultar la sección activa
if (!win.elementorFrontend) {
        
        let controlsSlot = doc.getElementById('widget-controls-slot');
        let parentDoc = null;

        // Intentar buscar en el documento padre si estamos en un iframe
        if (!controlsSlot && win.parent && win.parent.document) {
            try {
                parentDoc = win.parent.document;
                controlsSlot = parentDoc.getElementById('widget-controls-slot');
            } catch (e) {
                console.warn('No se pudo acceder al documento padre (Cross-Origin?):', e);
            }
        }

        if (!controlsSlot) {
            initVideosCarousel();
            initLiteYoutubeOverlays();
            initVideoConcurrency();
            return;
        }

        const controlsPanel = (parentDoc || doc).createElement('div');
        
        const variants = [ 
            { value: 'v10.1', label: '10.1: Videos en 3 columnas + Carrusel' }, 
            { value: 'v10.2', label: '10.2: Video Vertical Derecha' }, 
            { value: 'v10.4', label: '10.4: Video Full Width' }, 
            { value: 'v10.5', label: '10.5: Video Central' } 
        ]; 

        const optionsHtml = variants.map(v => `<option value="${v.value}">${v.label}</option>`).join(''); 

        controlsPanel.className = 'flex gap-3 items-center px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200'; 
        controlsPanel.innerHTML = ` 
            <span class="text-xs font-bold tracking-wider text-gray-500 uppercase">Variante:</span> 
            <select id="variant-selector-10" class="block px-2 py-1 text-sm text-gray-700 bg-white rounded border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"> 
                ${optionsHtml} 
            </select> 
        `; 
        controlsSlot.innerHTML = ''; 
        controlsSlot.appendChild(controlsPanel); 

        const select = controlsPanel.querySelector('#variant-selector-10'); 
        const savedVariant = localStorage.getItem('usil-widget-variant-10') || 'v10.1'; 

        // Función para actualizar visibilidad 
        const updateVisibility = (variant) => { 
            const sections = container.querySelectorAll('section[data-widget-variant]'); 
            sections.forEach(sec => { 
                if (sec.dataset.widgetVariant === variant) { 
                    sec.style.display = ''; 
                    // Reinicializar carrusel si es la variante 10.1 
                    if (variant === 'v10.1') { 
                        setTimeout(() => { 
                            initVideosCarousel(); 
                        }, 50); 
                    } 
                } else { 
                    sec.style.display = 'none'; 
                } 
            }); 
        }; 

        // Event listener 
        select.addEventListener('change', (e) => { 
            const val = e.target.value; 
            localStorage.setItem('usil-widget-variant-10', val); 
            updateVisibility(val); 
        }); 

        // Inicializar estado actual 
        select.value = savedVariant; 
        updateVisibility(savedVariant); 

    } else {
        // En Elementor, aseguramos que el carrusel se inicialice si corresponde
        initVideosCarousel();
    }

    // --- 2. Funciones de Inicialización Específicas ---
    initLiteYoutubeOverlays();
    initVideoConcurrency();
};

// Exportar activate para compatibilidad con main.js
export const activate = init;
