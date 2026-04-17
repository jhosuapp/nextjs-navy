"use client"

import { useRef, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion"
import { fadeUpMotion } from "@/shared/motion/fadeUp.motion";

import styles from './hero.module.css';

const HeroImage = ()=> {
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    })

    const scrollY = useTransform(
        scrollYProgress,
        [0, 1],
        ["-30%", "30%"]
    )

    const rawMouseX = useMotionValue(0)
    const rawMouseY = useMotionValue(0)

    useEffect(() => {
        const isMobile = matchMedia("(hover: none)").matches

        if (!isMobile) {
            const onMouseMove = (e: MouseEvent) => {
                const cx = window.innerWidth  / 2
                const cy = window.innerHeight / 2
                rawMouseX.set((e.clientX - cx) / cx)
                rawMouseY.set((e.clientY - cy) / cy)
            }
            window.addEventListener("mousemove", onMouseMove, { passive: true })
            return () => window.removeEventListener("mousemove", onMouseMove)
        } else {
            const onOrientation = (e: DeviceOrientationEvent) => {
                rawMouseX.set((e.gamma ?? 0) / 45)  
                rawMouseY.set((e.beta  ?? 0) / 45) 
            }
            window.addEventListener("deviceorientation", onOrientation, { passive: true })
            return () => window.removeEventListener("deviceorientation", onOrientation)
        }
    }, [rawMouseX, rawMouseY])

    const mouseX = useTransform(rawMouseX, [-1, 1], ["-1.5%", "1.5%"])
    const mouseY = useTransform(rawMouseY, [-1, 1], ["-1.5%", "1.5%"])

    const springConfig = { stiffness: 40, damping: 18, mass: 0.6 }
    const springScrollY = useSpring(scrollY,  springConfig)
    const springMouseX  = useSpring(mouseX,  springConfig)
    const springMouseY  = useSpring(mouseY,  springConfig)

    const combinedY = useMotionTemplate`calc(${springScrollY} + ${springMouseY})`
    const combinedX = springMouseX

    return (
        <motion.div
            ref={containerRef}
            className={ styles.heroImage }
            {...fadeUpMotion(0.56, 0.13)}
        >
            <motion.div
                style={{ x: combinedX, y: combinedY }}
            >
                <Image
                    src="/images/bg-video-2.jpg"
                    alt={ 'Navy Tierlist Image' }
                    fill
                    priority
                />
            </motion.div>
        </motion.div>
    )
}

export { HeroImage }