/**
 * Simple State Management
 * Handles image data (blobs) and application settings.
 */

const initialState = {
    view: 'control', // 'control' | 'display'
    config: {
        slideshowInterval: 2000, // ms
    },
    images: {
        top: null,
        middle: [], // Array of blobs/urls
        bottom: null
    }
};

class Store {
    constructor() {
        this.state = { ...initialState };
        this.listeners = new Set();
    }

    getState() {
        return this.state;
    }

    /**
     * Update state and notify listeners
     * @param {Object} partialState 
     */
    setState(partialState) {
        this.state = { ...this.state, ...partialState };
        this.notify();
    }

    /**
     * specific update for nested image structure
     */
    setImage(section, data) {
        this.state.images = {
            ...this.state.images,
            [section]: data
        };
        this.notify();
    }

    setConfig(key, value) {
        this.state.config = {
            ...this.state.config,
            [key]: value
        };
        this.notify();
    }

    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    notify() {
        this.listeners.forEach(cb => cb(this.state));
    }
}

export const store = new Store();
