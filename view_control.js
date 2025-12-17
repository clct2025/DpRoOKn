import { store } from './state.js';
import { createDropZone, createPreviewStrip } from './components.js';

export class ControlView {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = "w-full h-full max-w-2xl mx-auto p-6 flex flex-col gap-8 overflow-y-auto hide-scrollbar pt-20 pb-24 fade-enter-active";
    }

    render() {
        this.element.innerHTML = ''; // Clear
        const state = store.getState();


        const header = document.createElement('div');
        header.innerHTML = `
            <h1 class="text-3xl font-semibold text-white mb-2 tracking-tight">Control Panel</h1>
            <p class="text-sm text-gray-500">Manage content and display settings.</p>
        `;
        this.element.appendChild(header);


        this.createSectionConfig('Top Section', 'Single Image', state.images.top, (files) => {
            const file = files[0];
            const url = URL.createObjectURL(file);
            store.setImage('top', url);
            this.render(); // Re-render to show preview
        });


        this.createSectionConfig('Middle Section', 'Slideshow Gallery', state.images.middle, (files) => {
            const newUrls = Array.from(files).map(f => URL.createObjectURL(f));

            store.setImage('middle', newUrls); 
            this.render();
        }, true);


        const intervalContainer = document.createElement('div');
        intervalContainer.className = "glass-panel p-5 rounded-2xl flex flex-col gap-4";
        intervalContainer.innerHTML = `
            <div class="flex justify-between items-center">
                <label class="text-sm font-medium text-gray-300">Slideshow Interval</label>
                <span class="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">${state.config.slideshowInterval / 1000}s</span>
            </div>
            <input type="range" min="500" max="10000" step="500" value="${state.config.slideshowInterval}" 
                class="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white">
            <div class="flex justify-between text-[10px] text-gray-600 font-mono">
                <span>0.5s</span>
                <span>10s</span>
            </div>
        `;
        const rangeInput = intervalContainer.querySelector('input');
        rangeInput.addEventListener('input', (e) => {
            store.setConfig('slideshowInterval', parseInt(e.target.value));
            intervalContainer.querySelector('span.text-emerald-400').textContent = `${e.target.value / 1000}s`;
        });
        this.element.appendChild(intervalContainer);



        this.createSectionConfig('Bottom Section', 'Single Image', state.images.bottom, (files) => {
            const file = files[0];
            const url = URL.createObjectURL(file);
            store.setImage('bottom', url);
            this.render();
        });


        if(window.lucide) lucide.createIcons();

        return this.element;
    }

    createSectionConfig(title, subtitle, currentData, onUpload, multiple = false) {
        const container = document.createElement('div');
        container.className = "glass-panel p-5 rounded-2xl flex flex-col gap-4";

        const header = document.createElement('div');
        header.innerHTML = `
            <h3 class="text-sm font-medium text-white">${title}</h3>
            <p class="text-xs text-gray-500">${subtitle}</p>
        `;

        const uploader = createDropZone(`upload-${title}`, `Upload ${multiple ? 'Images' : 'Image'}`, multiple, onUpload);
        const preview = createPreviewStrip(currentData);

        container.appendChild(header);
        container.appendChild(uploader);
        container.appendChild(preview);

        this.element.appendChild(container);
    }
}
