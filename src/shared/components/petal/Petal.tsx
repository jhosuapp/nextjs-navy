// import { useEffect, useRef } from "react";
// import { gsap, Linear, Sine } from "gsap";
// import { motion, useScroll, useTransform } from 'framer-motion';
// import { fadeInMotion } from "@/shared/motion";

// function getRandom(min: number, max: number) {
//     // Safe usage: only for animation randomness, not for security or cryptographic purposes
//     return min + Math.random() * (max - min);
// }

// const SPRITE_URL = "https://150porciento.com/wp-content/uploads/2025/10/Frame-4-8-1-scaled.png";
// const FRAME_WIDTH = 42.6;
// const FRAME_COUNT = 60;

// type Props = {
//     translateY?: { initial: number, end: number };
// }

// const Petal = ({ translateY = { initial: 0, end: 0} }:Props) => {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const { scrollY } = useScroll();
//     const parallaxY = useTransform(scrollY, [0, translateY.initial], [0, translateY.end]);

//     useEffect(() => {
//         const container = containerRef.current;
//         if (!container) return;

//         gsap.set(container, { perspective: 1000 });

//         const petals = container.querySelectorAll(".petal");

//         petals.forEach((el) => {
//             gsap.set(el, { opacity: 0 });
//             // Animación del sprite (frames)
//             const spriteObj = { frame: 0 };
//             gsap.to(spriteObj, {
//                 frame: FRAME_COUNT,
//                 // Safe usage: only for animation randomness, not for security or cryptographic purposes
//                 duration: 4 + Math.random() * 2,
//                 ease: `steps(${FRAME_COUNT})`,
//                 repeat: -1,
//                 delay: getRandom(0, 8), 
//                 onStart: () => {
//                     gsap.to(el, { opacity: 1, duration: 0.6, ease: "sine.inOut" });
//                 },
//                 onUpdate: () => {
//                     const f = Math.floor(spriteObj.frame) % FRAME_COUNT;
//                     gsap.set(el, {
//                         backgroundPosition: `${-f * FRAME_WIDTH}px 0`,
//                     });
//                 },
//             });

//             // Movimiento vertical (caída)
//             gsap.set(el, {
//                 x: getRandom(0, window.innerWidth),
//                 y: getRandom(-200, -150),
//                 z: getRandom(-200, 200),
//             });

//             gsap.to(el, {
//                 duration: getRandom(10, 20),
//                 y: window.innerHeight,
//                 ease: Linear.easeNone,
//                 repeat: -1,
//                 delay: -15,
//             });

//             // Movimiento de profundidad (z)
//             gsap.to(el, {
//                 duration: getRandom(6, 12),
//                 z: getRandom(10, 100),
//                 repeat: -1,
//                 yoyo: true,
//                 ease: Sine.easeInOut,
//             });

//             // Movimiento horizontal y rotación Z
//             gsap.to(el, {
//                 duration: getRandom(4, 8),
//                 x: "+=100",
//                 rotationZ: getRandom(0, 180),
//                 repeat: -1,
//                 yoyo: true,
//                 ease: Sine.easeInOut,
//             });
//         });
//     }, []);

//     return (
//         <motion.div
//             ref={containerRef}
//             id="container"
//             className="absolute w-full h-screen top-0 left-0 overflow-hidden"
//             style={{ y: translateY.initial ? parallaxY : '' }} 
//             {...fadeInMotion(0.5, 0)}
//         >
//             {[...Array(15)].map((_, i) => {
    
//                 return (
//                     <div
//                         key={i}
//                         className="petal fixed -left-[0] top-0 grayscale"
//                         style={{
//                             width: `${FRAME_WIDTH}px`,
//                             height: `50px`,
//                             backgroundImage: `url(${SPRITE_URL})`,
//                             backgroundRepeat: "no-repeat",
//                             backgroundPosition: "0 0",
//                         }}
//                     />
//                 );
//             })}
//         </motion.div>
//     );
// };

// export { Petal };