import { useEffect, useRef } from "react";
import { SkinViewer, WalkingAnimation } from "skinview3d";

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
}: Props):JSX.Element => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const viewer = new SkinViewer({
            width: width,
            height: height,
            canvas: canvasRef.current,            
            skin: `https://mc-heads.net/skin/${username}`,
        });

        viewer.controls.enableZoom = false;
        viewer.autoRotate = autoRotate ?? true;
        viewer.playerObject.rotation.y = initialRotationY;

        if (walk) {
            viewer.animation = new WalkingAnimation();
            viewer.animation.speed = 1;
        }

        return () => {
            viewer.dispose();
        };
    }, [username]);

    return <canvas ref={canvasRef} />;
}

export { Skin3d }