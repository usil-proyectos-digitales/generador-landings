import { initDynamicCarousel } from '../../utils/carousel-manager.js';

/**
 * Inicializa el widget Bloque Ponentes Testimonios.
 * @param {HTMLElement} container 
 */
export const init = (container) => {
    console.log('Bloque Ponentes Testimonios inicializado');
    
    const doc = container.ownerDocument;
    const win = doc.defaultView;

    // 1. Inyectar Selector de Variantes (Simulación)
    let controlsSlot = doc.getElementById('widget-controls-slot');
    let parentDoc = null;

    if (!controlsSlot && win.parent && win.parent.document) {
        try {
            parentDoc = win.parent.document;
            controlsSlot = parentDoc.getElementById('widget-controls-slot');
        } catch (e) {
            console.warn('No se pudo acceder al documento padre (Cross-Origin?):', e);
        }
    }

    const controlsPanel = (parentDoc || doc).createElement('div');

    const variants = [
        { value: 'v7.2', label: '7.2 (Titulo + Párrafo + Card 1 Ponente)' },
        { value: 'v7.4', label: '7.4 (Titulo + Ponentes Cuadrados)' },
        { value: 'v7.5', label: '7.5 (Título Izquierda + Parrafo Intro + Cards con fotos grandes)' }
    ];
    const optionsHtml = variants.map(v => `<option value="${v.value}">${v.label}</option>`).join('');
    
    if (controlsSlot) {
        controlsPanel.className = 'flex gap-3 items-center px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200';
        controlsPanel.innerHTML = `
            <span class="text-xs font-bold tracking-wider text-gray-500 uppercase">Variante:</span>
            <select id="variant-selector" class="block px-2 py-1 text-sm text-gray-700 bg-white rounded border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none">
                ${optionsHtml}
            </select>
        `;
        controlsSlot.innerHTML = '';
        controlsSlot.appendChild(controlsPanel);
    } else {
        controlsPanel.className = 'flex fixed right-4 bottom-4 z-50 flex-col gap-2 p-4 font-sans bg-white rounded-lg border border-gray-200 shadow-xl';
        controlsPanel.innerHTML = `
            <label class="text-xs font-bold text-gray-500 uppercase">Configuración Elementor (Simulada)</label>
            <select id="variant-selector" class="block p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                ${optionsHtml}
            </select>
        `;
        container.appendChild(controlsPanel);
    }

    // 2. Lógica de cambio de variante
    const selector = controlsPanel.querySelector('#variant-selector');
    const sections = container.querySelectorAll('section[data-widget-variant]');
    const STORAGE_KEY = 'ponentes-testimonios-active-variant';
    const savedVariant = localStorage.getItem(STORAGE_KEY) || 'v7.2';

    const updateVisibility = (variant) => {
        let found = false;
        sections.forEach(section => {
            if (section.dataset.widgetVariant === variant) {
                section.classList.remove('hidden');
                found = true;

                // Si es v7.4, ejecutar lógica de carrusel
                if (variant === 'v7.4') {
                    initVariant74(container);
                }
                // Si es v7.5, ejecutar lógica de carrusel
                if (variant === 'v7.5') {
                    initVariant75(container);
                }
            } else {
                section.classList.add('hidden');
            }
        });
        
        if (!found && sections.length > 0) {
            sections[0].classList.remove('hidden');
            selector.value = sections[0].dataset.widgetVariant;
            if (sections[0].dataset.widgetVariant === 'v7.4') {
                initVariant74(container);
            }
            if (sections[0].dataset.widgetVariant === 'v7.5') {
                initVariant75(container);
            }
        }
    };

    selector.value = savedVariant;

    selector.addEventListener('change', (e) => {
        const newVariant = e.target.value;
        updateVisibility(newVariant);
        localStorage.setItem(STORAGE_KEY, newVariant);
    });

    updateVisibility(savedVariant);
};

/**
 * Inicializa el carrusel para la variante 7.4 si hay > 4 items
 * Lógica centralizada con initDynamicCarousel
 * @param {HTMLElement} context 
 */
export const initVariant74 = (context = document) => {
    const sections = context.querySelectorAll('section[data-widget-variant="v7.4"]');
    
    sections.forEach(section => {
        const gridContainer = section.querySelector('.ponentes-grid-v7-4');
        
        initDynamicCarousel({
            container: gridContainer,
            itemSelector: '.hk-card',
            threshold: 4,
            swiperConfig: {
                spaceBetween: 20,
                breakpoints: {
                    550: { slidesPerView: 2 },
                    850: { slidesPerView: 3 },
                    1000: { slidesPerView: 4 }
                }
            }
        });
    });
};

/**
 * Inicializa el carrusel para la variante 7.5 si hay > 4 items
 * Lógica centralizada con initDynamicCarousel
 * @param {HTMLElement} context 
 */
export const initVariant75 = (context = document) => {
    const sections = context.querySelectorAll('section[data-widget-variant="v7.5"]');
    
    sections.forEach(section => {
        const gridContainer = section.querySelector('.hk-ponentes');
        
        initDynamicCarousel({
            container: gridContainer,
            itemSelector: '.hk-box-ponente',
            threshold: 4,
            removeClasses: ['grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4', 'gap-y-8', 'sm:gap-[2px]'],
            swiperConfig: {
                spaceBetween: 2,
                breakpoints: {
                    550: { slidesPerView: 2 },
                    850: { slidesPerView: 3 },
                    1000: { slidesPerView: 4 }
                }
            }
        });
    });
};

/**
 * Función de activación para Elementor / Producción
 * @param {HTMLElement} container - El contenedor del widget o el documento
 */
export const activate = (container) => {
    initVariant74(container);
    initVariant75(container);
};
