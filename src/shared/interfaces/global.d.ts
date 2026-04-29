export {};

declare global {
  interface Window {
    dataLayer: any[];
    gtagLoaded?: boolean;
    Vimeo: {
        Player: new (element: HTMLIFrameElement) => VimeoPlayerInstance;
    };
  }
}