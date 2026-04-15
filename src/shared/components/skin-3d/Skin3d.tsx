import { useEffect, useRef, type JSX } from "react";

type Props = {
    username: string;
    autoRotate?: boolean;
    initialRotationY?: number;
    width?: number;
    height?: number;
    walk?: boolean;
};

const Skin3d = ({ 
    username,
    autoRotate,
    width = 140,
    height = 300,
    initialRotationY = Math.PI / 6,
    walk = false,
}: Props): JSX.Element => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        let viewer: any;

        const loadScript = (src: string) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = src;
                script.async = true;
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });
        };

        const init = async () => {
            if (!(window as any).THREE) {
                await loadScript("https://unpkg.com/three@0.156.1/build/three.min.js");
            }

            if (!(window as any).skinview3d) {
                await loadScript("https://unpkg.com/skinview3d@3.4.1/bundles/skinview3d.bundle.js");
            }

            const { SkinViewer, WalkingAnimation } = (window as any).skinview3d;

            viewer = new SkinViewer({
                width,
                height,
                canvas: canvasRef.current!,
                skin: `https://mc-heads.net/skin/${username}`,
            });

            viewer.controls.enableZoom = false;
            viewer.autoRotate = autoRotate ?? true;
            viewer.playerObject.rotation.y = initialRotationY;

            if (walk) {
                viewer.animation = new WalkingAnimation();
                viewer.animation.speed = 1;
            }
        };

        init();

        return () => {
            viewer?.dispose();
        };
    }, [username, autoRotate, width, height, initialRotationY, walk]);

    return <canvas ref={canvasRef} />;
};

export { Skin3d };