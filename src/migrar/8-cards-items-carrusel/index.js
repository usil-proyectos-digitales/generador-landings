import { createSwiperNavigation } from '../../utils/swiper-nav.js';
import { initDynamicCarousel } from '../../utils/carousel-manager.js';
import Swiper from 'swiper';
import { Mousewheel, Scrollbar, FreeMode } from 'swiper/modules';

/**
 * Inicializa el carrusel para la variante 8.1
 * @param {HTMLElement} context 
 */
export const initCarouselV81 = (context = document) => {
    const sections = context.querySelectorAll('section[data-widget-variant="v8.1"]');
    
    sections.forEach(section => {
        // Soporte para ID (legacy) y Clase (Widget PHP)
        const gridContainer = section.querySelector('#ponentes-grid-v8-1') || section.querySelector('.hk-cards-grid-v8-1');
        
        initDynamicCarousel({
            container: gridContainer,
            itemSelector: '.hk-card',
            threshold: 3, // Activar para más de 3 items (4 o más)
            removeClasses: ['flex', 'flex-wrap', 'gap-8', 'justify-center'],
            swiperConfig: {
                breakpoints: {
                    550: {
                        slidesPerView: 2,
                        centeredSlides: false,
                        spaceBetween: 20
                    },
                    1000: {
                        slidesPerView: 3,
                        centeredSlides: false,
                        spaceBetween: 30
                    },
                    1280: {
                        slidesPerView: 3, 
                        centeredSlides: false,
                        spaceBetween: 32
                    }
                }
            },
            onInit: (swiper, wrapper) => {
                // Estilos específicos que el carrusel manager no maneja por defecto
                swiper.slides.forEach(slide => {
                    slide.style.height = 'auto';
                    
                    // Eliminar clases de ancho responsivo de Tailwind que interfieren con los cálculos de Swiper
                    slide.classList.remove('w-full', 'md:w-[calc(50%-2rem)]', 'lg:w-[30%]', 'md:w-[calc(50%-2rem)]');
                    
                    // Forzar visibilidad y estilos del botón CTA cuando está en modo carrusel (Swiper)
                    const cta = slide.querySelector('.hk-card-cta');
                    /* if (cta) {
                        cta.style.setProperty('display', 'inline-flex', 'important');
                        cta.style.setProperty('opacity', '1', 'important');
                        cta.style.setProperty('visibility', 'visible', 'important');
                        cta.style.setProperty('background-color', '#002663', 'important'); // Brand Dark
                        cta.style.setProperty('color', '#ffffff', 'important');
                        cta.style.setProperty('border', '1px solid #002663', 'important');
                        cta.style.setProperty('border-radius', '2rem', 'important');
                    } */
                });
            }
        });
    });
};

/**
 * Inicializa el carrusel para la variante 8.3
 * @param {HTMLElement} context 
 */
export const initCarouselV83 = (context = document) => {
    const sections = context.querySelectorAll('section[data-widget-variant="v8.3"]');
    
    sections.forEach(section => {
        // Soporte para ID (legacy) y Clase (Widget PHP)
        const gridContainer = section.querySelector('#ponentes-grid-v8-3') || section.querySelector('.hk-cards-grid-v8-3');
        
        initDynamicCarousel({
            container: gridContainer,
            itemSelector: '.hk-card',
            threshold: 3, // Activar para más de 3 items (4 o más)
            removeClasses: ['flex', 'flex-wrap', 'gap-8', 'justify-center'],
            swiperConfig: {
                breakpoints: {
                    550: {
                        slidesPerView: 2,
                        centeredSlides: false,
                        spaceBetween: 20
                    },
                    1000: {
                        slidesPerView: 3,
                        centeredSlides: false,
                        spaceBetween: 30
                    },
                    1280: {
                        slidesPerView: 3, 
                        centeredSlides: false,
                        spaceBetween: 32
                    }
                }
            },
            onInit: (swiper, wrapper) => {
                swiper.slides.forEach(slide => {
                    slide.style.height = 'auto';
                    slide.style.setProperty('background-color', 'transparent', 'important');
                    
                    // Eliminar clases de ancho responsivo de Tailwind que interfieren con los cálculos de Swiper
                    slide.classList.remove('w-full', 'md:w-[calc((100%-4rem)/3)]');
                    
                    // Forzar estilos del botón CTA para evitar problemas de visualización en carrusel
                    const cta = slide.querySelector('.hk-card-cta');
                    if (cta) {
                        cta.style.setProperty('display', 'inline-flex', 'important');
                        cta.style.setProperty('align-items', 'center', 'important');
                        cta.style.setProperty('gap', '0.5rem', 'important');
                    }
                });
            }
        });
    });
};

/**
 * Inicializa el carrusel vertical para la variante 8.5
 * @param {HTMLElement} context 
 */
export const initCarouselV85 = (context = document) => {
    const sections = context.querySelectorAll('section[data-widget-variant="v8.5"]');
    
    sections.forEach(section => {
        const logosContainer = section.querySelector('.hk-logos');
        if (!logosContainer) return;

        initVerticalDynamicCarousel({
            container: logosContainer,
            itemSelector: '.hk-logo',
            threshold: 3,
            height: '600px',
            swiperConfig: {
                spaceBetween: 30
            }
        });
    });
};

/**
 * Inicializa un carrusel vertical dinámico (tipo scrollable logos/items).
 * Copia local de la lógica vertical si no se quiere migrar todo a carousel-manager.js aún,
 * o se puede importar si se agrega allá. Por ahora la mantengo aquí para asegurar funcionamiento.
 */
const initVerticalDynamicCarousel = ({
    container,
    itemSelector,
    threshold = 3,
    height = '600px',
    swiperConfig = {}
}) => {
    if (!container) return;
    if (container.classList.contains('swiper-initialized')) return;

    // Filtramos items
    const items = Array.from(container.children).filter(el => {
        if (itemSelector.startsWith('.')) {
            return el.classList.contains(itemSelector.substring(1));
        }
        return el.matches(itemSelector);
    });

    if (items.length <= threshold) return;

    console.log(`[CarouselManager] Activando carrusel vertical para ${items.length} items`);

    // Preparar contenedor
    container.classList.remove('space-y-12', 'flex', 'flex-col'); 
    container.classList.add('swiper');
    container.style.height = height;
    container.style.overflow = 'hidden';
    container.style.paddingRight = '20px'; // Espacio para scrollbar
    container.style.position = 'relative';

    const wrapper = document.createElement('div');
    wrapper.className = 'swiper-wrapper';
    
    items.forEach(item => {
        item.classList.add('swiper-slide');
        item.style.height = 'auto'; // Altura automática según contenido
        item.style.width = '100%'; // Asegurar ancho completo en el slide
        item.classList.remove('space-y-3'); // Remover espaciado vertical original si conflictua
        item.style.marginBottom = '30px'; // Añadir margen inferior como separación visual
        wrapper.appendChild(item);
    });
    
    container.innerHTML = '';
    container.appendChild(wrapper);

    // Scrollbar
    const scrollbar = document.createElement('div');
    scrollbar.className = 'swiper-scrollbar';
    container.appendChild(scrollbar);

    // Estilos custom para scrollbar (inyectado si no existe)
    const styleId = 'swiper-vertical-custom-style';
    if (!document.getElementById(styleId)) {
        const scrollStyle = document.createElement('style');
        scrollStyle.id = styleId;
        scrollStyle.innerHTML = `
            .swiper-scrollbar-drag {
                background-color: #002663 !important;
                opacity: 1 !important;
            }
            .swiper-slide {
                height: auto !important; /* Forzar altura auto */
            }
        `;
        document.head.appendChild(scrollStyle);
    }

    // Indicador de Scroll
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'hk-scroll-indicator';
    scrollIndicator.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 120px;
        background: linear-gradient(to bottom, transparent 0%, var(--hk-scroll-indicator-gradient, #F0F0F0) 100%);
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-bottom: 20px;
        pointer-events: none;
        z-index: 10;
        transition: opacity 0.5s ease;
    `;
    
    scrollIndicator.innerHTML = `
        <div class="hk-scroll-indicator__inner flex flex-col items-center opacity-70">
            <span class="hk-scroll-indicator__label text-[10px] font-bold uppercase tracking-widest mb-1" style="color: var(--hk-scroll-indicator-text, #002663);">Scroll</span>
            <svg class="hk-scroll-indicator__arrow w-6 h-6 animate-bounce" style="color: var(--hk-scroll-indicator-arrow, var(--hk-scroll-indicator-text, #002663));" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
    `;
    container.appendChild(scrollIndicator);

    const removeIndicator = () => {
        if (scrollIndicator && scrollIndicator.style.opacity !== '0') {
            scrollIndicator.style.opacity = '0';
            setTimeout(() => {
                if (scrollIndicator.parentNode) scrollIndicator.remove();
            }, 500);
        }
    };

    const finalConfig = {
        modules: [Mousewheel, Scrollbar, FreeMode],
        direction: 'vertical',
        slidesPerView: 'auto',
        spaceBetween: 0, // Controlado por margin-bottom en CSS
        freeMode: {
            enabled: true,
            sticky: false,
            momentumRatio: 0.25,
            momentumVelocityRatio: 0.25,
        },
        mousewheel: {
            releaseOnEdges: true,
            sensitivity: 1,
            forceToAxis: true,
        },
        scrollbar: {
            el: scrollbar,
            draggable: true,
            hide: false,
            snapOnRelease: false,
        },
        on: {
            sliderFirstMove: removeIndicator,
            slideChange: removeIndicator,
        },
        ...swiperConfig
    };

    const swiperInstance = new Swiper(container, finalConfig);

    container.addEventListener('wheel', removeIndicator, { once: true });
    container.addEventListener('touchstart', removeIndicator, { once: true });

    return swiperInstance;
};

/**
 * Función de activación para Elementor / Producción
 * @param {HTMLElement} context 
 */
export const activate = (context = document) => {
    initCarouselV81(context);
    initCarouselV83(context);
    initCarouselV85(context);
};

/**
 * Inicializa el widget Cards Items Carrusel (Modo Demo / Dev).
 * @param {HTMLElement} container 
 */
export const init = (container) => {
    console.log('Cards Items Carrusel inicializado');
    
    const doc = container.ownerDocument;
    const win = doc.defaultView;

    // 1. Inyectar Selector de Variantes
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
        { value: 'v8.1', label: '8.1 (Titulo + Cards Iconos Centrados)' },
        { value: 'v8.3', label: '8.3 (Titulo + Cards Imagen Superior)' },
        { value: 'v8.5', label: '8.5 (Titulo + Logos en Vertical)' }
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
    const STORAGE_KEY = 'cards-items-carrusel-active-variant';
    const savedVariant = localStorage.getItem(STORAGE_KEY) || 'v8.1';

    const updateVisibility = (variant) => {
        let found = false;
        sections.forEach(section => {
            if (section.dataset.widgetVariant === variant) {
                section.classList.remove('hidden');
                found = true;
                
                // Ejecutar lógica específica al mostrar
                if (variant === 'v8.1') initCarouselV81(container);
                if (variant === 'v8.3') initCarouselV83(container);
                if (variant === 'v8.5') initCarouselV85(container);

            } else {
                section.classList.add('hidden');
            }
        });
        
        if (!found && sections.length > 0) {
            sections[0].classList.remove('hidden');
            selector.value = sections[0].dataset.widgetVariant;
            // Run logic for default
            const defaultVariant = sections[0].dataset.widgetVariant;
            if (defaultVariant === 'v8.1') initCarouselV81(container);
            if (defaultVariant === 'v8.3') initCarouselV83(container);
            if (defaultVariant === 'v8.5') initCarouselV85(container);
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
