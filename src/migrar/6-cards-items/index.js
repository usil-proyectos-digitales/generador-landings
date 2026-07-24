import { initDynamicCarousel } from '../../utils/carousel-manager.js';

/**
 * Inicializa el carrusel para la variante 6.8
 * Puede ser llamado independientemente del selector de variantes
 * @param {HTMLElement} context - El contenedor donde buscar (puede ser document o un wrapper)
 */
export const initCarouselV68 = (context = document) => {
    const sections = context.querySelectorAll('section[data-widget-variant="v6.8"]');
    
    sections.forEach(section => {
        const gridContainer = section.querySelector('.hk-cards-grid-v6-8');
        
        initDynamicCarousel({
            container: gridContainer,
            itemSelector: '.hk-card-6-8',
            threshold: 4,
            removeClasses: [
                'flex', 'flex-wrap', 'gap-4', 'justify-center', 
                'max-w-[270px]', 'md:max-w-[560px]', 'lg:max-w-[850px]', 'xl:max-w-[1140px]', 'mx-auto'
            ],
            swiperConfig: {
                centeredSlides: false,
                breakpoints: {
                    576: {
                        slidesPerView: 2,
                        centeredSlides: false,
                        spaceBetween: 20
                    },
                    1000: {
                        slidesPerView: 4, 
                        centeredSlides: false,
                        spaceBetween: 32
                    }
                }
            }
        });
    });
};

/**
 * Inicializa el layout para la variante 6.3
 * Ajusta el ancho de las cards según la cantidad
 * @param {HTMLElement} context 
 */
export const initLayoutV63 = (context = document) => {
    const sectionsV63 = context.querySelectorAll('section[data-widget-variant="v6.3"]');
    sectionsV63.forEach(sectionV63 => {
        const cardsContainer = sectionV63.querySelector('.hk-cards-grid-v6-3') || sectionV63.querySelector('.flex.flex-wrap.gap-8');
        if (cardsContainer) {
            const cards = Array.from(cardsContainer.children).filter(el => el.tagName === 'DIV');
            const count = cards.length;
            
            cards.forEach(card => {
                card.classList.remove('lg:w-[30%]', 'lg:w-[calc(50%-2rem)]', 'md:w-[calc(50%-2rem)]');
                card.classList.add('w-full', 'md:w-[calc(50%-2rem)]');

                if (count === 4) {
                    card.classList.add('lg:w-[calc(50%-1rem)]');
                } else if (count % 3 === 0) {
                    card.classList.add('lg:w-[30%]');
                } else {
                    card.classList.add('lg:w-[calc(50%-2rem)]');
                }
            });
        }
    });
};

/**
 * Inicializa el layout para la variante 6.6
 * Ajusta el ancho de las cards según la cantidad
 * @param {HTMLElement} context 
 */
export const initLayoutV66 = (context = document) => {
    const sectionsV66 = context.querySelectorAll('section[data-widget-variant="v6.6"]');
    sectionsV66.forEach(sectionV66 => {
        // Buscar el contenedor específico con la clase hk-cards-container
        const cardsContainer = sectionV66.querySelector('.hk-cards-container');
        
        if (cardsContainer) {
            // Obtener solo los hijos directos que sean divs (las cards)
            const cards = Array.from(cardsContainer.children).filter(el => el.tagName === 'DIV');
            const count = cards.length;
            
            cards.forEach(card => {
                // Limpiar clases de ancho anteriores para evitar conflictos
                // Es importante remover todas las variantes posibles que hayamos usado
                card.classList.remove(
                    'w-full', 
                    'md:w-[calc(50%-1rem)]', 'md:w-[calc(50%_-_1rem)]',
                    'lg:w-[calc(50%-1rem)]', 'lg:w-[calc(50%_-_1rem)]',
                    'lg:w-[calc((100%-4rem)/3)]', 'lg:w-[calc((100%_-_4rem)/3)]'
                );
                
                // Aplicar clases base siempre: 
                // Mobile: w-full (1 columna)
                // Tablet (md): w-[calc(50%_-_1rem)] (2 columnas)
                card.classList.add('w-full', 'md:w-[calc(50%_-_1rem)]');

                // Lógica Desktop (lg)
                if (count === 4 || count === 2) {
                    // Si son 2 o 4 items -> 2 columnas también en desktop
                    card.classList.add('lg:w-[calc(50%_-_1rem)]');
                } else {
                    // Si son 3, 5, 6 items -> 3 columnas en desktop
                    // Usamos underscores para asegurar compatibilidad con calc() en build
                    card.classList.add('lg:w-[calc((100%_-_4rem)/3)]');
                }
            });
        }
    });
};

/**
 * Inicializa el layout para la variante 6.11
 * Ajusta el ancho de las cards según la cantidad
 * @param {HTMLElement} context 
 */
export const initLayoutV611 = (context = document) => {
    const sectionsV611 = context.querySelectorAll('section[data-widget-variant="v6.11"]');
    sectionsV611.forEach(sectionV611 => {
        const cardsContainer = sectionV611.querySelector('.hk-cards-container') || sectionV611.querySelector('.flex.flex-wrap.gap-8');
        if (cardsContainer) {
            const cards = Array.from(cardsContainer.children).filter(el => el.tagName === 'DIV');
            const count = cards.length;
            
            cards.forEach(card => {
                // Reset classes
                card.classList.remove('lg:w-[calc((100%-4rem)/3)]', 'lg:w-[calc(50%-1rem)]', 'md:w-[calc(50%-1rem)]', 'w-full', 'max-w-[400px]', 'lg:max-w-none');
                
                // Base classes
                card.classList.add('w-full', 'max-w-[400px]', 'md:w-[calc(50%-1rem)]', 'lg:max-w-none');

                if (count === 4) {
                    card.classList.add('lg:w-[calc(50%-1rem)]');
                } else {
                    // 3, 5, 6 items -> 3 columns
                    card.classList.add('lg:w-[calc((100%-4rem)/3)]');
                }
            });
        }
    });
};

/**
 * Inicializa el layout para la variante 6.12
 * Ajusta el ancho de las cards según la cantidad
 * @param {HTMLElement} context 
 */
export const initLayoutV612 = (context = document) => {
    const sectionsV612 = context.querySelectorAll('section[data-widget-variant="v6.12"]');
    sectionsV612.forEach(sectionV612 => {
        const cardsContainer = sectionV612.querySelector('.hk-cards-container') || sectionV612.querySelector('.flex.flex-wrap.gap-8');
        if (cardsContainer) {
            const cards = Array.from(cardsContainer.children).filter(el => el.tagName === 'DIV');
            const count = cards.length;
            
            cards.forEach(card => {
                // Reset classes
                card.classList.remove('lg:w-[30%]', 'lg:w-[calc(50%-1rem)]', 'md:w-[calc(50%-1rem)]', 'w-full', 'max-w-[350px]', 'lg:max-w-none');
                
                // Base classes
                card.classList.add('w-full', 'max-w-[350px]', 'md:w-[calc(50%-1rem)]', 'lg:max-w-none');

                if (count === 4) {
                    card.classList.add('lg:w-[calc(50%-1rem)]');
                } else {
                    // 3, 5, 6 items -> 3 columns (using calculated width for gap)
                    card.classList.add('lg:w-[calc((100%-4rem)/3)]');
                }
            });
        }
    });
};

/**
 * Inicializa todas las funcionalidades del widget Cards Items
 * Útil para llamar desde el frontend de WordPress
 * @param {HTMLElement} context 
 */
export const activate = (context = document) => {
    initCarouselV68(context);
    initLayoutV63(context);
    initLayoutV66(context);
    initLayoutV611(context);
    initLayoutV612(context);
};

/**
 * Inicializa el widget Cards Items.
 * Incluye lógica para cambiar entre variantes (simulando controles de Elementor).
 * @param {HTMLElement} container 
 */
export const init = (container) => {
    console.log('Cards Items inicializado');
    
    const doc = container.ownerDocument; // Usar el documento del contenedor (iframe)
    const win = doc.defaultView;

    // 1. Inyectar Selector de Variantes
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

    const controlsPanel = (parentDoc || doc).createElement('div');

    const variants = [
        { value: 'v6.3', label: '6.3 (Cards Centradas)' },
        { value: 'v6.6', label: '6.6 (Cards Icono Izq)' },
        { value: 'v6.8', label: '6.8 (Cards Verticales)' },
        { value: 'v6.10', label: '6.10 (Dos Cards grandes)' },
        { value: 'v6.11', label: '6.11 (Cards venta con CTA)' },
        { value: 'v6.12', label: '6.12 (Cards con fecha)' }
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
    const STORAGE_KEY = 'cards-items-active-variant';
    const savedVariant = localStorage.getItem(STORAGE_KEY) || 'v6.3';

    // 4. Lógica para Variante 6.8 (Carrusel si > 4 items)
    // Usamos la función exportada que maneja esto globalmente
    const runVariant68Logic = () => initCarouselV68(container);

    const updateVisibility = (variant) => {
        let found = false;
        sections.forEach(section => {
            if (section.dataset.widgetVariant === variant) {
                section.classList.remove('hidden');
                found = true;

                if (variant === 'v6.8') {
                    runVariant68Logic();
                }
            } else {
                section.classList.add('hidden');
            }
        });
        
        // Fallback: si la variante guardada no existe (ej. cambio de nombres), mostrar la primera
        if (!found && sections.length > 0) {
            sections[0].classList.remove('hidden');
            selector.value = sections[0].dataset.widgetVariant;
            if (sections[0].dataset.widgetVariant === 'v6.8') {
                runVariant68Logic();
            }
        }
    };

    // 3. Lógica específica para layouts dinámicos
    const updateCardLayout = () => {
        initLayoutV63(container);
        initLayoutV66(container);
        initLayoutV611(container);
        initLayoutV612(container);
    };

    // Ejecutar lógica de layout al inicio y al cambiar variante
    updateCardLayout();

    selector.addEventListener('change', (e) => {
        const newVariant = e.target.value;
        updateVisibility(newVariant);
        localStorage.setItem(STORAGE_KEY, newVariant);
        // Re-check layout
        if (['v6.3', 'v6.6', 'v6.11', 'v6.12'].includes(newVariant)) {
            updateCardLayout();
        }
    });

    // Estado inicial
    updateVisibility(savedVariant);
};
