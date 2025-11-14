import React, { useEffect, useState } from 'react';
import styles from './floatingDots.module.css';

const FloatingDots = () => {
    const [squares, setSquares] = useState<JSX.Element[]>([]);

    useEffect(() => {
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
    }, []);

    return (
        <section className={styles.floatingDots}>
            {squares}
        </section>
    );
};

export { FloatingDots };