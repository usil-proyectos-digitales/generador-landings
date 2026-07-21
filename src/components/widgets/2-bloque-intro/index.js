
/**
 * Inicializa el Bloque Intro Texto.
 * Incluye lógica para cambiar entre variantes (simulando controles de Elementor).
 * @param {HTMLElement} container 
 */
export const render = (container) => {
    console.log('Bloque Intro Texto inicializado');
    
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
        { value: 'v2.1', label: '2.1 (Centrado)' },
        { value: 'v2.2', label: '2.2 (Dividido)' }
    ];
    const optionsHtml = variants.map(v => `<option value="${v.value}">${v.label}</option>`).join('');
    if (controlsSlot) {
        controlsPanel.className = 'flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200';
        controlsPanel.innerHTML = `
            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Variante:</span>
            <select id="variant-selector" class="block py-1 px-2 text-sm text-gray-700 bg-white rounded border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none">
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
    const STORAGE_KEY = 'intro-text-block-active-variant';
    const savedVariant = localStorage.getItem(STORAGE_KEY) || 'v2.1';

    const updateVisibility = (variant) => {
        let found = false;
        sections.forEach(section => {
            if (section.dataset.widgetVariant === variant) {
                section.classList.remove('hidden');
                found = true;
            } else {
                section.classList.add('hidden');
            }
        });
        
        // Fallback: si la variante guardada no existe (ej. cambio de nombres), mostrar la primera
        if (!found && sections.length > 0) {
            sections[0].classList.remove('hidden');
            selector.value = sections[0].dataset.widgetVariant;
        }
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
};
