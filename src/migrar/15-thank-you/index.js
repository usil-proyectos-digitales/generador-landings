
/**
 * Inicializa el Bloque Header.
 * Incluye lógica para cambiar entre variantes (simulando controles de Elementor).
 * @param {HTMLElement} container 
 */
export const init = (container) => {
    console.log('Bloque Header inicializado');
    
    const doc = container.ownerDocument; // Usar el documento del contenedor (iframe)
    const win = doc.defaultView; // Ventana del iframe

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
        { value: 'v15.1', label: '15.1 (Gracias en columna derecha)' },
        { value: 'v15.2', label: '15.2 (Gracias centrado)' },
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
    const STORAGE_KEY = 'thank-you-active-variant';
    const savedVariant = localStorage.getItem(STORAGE_KEY) || 'v1.1';

    const updateVisibility = (variant) => {
        sections.forEach(section => {
            if (section.dataset.widgetVariant === variant) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });
    };

    // Establecer valor inicial del selector
    selector.value = savedVariant;

    selector.addEventListener('change', (e) => {
        const newVariant = e.target.value;
        updateVisibility(newVariant);
        localStorage.setItem(STORAGE_KEY, newVariant);
    });

    // Estado inicial
    updateVisibility(savedVariant);

    // 3. Inicializar Formulario HubSpot
    const loadHubSpotForm = () => {
        const formContainer = container.querySelector('#hubspot-form-container');
        if (!formContainer) return;

        // Verificar si ya se renderizó (por si se llama múltiples veces)
        if (formContainer.children.length > 0) return;

        // Inyectar CSS externos (Float Label)
        const cssLink = doc.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdn.usil.digital/hbspt/politicas-privacidad/float-label.css';
        doc.head.appendChild(cssLink);

        const createForm = () => {
            if (win.hbspt) {
                win.hbspt.forms.create({
                    portalId: "2578504",
                    formId: "dda83cad-740f-4641-af87-8ea3d32848ff",
                    target: "#hubspot-form-container",
                    onFormReady: function() {
                        // Ocultar loader y mostrar form
                        const wrapper = container.querySelector('.usil-hubspot-wrapper');
                        const loader = wrapper ? wrapper.querySelector('.usil-hubspot-loader') : null;
                        const form = wrapper ? wrapper.querySelector('.usil-hubspot-form') : null;
                        
                        // Lógica para Labels Flotantes
                        if (form) {
                            const formEl = form.querySelector('form');
                            if (formEl) {
                                const inputs = formEl.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], textarea');
                                inputs.forEach(input => {
                                    const field = input.closest('.hs-form-field');
                                    if (field && !field.classList.contains('has-floating-label')) {
                                        field.classList.add('has-floating-label');
                                        
                                        // Crear wrapper personalizado
                                        const labelWrapper = doc.createElement('div');
                                        labelWrapper.className = 'input-label-wrapper';
                                        
                                        const label = field.querySelector('label');
                                        const inputDiv = field.querySelector('.input');
                                        
                                        if (label && inputDiv) {
                                            // Reestructurar DOM
                                            inputDiv.parentNode.insertBefore(labelWrapper, inputDiv);
                                            labelWrapper.appendChild(inputDiv);
                                            labelWrapper.appendChild(label);
                                            
                                            // Eventos de foco
                                            const updateFocus = () => {
                                                if (document.activeElement === input || input.value.trim() !== '') {
                                                    field.classList.add('input-focused');
                                                } else {
                                                    field.classList.remove('input-focused');
                                                }
                                            };
                                            
                                            input.addEventListener('focus', () => field.classList.add('input-focused'));
                                            input.addEventListener('blur', updateFocus);
                                            input.addEventListener('input', updateFocus);
                                            
                                            // Estado inicial
                                            updateFocus();
                                        }
                                    }
                                });
                            }
                        }

                        if(loader) loader.style.display = 'none';
                        if(form) {
                            form.classList.remove('opacity-0');
                            form.classList.add('loaded');
                        }
                        
                        // Cargar script custom post-render
                        const script = doc.createElement('script');
                        script.src = "https://cdn.usil.digital/hbspt/politicas-privacidad/script.js";
                        script.defer = true;
                        doc.head.appendChild(script);
                    }
                });
            }
        };

        if (!win.hbspt) {
            const script = doc.createElement('script');
            script.src = "//js.hsforms.net/forms/embed/v2.js";
            script.type = "text/javascript";
            script.charset = "utf-8";
            script.onload = createForm;
            doc.head.appendChild(script);
        } else {
            createForm();
        }
    };

    loadHubSpotForm();
};

const normalizeValue = (value) => {
    if (value === null || typeof value === 'undefined') return '';
    if (Array.isArray(value)) return value.map(normalizeValue).join(', ');
    return String(value);
};

const getFormHubData = () => {
    if (typeof window === 'undefined') return null;

    try {
        if (window.USILFormHub && typeof window.USILFormHub.loadPayload === 'function') {
            const payload = window.USILFormHub.loadPayload();
            if (payload && payload.data && typeof payload.data === 'object') return payload.data;
        }
    } catch (e) {}

    try {
        const raw = window.localStorage ? window.localStorage.getItem('dataFormHub_payload') : null;
        if (!raw) return null;
        const payload = JSON.parse(raw);
        if (payload && payload.data && typeof payload.data === 'object') return payload.data;
    } catch (e) {}

    try {
        const legacyRaw = window.localStorage ? window.localStorage.getItem('dataFormHub') : null;
        if (!legacyRaw) return null;
        const legacy = JSON.parse(legacyRaw);
        if (legacy && typeof legacy === 'object') return legacy;
    } catch (e) {}

    return null;
};

const renderTemplate = (template, values) => {
    const tpl = typeof template === 'string' ? template : '';
    const map = values && typeof values === 'object' ? values : {};

    return tpl.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
        const val = Object.prototype.hasOwnProperty.call(map, key) ? map[key] : '';
        return encodeURIComponent(normalizeValue(val));
    });
};

export const activate = (context = document) => {
    const root = context && typeof context.querySelectorAll === 'function' ? context : document;
    const imgs = root.querySelectorAll('img[data-usil-qr="1"]');
    if (!imgs.length) return;

    const data = getFormHubData() || {};

    imgs.forEach(img => {
        const baseUrl = img.getAttribute('data-qr-base') || '';
        if (!baseUrl) return;

        const emailField = img.getAttribute('data-qr-email-field') || 'email';
        const firstnameField = img.getAttribute('data-qr-firstname-field') || 'firstname';
        const queryTemplate = img.getAttribute('data-qr-query-template') || '';

        const query = renderTemplate(queryTemplate, {
            email: data[emailField],
            firstname: data[firstnameField],
        });

        const needsQuestion = baseUrl.indexOf('?') === -1;
        const sep = needsQuestion ? '?' : (baseUrl.endsWith('?') || baseUrl.endsWith('&') ? '' : '&');
        const finalUrl = queryTemplate ? `${baseUrl}${sep}${query}` : baseUrl;

        if (finalUrl && img.getAttribute('src') !== finalUrl) {
            img.setAttribute('src', finalUrl);
        }
    });
};
