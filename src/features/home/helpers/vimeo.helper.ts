export const loadVimeoScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') return;
        if (window.Vimeo) { resolve(); return; }

        const existing = document.querySelector<HTMLScriptElement>(
            'script[src="https://player.vimeo.com/api/player.js"]'
        );
        if (existing) {
            existing.addEventListener('load', () => resolve(), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://player.vimeo.com/api/player.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Vimeo script failed to load'));
        document.body.appendChild(script);
    });
};

export function waitForRef<T>(
    ref: React.RefObject<T>,
    { interval = 20, timeout = 5000 } = {}
): Promise<T> {
    return new Promise((resolve, reject) => {
        if (ref.current) { resolve(ref.current); return; }

        const start = Date.now();
        const id = setInterval(() => {
            if (ref.current) {
                clearInterval(id);
                resolve(ref.current);
            } else if (Date.now() - start > timeout) {
                clearInterval(id);
                reject(new Error('Timed out waiting for iframe ref'));
            }
        }, interval);
    });
}
