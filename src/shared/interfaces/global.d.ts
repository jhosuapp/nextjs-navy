export {};

declare global {
  interface Window {
    dataLayer: any[];
    gtagLoaded?: boolean;
  }
}

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.webp" {
  const content: string;
  export default content;
}