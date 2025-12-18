import { store } from './state.js';

/**
 * Creates a file upload area styling
 */
export function createDropZone(id, label, multiple = false, onChange) {
    const container = document.createElement('div');
    container.className = "relative group cursor-pointer w-full h-32 rounded-xl border border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-200 flex flex-col items-center justify-center gap-2 overflow-hidden";
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = multiple;
    input.className = "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10";
    
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', multiple ? 'images' : 'image');
    icon.className = "w-6 h-6 text-gray-400 group-hover:text-white transition-colors";

    const text = document.createElement('span');
    text.className = "text-xs text-gray-500 font-medium group-hover:text-gray-300";
    text.textContent = label;

    input.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onChange(e.target.files);

            container.classList.add('border-emerald-500/50', 'bg-emerald-500/5');
            text.textContent = multiple 
                ? `${e.target.files.length} files selected`
                : e.target.files[0].name;
            text.classList.add('text-emerald-400');
            
            setTimeout(() => {
                container.classList.remove('border-emerald-500/50', 'bg-emerald-500/5');
                if(!multiple) text.textContent = label; // Reset label for single (optional logic)
            }, 2000);
        }
    });

    container.appendChild(input);
    container.appendChild(icon);
    container.appendChild(text);

    return container;
}

/**
 * Creates a preview strip for images
 */
export function createPreviewStrip(images, onRemove) {
    const strip = document.createElement('div');
    strip.className = "flex gap-2 overflow-x-auto py-2 hide-scrollbar w-full min-h-[60px]";

    if (!images || (Array.isArray(images) && images.length === 0)) {
        const empty = document.createElement('div');
        empty.className = "w-full text-center text-xs text-gray-600 italic py-4";
        empty.textContent = "No images selected";
        strip.appendChild(empty);
        return strip;
    }

    const list = Array.isArray(images) ? images : [images];

    list.forEach((src, idx) => {
        const thumb = document.createElement('div');
        thumb.className = "relative flex-shrink-0 w-14 h-14 rounded-lg border border-white/10 overflow-hidden group bg-gray-800";
        
        const img = document.createElement('img');
        img.src = src;
        img.className = "w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity";
        
        thumb.appendChild(img);
        strip.appendChild(thumb);
    });

    return strip;
}