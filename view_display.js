import { store } from './state.js';

export class DisplayView {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = "w-full h-full flex flex-col bg-black fade-enter-active";
        this.intervalId = null;
        this.currentIndex = 0;
    }

    mount() {
        this.render();
        this.startCarousel();
        return this.element;
    }

    unmount() {
        this.stopCarousel();
    }

    startCarousel() {
        this.stopCarousel();
        const state = store.getState();
        const images = state.images.middle;
        const interval = state.config.slideshowInterval;

        if (images && images.length > 1) {
            this.intervalId = setInterval(() => {
                this.rotateSlide(images);
            }, interval);
        }
    }

    stopCarousel() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    rotateSlide(images) {
        const slides = this.element.querySelectorAll('.middle-section .carousel-slide');
        if (slides.length === 0) return;


        slides[this.currentIndex].classList.remove('active');


        this.currentIndex = (this.currentIndex + 1) % images.length;


        slides[this.currentIndex].classList.add('active');
    }

    renderSection(type, content, extraClasses = "") {
        const section = document.createElement('div');

        section.className = `flex-1 relative border-b border-white/5 last:border-0 overflow-hidden bg-[#050505] ${extraClasses}`;
        
        if (type === 'static') {
            const container = document.createElement('div');
            container.className = "img-fit-container p-8";
            if (content) {
                const img = document.createElement('img');
                img.src = content;
                container.appendChild(img);
            } else {

                container.innerHTML = `<div class="text-gray-800 font-mono text-xs tracking-widest uppercase border border-gray-800 px-4 py-2 rounded-full">Waiting for Content</div>`;
            }
            section.appendChild(container);
        } 
        else if (type === 'carousel') {
            const container = document.createElement('div');
            container.className = "img-fit-container middle-section bg-[#080808] relative"; // Slightly lighter bg for middle
            
            if (content && content.length > 0) {
                content.forEach((src, idx) => {
                    const slide = document.createElement('div');
                    slide.className = `carousel-slide ${idx === 0 ? 'active' : ''} p-8`;
                    
                    const img = document.createElement('img');
                    img.src = src;
                    
                    slide.appendChild(img);
                    container.appendChild(slide);
                });
            } else {
                container.innerHTML = `<div class="text-gray-800 font-mono text-xs tracking-widest uppercase border border-gray-800 px-4 py-2 rounded-full">Slideshow Empty</div>`;
            }
            section.appendChild(container);
        }

        return section;
    }

    render() {
        this.element.innerHTML = '';
        const state = store.getState();


        this.element.appendChild(this.renderSection('static', state.images.top));


        this.element.appendChild(this.renderSection('carousel', state.images.middle));


        this.element.appendChild(this.renderSection('static', state.images.bottom));
    }
}
