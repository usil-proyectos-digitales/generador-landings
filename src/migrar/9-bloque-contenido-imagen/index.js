/**
 * Inicializa el Bloque Contenido Imagen.
 * @param {HTMLElement} container 
 */
export const init = (container) => {
    console.log('Bloque Contenido Imagen inicializado');
    
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
    
    // Definir opciones de variantes
    const variants = [
        { value: 'v9.1', label: '9.1 (Contenido + Imagen)' },
        { value: 'v9.2', label: '9.2 (Contenido + Imagen Centrada)' },
        { value: 'v9.3', label: '9.3 (Contenido + Imagen bloque completo)' }
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
    const STORAGE_KEY = 'bloque-contenido-imagen-active-variant';
    const savedVariant = localStorage.getItem(STORAGE_KEY) || 'v9.1';

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
};
