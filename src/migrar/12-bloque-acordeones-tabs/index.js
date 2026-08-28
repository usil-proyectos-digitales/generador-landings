
const initTabGroups = (container) => {
    const tabRoots = container.querySelectorAll('[data-tab-root]');
    tabRoots.forEach(root => {
        if (root.dataset.hkTabRootInit === '1') return;
        root.dataset.hkTabRootInit = '1';

        const triggers = Array.from(root.querySelectorAll('[data-tab-trigger]'))
            .filter(el => el.closest('[data-tab-root]') === root);
        const panels = Array.from(root.querySelectorAll('[data-tab-panel]'))
            .filter(el => el.closest('[data-tab-root]') === root);
        if (!triggers.length || !panels.length) return;

        const defaultValue = root.getAttribute('data-tab-default') || (triggers[0] && triggers[0].getAttribute('data-tab-trigger'));
        const styleMode = root.getAttribute('data-tab-style') || 'default';
        const isAccordion = styleMode === 'accordion' || styleMode === 'accordion-dark' || styleMode === 'accordion-native';

        let current = null;
        if (!isAccordion) {
            current = defaultValue || null;
        }

        const setTriggerState = (btn, isActive) => {
            // Add generic active state class for styling hooks
            btn.classList.toggle('is-active', isActive);

            if (isAccordion) {
                if (styleMode === 'accordion-native') {
                    // Modo nativo para Elementor: Solo gestionamos el icono y la clase activa.
                    // Los colores y estilos se manejan vía CSS/Elementor controls.
                    const icon = btn.querySelector('i.fa-solid');
                    if (icon) {
                        icon.classList.toggle('fa-chevron-up', isActive);
                        icon.classList.toggle('fa-chevron-down', !isActive);
                    }
                } else if (styleMode === 'accordion-dark') {
                    btn.classList.toggle('bg-brand-light', isActive);
                    btn.classList.toggle('bg-brand-dark', !isActive);
                    btn.classList.add('text-white');
                    const icon = btn.querySelector('i.fa-solid');
                    if (icon) {
                        icon.classList.toggle('fa-chevron-up', isActive);
                        icon.classList.toggle('fa-chevron-down', !isActive);
                    }
                } else {
                    btn.classList.toggle('text-brand-light', isActive);
                    btn.classList.toggle('text-black', !isActive);
                    btn.classList.remove('bg-brand-dark', 'bg-white', 'text-white', 'text-[#54595F]');
                    const icon = btn.querySelector('i.fa-solid');
                    if (icon) {
                        icon.classList.toggle('fa-chevron-up', isActive);
                        icon.classList.toggle('fa-chevron-down', !isActive);
                    }
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
                    if (isPanelActive) {
                        slideDown(panel);
                    } else if (!panel.classList.contains('hidden')) {
                         slideUp(panel);
                    } else {
                        // Asegurar que se mantiene oculto si no es el activo y ya tiene la clase hidden
                        panel.classList.add('hidden');
                    }
                } else {
                    panel.classList.toggle('hidden', !isPanelActive);
                }
            });
            current = value;
        };

        const closeCurrent = () => {
            if (!current) return;
            // Solo desactivamos el botón activo actual
            const activeBtn = triggers.find(btn => btn.getAttribute('data-tab-trigger') === current);
            if (activeBtn) setTriggerState(activeBtn, false);

            panels.forEach(panel => {
                // Solo cerramos el panel correspondiente al item actual que se está cerrando
                if (panel.getAttribute('data-tab-panel') === current && !panel.classList.contains('hidden')) {
                    slideUp(panel);
                }
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

export const activate = (container) => {
    initTabGroups(container);
};

export const init = (container) => {
    console.log('Bloque Acordeones / Tabs inicializado');
    
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
        { value: 'v12.1', label: '12.1 (Acordeón Carreras full width)' },
        { value: 'v12.6', label: '12.6 (Tabs con elevación)' }
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
    const STORAGE_KEY = 'bloque-acordeones-tabs-active-variant';
    const savedVariant = localStorage.getItem(STORAGE_KEY) || 'v12.1';

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

    selector.addEventListener('change', (e) => {
        const newVariant = e.target.value;
        updateVisibility(newVariant);
        localStorage.setItem(STORAGE_KEY, newVariant);
    });

    updateVisibility(savedVariant);
    initTabGroups(container);
};
