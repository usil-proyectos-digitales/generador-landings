import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination, Mousewheel, Scrollbar, FreeMode } from 'swiper/modules';
import { createSwiperNavigation } from './swiper-nav.js';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/free-mode';

/**
 * Inicializa un carrusel dinámico si se supera un umbral de elementos.
 * Centraliza la lógica de "Grid a Carrusel" para mantener consistencia en el proyecto.
 * 
 * @param {Object} options Opciones de configuración
 * @param {HTMLElement} options.container - El contenedor DOM (grid original).
 * @param {string} options.itemSelector - Selector de los items hijos (ej: '.hk-card').
 * @param {number} [options.threshold=4] - Cantidad mínima de items para activar el carrusel.
 * @param {Object} [options.swiperConfig={}] - Configuración personalizada para Swiper (sobreescribe defaults).
 * @param {string[]} [options.removeClasses] - Clases a remover del contenedor al activar.
 * @param {Function} [options.onInit] - Callback opcional después de inicializar.
 */
export const initDynamicCarousel = ({
    container,
    itemSelector,
    threshold = 4,
    swiperConfig = {},
    removeClasses = ['flex', 'flex-wrap', 'grid', 'justify-center', 'gap-4', 'gap-8', 'gap-y-8', 'sm:gap-[2px]'],
    onInit = null
}) => {
    if (!container) return;

    // 1. Evitar reinicialización
    if (container.classList.contains('swiper-initialized')) {
        container.swiper?.update();
        return;
    }

    // 2. Verificar condición de activación
    // Filtramos solo elementos directos que coincidan o contengan la clase
    const items = Array.from(container.children).filter(el => {
        // Soporte para selectores de clase (.clase) o etiqueta (DIV)
        if (itemSelector.startsWith('.')) {
            return el.classList.contains(itemSelector.substring(1));
        }
        return el.matches(itemSelector);
    });

    if (items.length <= threshold) return;

    console.log(`[CarouselManager] Activando carrusel para ${items.length} items en`, container);

    // 3. Transformación del DOM
    
    // Wrapper externo para controles (flechas fuera del overflow hidden)
    const outerWrapper = document.createElement('div');
    outerWrapper.className = 'relative w-full hk-swiper-wrapper';
    container.parentNode.insertBefore(outerWrapper, container);
    outerWrapper.appendChild(container);

    // Limpieza de clases del grid
    if (removeClasses && removeClasses.length) {
        container.classList.remove(...removeClasses);
    }
    
    // Clases base para Swiper
    container.classList.add('swiper', 'pb-28'); 
    container.style.width = '100%';
    container.style.overflow = 'hidden';

    // Wrapper interno de slides
    const swiperWrapper = document.createElement('div');
    swiperWrapper.className = 'swiper-wrapper';

    items.forEach(item => {
        item.classList.add('swiper-slide');
        // Reset de estilos que podrían interferir
        item.style.width = 'auto'; 
        item.style.height = 'auto'; 
        swiperWrapper.appendChild(item);
    });

    container.innerHTML = '';
    container.appendChild(swiperWrapper);

    // 4. Controles (Paginación y Flechas)
    
    const pagination = document.createElement('div');
    pagination.className = 'swiper-pagination';
    pagination.style.bottom = '-50px'; 
    pagination.style.position = 'absolute';
    pagination.style.width = '100%';
    pagination.style.textAlign = 'center';
    outerWrapper.appendChild(pagination);

    const { prevButton, nextButton } = createSwiperNavigation(outerWrapper);

    // 5. Configuración de Swiper (Merge Defaults + Custom + Attributes)
    
    // Leer configuración desde atributos data-* del contenedor (inyectados por PHP)
    const autoplayAttr = container.dataset.swiperAutoplay;
    const autoplaySpeed = parseInt(container.dataset.swiperAutoplaySpeed || 5000, 10);
    const loopEnabled = container.dataset.swiperLoop !== 'false'; // Default true
    const arrowsEnabled = container.dataset.swiperArrows !== 'false'; // Default true
    const dotsEnabled = container.dataset.swiperDots !== 'false'; // Default true

    const dynamicConfig = {
        loop: loopEnabled,
        autoplay: autoplayAttr === 'true' ? {
            delay: autoplaySpeed,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        } : false,
        navigation: arrowsEnabled ? {
            nextEl: nextButton,
            prevEl: prevButton,
        } : false,
        pagination: dotsEnabled ? {
            el: pagination,
            clickable: true,
        } : false,
    };
    
    // Ocultar elementos UI si están desactivados
    if (!arrowsEnabled) {
        if (prevButton) prevButton.style.display = 'none';
        if (nextButton) nextButton.style.display = 'none';
    }
    if (!dotsEnabled) {
        if (pagination) pagination.style.display = 'none';
        container.classList.remove('pb-28'); // Recuperar espacio si no hay dots
        container.classList.add('pb-8');
    }

    const defaults = {
        modules: [Autoplay, Navigation, Pagination],
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 20,
        // loop y autoplay se definen en dynamicConfig
        // navigation y pagination se definen en dynamicConfig
        breakpoints: {
            576: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 32 },
            1280: { slidesPerView: 4, spaceBetween: 32 }
        }
    };

    // Merge profundo manual
    const finalConfig = {
        ...defaults,
        ...dynamicConfig, // Prioridad sobre defaults
        ...swiperConfig,  // Prioridad máxima (código manual)
        modules: [...defaults.modules, ...(swiperConfig.modules || [])],
        // Merge condicional de objetos anidados si existen en swiperConfig
        navigation: swiperConfig.navigation ? { ...dynamicConfig.navigation, ...swiperConfig.navigation } : dynamicConfig.navigation,
        pagination: swiperConfig.pagination ? { ...dynamicConfig.pagination, ...swiperConfig.pagination } : dynamicConfig.pagination,
    };

    // Si el usuario define breakpoints, usamos los suyos completamente (no merge, para evitar conflictos de lógica)
    if (swiperConfig.breakpoints) {
        finalConfig.breakpoints = swiperConfig.breakpoints;
    }

    // 6. Inicializar
    const swiperInstance = new Swiper(container, finalConfig);

    if (onInit) {
        onInit(swiperInstance, outerWrapper);
    }

    return swiperInstance;
};

/**
 * Inicializa un carrusel vertical dinámico (tipo scrollable logos/items).
 * 
 * @param {Object} options
 * @param {HTMLElement} options.container - El contenedor.
 * @param {string} options.itemSelector - Selector de los items.
 * @param {number} [options.threshold=3] - Umbral.
 * @param {string} [options.height='600px'] - Altura fija del contenedor.
 * @param {Object} [options.swiperConfig={}] - Configuración extra.
 */
export const initVerticalDynamicCarousel = ({
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
