import { useEffect, type JSX } from "react";
import { motion, MotionProps, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";

type Props = {
    src: string;
    alt: string;
    className?: string;
    factor?: number;
    translateY?: { initial: number, end: number };
    parallaxFactor?: number; 
} & MotionProps;

const Flower = ({ src, alt, className = '', factor = 1, parallaxFactor = 1, translateY = { initial: 700, end: -300 }, ...props }:Props):JSX.Element => {
    const { scrollY } = useScroll();
    const scroll = useTransform(scrollY, [0, translateY.initial], [0, translateY.end * (parallaxFactor)]);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const x = useTransform(smoothX, [0, window.innerWidth], [-20 * factor, 20 * factor]);
    const y = useTransform(smoothY, [0, window.innerHeight], [-20 * factor, 20 * factor]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.picture style={{ x, y }} className={className} {...props}>
            <motion.img className="hue-rotate-[270deg] saturate-[0.2] brightness-90" style={{ y:scroll }} src={src} alt={alt} />
        </motion.picture>
    );
}

export { Flower }