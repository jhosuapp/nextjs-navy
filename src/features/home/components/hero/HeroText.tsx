import { fadeUpMotion } from '@/shared/motion';
import { motion } from 'framer-motion';

type MotionTextProps = {
    text: string;
    delays: string[];
    motionConfig: ReturnType<typeof fadeUpMotion>;
}
  
const HeroText = ({ text, delays, motionConfig }: MotionTextProps) => {
    return (
        <motion.p {...motionConfig}>
            {text.split('').map((char, i) => (
                <span key={`${char}-${i}`}>
                    <em style={{ animationDelay: delays[i] }}>{char}</em>
                    <em style={{ animationDelay: delays[i] }}>{char}</em>
                </span>
            ))}
        </motion.p>
    );
  };

export { HeroText }