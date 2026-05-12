"use client";

import { useEffect, useState, type JSX } from "react";
import { motion, MotionProps, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

type Props = {
    src: string;
    alt: string;
    className?: string;
    factor?: number;
    translateY?: { initial: number, end: number };
    parallaxFactor?: number; 
} & MotionProps;

const Flower = ({ src, alt, className = '', factor = 1, parallaxFactor = 1, translateY = { initial: 700, end: -300 }, ...props }: Props): JSX.Element => {
    const [size, setSize] = useState({ width: 0, height: 0 });

    const { scrollY } = useScroll();
    const scroll = useTransform(scrollY, [0, translateY.initial], [0, translateY.end * parallaxFactor]);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const x = useTransform(smoothX, [0, size.width], [-20 * factor, 20 * factor]);
    const y = useTransform(smoothY, [0, size.height], [-20 * factor, 20 * factor]);

    useEffect(() => {
        const updateSize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        updateSize();

        window.addEventListener("resize", updateSize);
        window.addEventListener("mousemove", (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        });

        return () => {
            window.removeEventListener("resize", updateSize);
        };
    }, [mouseX, mouseY]);

    return (
        <motion.div style={{ x, y }} className={className} {...props}>
            <motion.picture style={{ y: scroll }} suppressHydrationWarning>
                <Image className="hue-rotate-[270deg] saturate-[0.2] brightness-90" src={src} alt={alt} width={300} height={300} />
            </motion.picture>
        </motion.div>
    );
};

export { Flower };