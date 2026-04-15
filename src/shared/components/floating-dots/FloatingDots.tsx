import React, { useEffect, useState, type JSX } from 'react';
import styles from './floatingDots.module.css';
import { useSwitchStore } from '@/shared/stores';

const FloatingDots = () => {
    const disable_particles = useSwitchStore(state => state.switches).disable_particles;
    const [squares, setSquares] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if(!disable_particles){
            const interval = setInterval(() => {
                const size = Math.random() * -10;
                const width = 8 + size;
                const height = 8 + size;
                const top = Math.random() * window.innerHeight;
                const left = Math.random() * window.innerWidth;
                const key = Date.now() + Math.random();
    
                const newSquare = (
                    <span
                        key={key}
                        style={{
                            width: `${width}px`,
                            height: `${height}px`,
                            top: `${top}px`,
                            left: `${left}px`
                        }}
                    />
                );
    
                setSquares(prev => [...prev, newSquare]);
    
                //Delete span
                setTimeout(() => {
                    setSquares(prev => prev.filter(span => span.key !== key.toString()));
                }, 20000);
            }, 150);
    
            return () => clearInterval(interval);
        }
    }, [disable_particles]);

    if(disable_particles){
        return (
            <>
            </>
        )
    }

    return (
        <section className={styles.floatingDots}>
            {squares}
        </section>
    );
};

export { FloatingDots };