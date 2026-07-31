/**
 * Crea los controles (flechas prev/next) de un carrusel Swiper — usado por
 * `carousel-manager.ts`.
 *
 * Adaptado de la utilidad compartida del proyecto padre
 * (`src/migrar/utils/swiper-nav.js`): esa versión usa un ícono de Font
 * Awesome vía clase (`fas fa-chevron-left`), pero este proyecto no carga
 * el webfont/CSS de Font Awesome (los iconos acá van siempre como SVG
 * inline, ver `5-save-the-date/icons.ts`) — así que el ícono se reemplaza
 * por un SVG stroke-based, mismo patrón que la flecha de CTA (`svgArrow`
 * en `CardsItems.astro`). El color hardcodeado (`#002663`) se reemplaza
 * por el token de la BU activa.
 */
const CHEVRON_LEFT =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
const CHEVRON_RIGHT =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';

export interface SwiperNavButtons {
  prevButton: HTMLDivElement;
  nextButton: HTMLDivElement;
}

/**
 * Agrega flechas prev/next a `outerWrapper` (el wrapper relativo que
 * envuelve al carrusel — ver `initDynamicCarousel`). Inyecta también los
 * estilos necesarios para ocultar las flechas default de Swiper y mostrar
 * el SVG propio en su lugar.
 */
export function createSwiperNavigation(outerWrapper: HTMLElement): SwiperNavButtons {
  const doc = outerWrapper.ownerDocument;

  const prevButton = doc.createElement('div');
  prevButton.className = 'swiper-button-prev';
  prevButton.style.left = '0';
  prevButton.innerHTML = CHEVRON_LEFT;

  const nextButton = doc.createElement('div');
  nextButton.className = 'swiper-button-next';
  nextButton.style.right = '0';
  nextButton.innerHTML = CHEVRON_RIGHT;

  outerWrapper.appendChild(prevButton);
  outerWrapper.appendChild(nextButton);

  const styleEl = doc.createElement('style');
  styleEl.textContent = `
    .swiper-button-prev::after,
    .swiper-button-next::after {
      display: none !important; /* Ocultamos las flechas default de Swiper */
    }
    .swiper-button-prev,
    .swiper-button-next {
      color: var(--bu-color-brand-primary);
      width: 2.5rem;
      height: 2.5rem;
    }
    .swiper-button-prev svg,
    .swiper-button-next svg {
      width: 2.5rem;
      height: 2.5rem;
    }
    .swiper-outer-wrapper-v68 {
      padding-left: 50px;
      padding-right: 50px;
    }
    @media (max-width: 768px) {
      .swiper-outer-wrapper-v68 {
        padding-left: 30px;
        padding-right: 30px;
      }
      .swiper-button-prev svg,
      .swiper-button-next svg {
        width: 1.875rem;
        height: 1.875rem;
      }
    }
  `;
  outerWrapper.classList.add('swiper-outer-wrapper-v68');
  outerWrapper.appendChild(styleEl);

  return { prevButton, nextButton };
}
