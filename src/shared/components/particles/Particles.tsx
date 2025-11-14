import React, { useEffect, useState } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

import { Particle } from './Particle';
import styles from './particles.module.css';

const Particles = () => {
    const [particles, setParticles] = useState([]);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, { stiffness: 100, damping: 30 });
    const smoothY = useSpring(mouseY, { stiffness: 100, damping: 30 });

    useEffect(() => {
        const newParticles = Array.from({ length: 120 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 10 + 8,
            delay: Math.random() * 2,
            opacity: Math.random() * 0.5 + 0.3,
            hasTwinkle: Math.random() > 0.7,
            factor: Math.random() * 0.5 + 0.5,
        }));
        setParticles(newParticles);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className={ styles.particles }>
            {particles.map((particle) => (
                <Particle key={particle.id} particle={particle} mouseX={smoothX} mouseY={smoothY} />
            ))}
        </div>
    );
};

export { Particles };