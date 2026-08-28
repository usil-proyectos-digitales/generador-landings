import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ensureCarousel147Styles = (doc) => {
    if (!doc) return;
    const existing = doc.getElementById('hk-carousel-14-7-styles');
    if (existing) return;
    const styleEl = doc.createElement('style');
    styleEl.id = 'hk-carousel-14-7-styles';
    styleEl.innerHTML = `
        section[data-widget-variant="v14.7"] .hk-carousel-prev,
        section[data-widget-variant="v14.7"] .hk-carousel-next {
            width: 40px;
            height: 40px;
            color: var(--hk-carousel-nav-color, #002663);
            font-weight: bold;
            transition: color 0.2s ease;
            border: 0 !important;
            background: transparent;
            box-shadow: none;
            outline: none;
        }
        section[data-widget-variant="v14.7"] .hk-miscelaneos-v14-7-slide-image {
            border-radius: 1.5rem !important;
            display: block;
        }
        section[data-widget-variant="v14.7"] .hk-carousel-prev:hover,
        section[data-widget-variant="v14.7"] .hk-carousel-next:hover {
            color: var(--hk-carousel-nav-hover-color, #1E50DC);
        }
        section[data-widget-variant="v14.7"] .hk-carousel-prev i,
        section[data-widget-variant="v14.7"] .hk-carousel-next i {
            font-size: 40px;
            line-height: 1;
        }
        @media (max-width: 768px) {
            section[data-widget-variant="v14.7"] .hk-carousel-prev i,
            section[data-widget-variant="v14.7"] .hk-carousel-next i {
                font-size: 30px;
            }
        }
        section[data-widget-variant="v14.7"] .hk-carousel-dots .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            border-radius: 9999px;
            border: 1px solid var(--hk-carousel-dot-border, #002b5c);
            background-color: transparent;
            opacity: 1;
            margin: 0 4px;
            transform: none;
        }
        section[data-widget-variant="v14.7"] .hk-carousel-dots .swiper-pagination-bullet-active {
            background-color: var(--hk-carousel-dot-active, #002b5c);
            opacity: 1;
        }
    `;
    doc.head.appendChild(styleEl);
};

const initCarousel147InSection = (section) => {
    if (!section || !section.querySelector) return;

    const wrapper = section.querySelector('.hk-carousel-wrapper');
    const swiperEl = section.querySelector('.hk-carousel-swiper');
    if (!wrapper || !swiperEl) return;

    if (wrapper.dataset.carouselInit === 'true') return;

    const doc = section.ownerDocument || document;
    ensureCarousel147Styles(doc);

    const dotsContainer = section.querySelector('.hk-carousel-dots');
    const prevBtn = section.querySelector('.hk-carousel-prev');
    const nextBtn = section.querySelector('.hk-carousel-next');

    const autoplayEnabled = swiperEl.dataset.swiperAutoplay === 'true';
    const autoplayDelay = parseInt(swiperEl.dataset.swiperAutoplaySpeed || '5000', 10);
    const loopEnabled = swiperEl.dataset.swiperLoop !== 'false';
    const arrowsEnabled = swiperEl.dataset.swiperArrows !== 'false';
    const dotsEnabled = swiperEl.dataset.swiperDots !== 'false';

    if (!arrowsEnabled) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }

    if (!dotsEnabled) {
        if (dotsContainer) dotsContainer.style.display = 'none';
    }

    const swiperConfig = {
        modules: [Navigation, Pagination, Autoplay],
        slidesPerView: 1,
        loop: loopEnabled,
        speed: 500,
        autoplay: autoplayEnabled
            ? {
                delay: Number.isFinite(autoplayDelay) ? autoplayDelay : 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }
            : false,
        navigation: arrowsEnabled && prevBtn && nextBtn
            ? {
                nextEl: nextBtn,
                prevEl: prevBtn,
            }
            : false,
        pagination: dotsEnabled && dotsContainer
            ? {
                el: dotsContainer,
                clickable: true,
            }
            : false,
    };

    new Swiper(swiperEl, swiperConfig);

    wrapper.dataset.carouselInit = 'true';
};

const startCountdownInRoot = (root) => {
    if (!root) return;

    const daysEl = root.querySelector('[data-hk-countdown-value="days"]') || root.querySelector('#cd-days');
    const hoursEl = root.querySelector('[data-hk-countdown-value="hours"]') || root.querySelector('#cd-hours');
    const minsEl = root.querySelector('[data-hk-countdown-value="minutes"]') || root.querySelector('#cd-mins');
    const secsEl = root.querySelector('[data-hk-countdown-value="seconds"]') || root.querySelector('#cd-secs');

    if (!daysEl && !hoursEl && !minsEl && !secsEl) return;

    const prev = root.dataset.hkCountdownIntervalId || root.dataset.countdownId;
    if (prev) clearInterval(Number(prev));

    const targetAttr = root.getAttribute('data-hk-countdown-target') || root.getAttribute('data-countdown-target');
    let end = targetAttr ? new Date(targetAttr) : null;
    if (!(end instanceof Date) || isNaN(end.getTime())) {
        end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    const padLength = Number(root.getAttribute('data-hk-countdown-pad') || 2);
    const pad = (n) => String(n).padStart(Number.isFinite(padLength) ? padLength : 2, '0');

    const afterExpire = root.getAttribute('data-hk-countdown-after') || 'zeros';
    const grid = root.querySelector('.hk-miscelaneos-v14-5-grid') || root.querySelector('.hk-contador-grid');
    const message = root.querySelector('.hk-miscelaneos-v14-5-expired-message');

    const setExpiredState = (expired) => {
        if (!expired) {
            if (grid) grid.classList.remove('hidden');
            if (message) message.classList.add('hidden');
            return;
        }

        if (afterExpire === 'hide') {
            if (grid) grid.classList.add('hidden');
            if (message) message.classList.add('hidden');
            return;
        }

        if (afterExpire === 'message') {
            if (grid) grid.classList.remove('hidden');
            if (message) message.classList.remove('hidden');
            return;
        }

        if (grid) grid.classList.remove('hidden');
        if (message) message.classList.add('hidden');
    };

    const tick = () => {
        let diff = end - new Date();
        const expired = diff <= 0;
        if (diff < 0) diff = 0;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);

        if (daysEl) daysEl.textContent = pad(d);
        if (hoursEl) hoursEl.textContent = pad(h);
        if (minsEl) minsEl.textContent = pad(m);
        if (secsEl) secsEl.textContent = pad(s);

        setExpiredState(expired);
    };

    tick();
    const id = setInterval(tick, 1000);
    root.dataset.hkCountdownIntervalId = String(id);
    root.dataset.countdownId = String(id);
};

const applyRanking148LayoutInSection = (section) => {
    if (!section || !section.querySelectorAll) return;

    const topItems = Array.from(section.querySelectorAll('.hk-tops .hk-top-item'));
    const qsItems = Array.from(section.querySelectorAll('.hk-qs-item .hk-qs-entry'));

    const clampCount = (wanted, max) => {
        const n = parseInt(String(wanted || ''), 10);
        if (!Number.isFinite(n) || n <= 0) return max;
        return Math.max(1, Math.min(max, n));
    };

    const syncVisibility = (items, wantedCount) => {
        const max = items.length;
        const count = clampCount(wantedCount, max);
        items.forEach((el, idx) => {
            el.classList.toggle('hidden', idx >= count);
        });
        return count;
    };

    const removeKnownClasses = (el, classList) => {
        classList.forEach((c) => el.classList.remove(c));
    };

    const topCount = syncVisibility(topItems, section.getAttribute('data-hk-top-count'));
    const qsCount = syncVisibility(qsItems, section.getAttribute('data-hk-qs-count'));

    const topMdClass = topCount === 1 ? 'md:w-full' : 'md:w-[calc((100%-5rem)/2)]';
    const topLgClass = topCount === 4 ? 'lg:w-[calc((100%-15rem)/4)]' : 'lg:w-[calc((100%-10rem)/3)]';
    const topClassesToReset = ['md:w-full', 'md:w-[calc((100%-5rem)/2)]', 'lg:w-[calc((100%-15rem)/4)]', 'lg:w-[calc((100%-10rem)/3)]'];

    topItems.forEach((el) => {
        removeKnownClasses(el, topClassesToReset);
        if (!el.classList.contains('hidden')) {
            el.classList.add(topMdClass, topLgClass);
        }
    });

    const qsMdClass = qsCount === 1 ? 'md:max-w-full' : 'md:max-w-[calc((100%-5rem)/2)]';
    const qsLgClass = qsCount === 4 ? 'lg:max-w-[calc((100%-6rem)/4)]' : 'lg:max-w-[calc((100%-4rem)/3)]';
    const qsClassesToReset = ['md:max-w-full', 'md:max-w-[calc((100%-5rem)/2)]', 'lg:max-w-[calc((100%-6rem)/4)]', 'lg:max-w-[calc((100%-4rem)/3)]'];

    qsItems.forEach((el) => {
        removeKnownClasses(el, qsClassesToReset);
        if (!el.classList.contains('hidden')) {
            el.classList.add(qsMdClass, qsLgClass);
        }
    });
};

export const activate = (scope) => {
    const root = scope && scope.querySelectorAll ? scope : document;
    const countdowns = root.querySelectorAll('[data-hk-countdown="v14.5"], [data-widget-variant="v14.5"][data-countdown-target]');
    countdowns.forEach(startCountdownInRoot);

    const carousels147 = root.querySelectorAll('.hk-miscelaneos-v14-7-section, [data-widget-variant="v14.7"]');
    carousels147.forEach(initCarousel147InSection);

    const rankings148 = root.querySelectorAll('[data-widget-variant="v14.8"]');
    rankings148.forEach(applyRanking148LayoutInSection);
};

export const init = (container) => {
    console.log('Bloque Misceláneos inicializado');
    
    const doc = container.ownerDocument;
    const win = doc.defaultView;

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
        { value: 'v14.3', label: '14.3 (Título y parrafo con contenedor redondeado)' },
        { value: 'v14.5', label: '14.5 (Título + contador)' },
        { value: 'v14.6', label: '14.6 (Título y bloque informativo)' },
        { value: 'v14.7', label: '14.7 (Bloque parrafo izquierda + carrusel de 1 card a la derecha)' },
        { value: 'v14.8', label: '14.8 (Bloque Ranking)' },
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
    const sections = container.querySelectorAll('[data-widget-variant]');
    const STORAGE_KEY = 'bloque-miscelaneos-active-variant';
    const defaultVariant = 'v14.3';
    const savedVariant = localStorage.getItem(STORAGE_KEY) || defaultVariant;

    const updateVisibility = (variant) => {
        sections.forEach(section => {
            if (section.dataset.widgetVariant === variant) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });
    };

    selector.value = savedVariant;

    const initVariant147Swiper = () => {
        const variantSection = container.querySelector('[data-widget-variant="v14.7"]');
        if (!variantSection) return;
        initCarousel147InSection(variantSection);
    };

    const handleVariantSpecificInit = (variant) => {
        if (variant === 'v14.5') startCountdown();
        if (variant === 'v14.7') initVariant147Swiper();
        if (variant === 'v14.8') applyRanking148LayoutInSection(container.querySelector('[data-widget-variant="v14.8"]'));
    };

    const initialVariant = savedVariant;
    updateVisibility(initialVariant);
    handleVariantSpecificInit(initialVariant);

    function startCountdown() {
        const section = container.querySelector('[data-widget-variant="v14.5"]');
        if (!section) return;
        const daysEl = section.querySelector('#cd-days');
        const hoursEl = section.querySelector('#cd-hours');
        const minsEl = section.querySelector('#cd-mins');
        const secsEl = section.querySelector('#cd-secs');
        if (!daysEl || !hoursEl || !minsEl || !secsEl) return;
        const prev = section.dataset.countdownId;
        if (prev) clearInterval(Number(prev));
        const attr = section.getAttribute('data-countdown-target');
        let end = attr ? new Date(attr) : null;
        if (!(end instanceof Date) || isNaN(end.getTime())) {
            end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }
        const pad = (n) => String(n).padStart(2, '0');
        const tick = () => {
            let diff = end - new Date();
            if (diff < 0) diff = 0;
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);
            daysEl.textContent = pad(d);
            hoursEl.textContent = pad(h);
            minsEl.textContent = pad(m);
            secsEl.textContent = pad(s);
        };
        tick();
        const id = setInterval(tick, 1000);
        section.dataset.countdownId = String(id);
    }

    selector.addEventListener('change', (e) => {
        const newVariant = e.target.value;
        updateVisibility(newVariant);
        localStorage.setItem(STORAGE_KEY, newVariant);
        handleVariantSpecificInit(newVariant);
    });

    const initTabGroups = () => {
        const tabRoots = container.querySelectorAll('[data-tab-root]');
        tabRoots.forEach(root => {
            const triggers = Array.from(root.querySelectorAll('[data-tab-trigger]'))
                .filter(el => el.closest('[data-tab-root]') === root);
            const panels = Array.from(root.querySelectorAll('[data-tab-panel]'))
                .filter(el => el.closest('[data-tab-root]') === root);
            if (!triggers.length || !panels.length) return;

            const defaultValue = root.getAttribute('data-tab-default') || (triggers[0] && triggers[0].getAttribute('data-tab-trigger'));
            const styleMode = root.getAttribute('data-tab-style') || 'default';
            const isAccordion = styleMode === 'accordion' || styleMode === 'accordion-dark';

            let current = null;
            if (!isAccordion) {
                current = defaultValue || null;
            }

            const setTriggerState = (btn, isActive) => {
                if (isAccordion) {
                    if (styleMode === 'accordion-dark') {
                        btn.classList.toggle('bg-brand-light', isActive);
                        btn.classList.toggle('bg-brand-dark', !isActive);
                        btn.classList.add('text-white');
                    } else {
                        btn.classList.toggle('text-brand-light', isActive);
                        btn.classList.toggle('text-black', !isActive);
                        btn.classList.remove('bg-brand-dark', 'bg-white', 'text-white', 'text-[#54595F]');
                    }
                    const icon = btn.querySelector('i.fa-solid');
                    if (icon) {
                        icon.classList.toggle('fa-chevron-up', isActive);
                        icon.classList.toggle('fa-chevron-down', !isActive);
                    }
                } else if (styleMode === 'tabs-raise') {
                    btn.classList.toggle('bg-brand-dark', isActive);
                    btn.classList.toggle('text-white', isActive);
                    btn.classList.toggle('bg-[#D8D8D8]', !isActive);
                    btn.classList.toggle('text-brand-dark', !isActive);
                    btn.classList.toggle('md:-translate-y-4', isActive);
                } else {
                    btn.classList.toggle('bg-white', !isActive);
                    btn.classList.toggle('text-[#54595F]', !isActive);
                    btn.classList.toggle('bg-brand-dark', isActive);
                    btn.classList.toggle('text-white', isActive);
                    btn.classList.toggle('border-brand-dark', isActive);
                    btn.classList.toggle('border-gray-200', !isActive);
                }
            };

            const slideDown = (panel) => {
                panel.classList.remove('hidden');
                panel.style.overflow = 'hidden';
                panel.style.maxHeight = '0px';
                panel.style.opacity = '0';
                panel.style.transition = 'max-height 200ms ease, opacity 200ms ease';
                requestAnimationFrame(() => {
                    panel.style.maxHeight = panel.scrollHeight + 'px';
                    panel.style.opacity = '1';
                });
                const onEnd = () => {
                    panel.style.transition = '';
                    panel.style.maxHeight = '';
                    panel.style.overflow = '';
                    panel.style.opacity = '';
                    panel.removeEventListener('transitionend', onEnd);
                };
                panel.addEventListener('transitionend', onEnd);
            };

            const slideUp = (panel) => {
                const h = panel.scrollHeight;
                panel.style.overflow = 'hidden';
                panel.style.maxHeight = h + 'px';
                panel.style.opacity = '1';
                panel.style.transition = 'max-height 200ms ease, opacity 200ms ease';
                requestAnimationFrame(() => {
                    panel.style.maxHeight = '0px';
                    panel.style.opacity = '0';
                });
                const onEnd = () => {
                    panel.classList.add('hidden');
                    panel.style.transition = '';
                    panel.style.maxHeight = '';
                    panel.style.overflow = '';
                    panel.style.opacity = '';
                    panel.removeEventListener('transitionend', onEnd);
                };
                panel.addEventListener('transitionend', onEnd);
            };

            const open = (value) => {
                triggers.forEach(btn => {
                    const isActive = btn.getAttribute('data-tab-trigger') === value;
                    setTriggerState(btn, isActive);
                });
                panels.forEach(panel => {
                    const isPanelActive = panel.getAttribute('data-tab-panel') === value;
                    if (isAccordion) {
                        if (isPanelActive) slideDown(panel);
                        else if (!panel.classList.contains('hidden')) slideUp(panel);
                        else panel.classList.add('hidden');
                    } else {
                        panel.classList.toggle('hidden', !isPanelActive);
                    }
                });
                current = value;
            };

            const closeCurrent = () => {
                if (!current) return;
                triggers.forEach(btn => setTriggerState(btn, false));
                panels.forEach(panel => {
                    if (!panel.classList.contains('hidden')) slideUp(panel);
                });
                current = null;
            };

            triggers.forEach(btn => {
                btn.addEventListener('click', () => {
                    const value = btn.getAttribute('data-tab-trigger');
                    if (isAccordion) {
                        if (current === value) {
                            closeCurrent();
                        } else {
                            open(value);
                        }
                    } else {
                        open(value);
                    }
                });
            });

            if (defaultValue) {
                if (isAccordion) {
                    if (root.offsetParent !== null) {
                        open(defaultValue);
                    }
                } else {
                    open(defaultValue);
                }
            }
        });
    };

    initTabGroups();
};
