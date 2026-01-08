import { store } from './state.js';
import { ControlView } from './view_control.js';
import { DisplayView } from './view_display.js';

const app = document.getElementById('app');
const toggleBtn = document.getElementById('view-toggle');
const toggleText = document.getElementById('toggle-text');
const toggleIcon = toggleBtn.querySelector('i');

let currentViewInstance = null;

function render() {
    const state = store.getState();
    

    if (currentViewInstance && typeof currentViewInstance.unmount === 'function') {
        currentViewInstance.unmount();
    }
    
    app.innerHTML = '';

    if (state.view === 'control') {
        currentViewInstance = new ControlView();
        app.appendChild(currentViewInstance.render());
        toggleText.textContent = "Display Mode";
        toggleIcon.setAttribute('data-lucide', 'monitor');
    } else {
        currentViewInstance = new DisplayView();
        app.appendChild(currentViewInstance.mount());
        toggleText.textContent = "Settings";
        toggleIcon.setAttribute('data-lucide', 'settings-2');
    }

    lucide.createIcons();
}


render();



store.subscribe(() => {



    const state = store.getState();

    if (state.view === 'display' && currentViewInstance instanceof DisplayView) {
        currentViewInstance.unmount(); // stop timers
        currentViewInstance.mount();   // restart with new data
    }
});


toggleBtn.addEventListener('click', () => {
    const state = store.getState();
    const newView = state.view === 'control' ? 'display' : 'control';
    store.setState({ view: newView });
    render();
});