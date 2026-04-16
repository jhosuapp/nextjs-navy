import styles from './floatingDots.module.css';
import { useEffect, useState, type JSX } from 'react';
import { useSwitchStore } from '@/shared/stores/switch.store';

const MAX_DOTS = 50;
const INTERVAL_TIME = 300; 

const FloatingDots = (): JSX.Element => {
    const disable_particles = useSwitchStore(state => state.switches).disable_particles;
    const [squares, setSquares] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if (disable_particles) return;

        const interval = setInterval(() => {
            const size = Math.random() * -10;
            const width = 8 + size;
            const height = 8 + size;
            const top = Math.random() * window.innerHeight;
            const left = Math.random() * window.innerWidth;
            const key = `${Date.now()}-${Math.random()}`;

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

            setSquares(prev => {
                const next = [...prev, newSquare];

                return next.length > MAX_DOTS ? next.slice(-MAX_DOTS) : next;
            });

        }, INTERVAL_TIME);

        return () => clearInterval(interval);
    }, [disable_particles]);

    if (disable_particles) return <></>;

    return (
        <section className={styles.floatingDots}>
            {squares}
        </section>
    );
};

export { FloatingDots };