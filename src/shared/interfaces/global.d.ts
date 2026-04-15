export {};

declare global {
  interface Window {
    dataLayer: any[];
    gtagLoaded?: boolean;
  }
}
