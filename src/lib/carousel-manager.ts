/**
 * Utilidad compartida para convertir un grid estático en un carrusel
 * Swiper cuando la cantidad de elementos supera un umbral — centraliza la
 * lógica "Grid a Carrusel" para que cualquier widget con esta necesidad
 * (hoy: `6-cards-items` v6.8) la use igual, en vez de reimplementarla.
 *
 * Adaptado de la utilidad del proyecto padre
 * (`src/migrar/utils/carousel-manager.js`), con dos cambios respecto al
 * original:
 *   - El color de flechas (`swiper-nav.ts`) y de la scrollbar vertical
 *     usa el token `--bu-color-brand-primary` en vez de un hex hardcodeado
 *     (`#002663`), para que respete la BU activa.
 *   - `swiper` es una dependencia real de npm acá (import estático +
 *     tree-shaking de módulos), no se carga desde CDN en runtime.
 *
 * Nota: esta utilidad es "solo ida" (grid → carrusel) — no revierte si la
 * cantidad de items vuelve a caer por debajo del umbral. En producción
 * (WordPress/ACF) los cards no cambian de cantidad después del render, así
 * que no hace falta. El Visor SÍ necesita revertir (live-editing de
 * cards) — esa lógica vive en el propio widget (`CardsItems.astro`), no acá.
 */
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination, Mousewheel, Scrollbar, FreeMode } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';
import { createSwiperNavigation } from './swiper-nav.ts';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/free-mode';

function filterItems(container: HTMLElement, itemSelector: string): HTMLElement[] {
  return Array.from(container.children).filter((el): el is HTMLElement => {
    if (itemSelector.startsWith('.')) {
      return el.classList.contains(itemSelector.slice(1));
    }
    return el.matches(itemSelector);
  });
}

export interface DynamicCarouselOptions {
  /** El contenedor DOM (grid original). */
  container: HTMLElement | null;
  /** Selector de los items hijos (ej: '.hk-card-6-8'). */
  itemSelector: string;
  /** Cantidad mínima de items para activar el carrusel. */
  threshold?: number;
  /** Configuración personalizada para Swiper (sobreescribe defaults). */
  swiperConfig?: SwiperOptions;
  /** Clases a remover del contenedor al activar. */
  removeClasses?: string[];
  /** Callback opcional después de inicializar. */
  onInit?: (swiper: Swiper, outerWrapper: HTMLElement) => void;
}

/**
 * Inicializa un carrusel horizontal dinámico si se supera `threshold`.
 * No hace nada si `container` es null, si ya está inicializado, o si la
 * cantidad de items no supera el umbral.
 */
export function initDynamicCarousel({
  container,
  itemSelector,
  threshold = 4,
  swiperConfig = {},
  removeClasses = ['flex', 'flex-wrap', 'grid', 'justify-center', 'gap-4', 'gap-8', 'gap-y-8', 'sm:gap-[2px]'],
  onInit,
}: DynamicCarouselOptions): Swiper | undefined {
  if (!container) return;

  // 1. Evitar reinicialización — si ya es un swiper, solo re-sincronizar.
  if (container.classList.contains('swiper-initialized')) {
    (container as HTMLElement & { swiper?: Swiper }).swiper?.update();
    return;
  }

  // 2. Verificar condición de activación.
  const items = filterItems(container, itemSelector);
  if (items.length <= threshold) return;

  // 3. Transformación del DOM.
  const doc = container.ownerDocument;

  // Wrapper externo para controles (flechas fuera del overflow hidden).
  const outerWrapper = doc.createElement('div');
  outerWrapper.className = 'relative w-full hk-swiper-wrapper';
  container.parentNode?.insertBefore(outerWrapper, container);
  outerWrapper.appendChild(container);

  if (removeClasses.length) {
    container.classList.remove(...removeClasses);
  }

  container.classList.add('swiper', 'pb-28');
  container.style.width = '100%';
  container.style.overflow = 'hidden';

  const swiperWrapper = doc.createElement('div');
  swiperWrapper.className = 'swiper-wrapper';

  items.forEach((item) => {
    item.classList.add('swiper-slide');
    item.style.width = 'auto';
    item.style.height = 'auto';
    swiperWrapper.appendChild(item);
  });

  container.innerHTML = '';
  container.appendChild(swiperWrapper);

  // 4. Controles (paginación y flechas).
  const pagination = doc.createElement('div');
  pagination.className = 'swiper-pagination';
  pagination.style.bottom = '-50px';
  pagination.style.position = 'absolute';
  pagination.style.width = '100%';
  pagination.style.textAlign = 'center';
  outerWrapper.appendChild(pagination);

  const { prevButton, nextButton } = createSwiperNavigation(outerWrapper);

  // 5. Configuración (defaults + atributos data-* + config manual).
  const autoplayAttr = container.dataset.swiperAutoplay;
  const autoplaySpeed = parseInt(container.dataset.swiperAutoplaySpeed ?? '5000', 10);
  const loopEnabled = container.dataset.swiperLoop !== 'false';
  const arrowsEnabled = container.dataset.swiperArrows !== 'false';
  const dotsEnabled = container.dataset.swiperDots !== 'false';

  const dynamicConfig: SwiperOptions = {
    loop: loopEnabled,
    autoplay: autoplayAttr === 'true' ? { delay: autoplaySpeed, disableOnInteraction: false, pauseOnMouseEnter: true } : false,
    navigation: arrowsEnabled ? { nextEl: nextButton, prevEl: prevButton } : false,
    pagination: dotsEnabled ? { el: pagination, clickable: true } : false,
  };

  if (!arrowsEnabled) {
    prevButton.style.display = 'none';
    nextButton.style.display = 'none';
  }
  if (!dotsEnabled) {
    pagination.style.display = 'none';
    container.classList.remove('pb-28');
    container.classList.add('pb-8');
  }

  const defaults: SwiperOptions = {
    modules: [Autoplay, Navigation, Pagination],
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
      576: { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: 3, spaceBetween: 32 },
      1280: { slidesPerView: 4, spaceBetween: 32 },
    },
  };

  const finalConfig: SwiperOptions = {
    ...defaults,
    ...dynamicConfig,
    ...swiperConfig,
    modules: [...(defaults.modules ?? []), ...(swiperConfig.modules ?? [])],
    navigation:
      typeof swiperConfig.navigation === 'object'
        ? { ...(dynamicConfig.navigation as object), ...swiperConfig.navigation }
        : (dynamicConfig.navigation ?? swiperConfig.navigation),
    pagination:
      typeof swiperConfig.pagination === 'object'
        ? { ...(dynamicConfig.pagination as object), ...swiperConfig.pagination }
        : (dynamicConfig.pagination ?? swiperConfig.pagination),
  };

  if (swiperConfig.breakpoints) {
    finalConfig.breakpoints = swiperConfig.breakpoints;
  }

  // 6. Inicializar.
  const swiperInstance = new Swiper(container, finalConfig);

  onInit?.(swiperInstance, outerWrapper);

  return swiperInstance;
}

export interface VerticalDynamicCarouselOptions {
  container: HTMLElement | null;
  itemSelector: string;
  threshold?: number;
  height?: string;
  swiperConfig?: SwiperOptions;
}

/**
 * Inicializa un carrusel vertical dinámico (tipo lista scrollable de
 * logos/items) si se supera `threshold`. Sin uso hoy en ningún widget
 * migrado — se porta igual, para widgets futuros que lo necesiten.
 */
export function initVerticalDynamicCarousel({
  container,
  itemSelector,
  threshold = 3,
  height = '600px',
  swiperConfig = {},
}: VerticalDynamicCarouselOptions): Swiper | undefined {
  if (!container) return;
  if (container.classList.contains('swiper-initialized')) return;

  const items = filterItems(container, itemSelector);
  if (items.length <= threshold) return;

  const doc = container.ownerDocument;

  container.classList.remove('space-y-12', 'flex', 'flex-col');
  container.classList.add('swiper');
  container.style.height = height;
  container.style.overflow = 'hidden';
  container.style.paddingRight = '20px';
  container.style.position = 'relative';

  const wrapper = doc.createElement('div');
  wrapper.className = 'swiper-wrapper';

  items.forEach((item) => {
    item.classList.add('swiper-slide');
    item.style.height = 'auto';
    item.style.width = '100%';
    item.classList.remove('space-y-3');
    item.style.marginBottom = '30px';
    wrapper.appendChild(item);
  });

  container.innerHTML = '';
  container.appendChild(wrapper);

  const scrollbar = doc.createElement('div');
  scrollbar.className = 'swiper-scrollbar';
  container.appendChild(scrollbar);

  const styleId = 'swiper-vertical-custom-style';
  if (!doc.getElementById(styleId)) {
    const scrollStyle = doc.createElement('style');
    scrollStyle.id = styleId;
    scrollStyle.textContent = `
      .swiper-scrollbar-drag {
        background-color: var(--bu-color-brand-primary) !important;
        opacity: 1 !important;
      }
      .swiper-slide {
        height: auto !important;
      }
    `;
    doc.head.appendChild(scrollStyle);
  }

  const scrollIndicator = doc.createElement('div');
  scrollIndicator.className = 'hk-scroll-indicator';
  scrollIndicator.style.cssText = `
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 120px;
    background: linear-gradient(to bottom, transparent 0%, var(--hk-scroll-indicator-gradient, var(--bu-color-surface-light)) 100%);
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
      <span class="hk-scroll-indicator__label text-[10px] font-bold uppercase tracking-widest mb-1" style="color: var(--hk-scroll-indicator-text, var(--bu-color-brand-primary));">Scroll</span>
      <svg class="hk-scroll-indicator__arrow w-6 h-6 animate-bounce" style="color: var(--hk-scroll-indicator-arrow, var(--hk-scroll-indicator-text, var(--bu-color-brand-primary)));" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
    </div>
  `;
  container.appendChild(scrollIndicator);

  const removeIndicator = () => {
    if (scrollIndicator.style.opacity !== '0') {
      scrollIndicator.style.opacity = '0';
      setTimeout(() => {
        scrollIndicator.parentNode?.removeChild(scrollIndicator);
      }, 500);
    }
  };

  const finalConfig: SwiperOptions = {
    modules: [Mousewheel, Scrollbar, FreeMode],
    direction: 'vertical',
    slidesPerView: 'auto',
    spaceBetween: 0,
    freeMode: { enabled: true, sticky: false, momentumRatio: 0.25, momentumVelocityRatio: 0.25 },
    mousewheel: { releaseOnEdges: true, sensitivity: 1, forceToAxis: true },
    scrollbar: { el: scrollbar, draggable: true, hide: false, snapOnRelease: false },
    on: { sliderFirstMove: removeIndicator, slideChange: removeIndicator },
    ...swiperConfig,
  };

  const swiperInstance = new Swiper(container, finalConfig);

  container.addEventListener('wheel', removeIndicator, { once: true });
  container.addEventListener('touchstart', removeIndicator, { once: true });

  return swiperInstance;
}
