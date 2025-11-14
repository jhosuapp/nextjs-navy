import { useTransform, motion } from "framer-motion";

const Particle = ({ particle, mouseX, mouseY }) => {
    const x = useTransform(
      mouseX, 
      [0, typeof window !== 'undefined' ? window.innerWidth : 1920], 
      [-10 * particle.factor, 10 * particle.factor]
    );
    const y = useTransform(
      mouseY, 
      [0, typeof window !== 'undefined' ? window.innerHeight : 1080], 
      [-10 * particle.factor, 10 * particle.factor]
    );
  
    return (
        <motion.div
            className="absolute rounded-full"
            style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
            x,
            y,
            background: `radial-gradient(circle, rgba(168,85,247,${particle.opacity}) 0%, rgba(147,51,234,${particle.opacity * 0.5}) 100%)`,
            boxShadow: particle.hasTwinkle 
                ? `0 0 ${particle.size * 4}px rgba(168,85,247,0.8)` 
                : `0 0 ${particle.size * 2}px rgba(168,85,247,0.5)`,
            }}
            animate={{
                y: ['-20%', '120%'],
                opacity: [0, particle.opacity, particle.opacity, 0],
                scale: [0, 1, 1, 0],
            }}
            transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: 'linear',
            }}
        >
            {particle.hasTwinkle && (
            <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
                }}
                animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                    duration: 2,
                    delay: particle.delay + Math.random() * 3,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 3 + 2,
                    ease: 'easeInOut',
                }}
            />
            )}
        </motion.div>
    );
};

export { Particle }