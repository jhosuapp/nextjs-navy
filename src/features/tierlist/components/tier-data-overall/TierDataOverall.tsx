import { fadeInMotion } from '@/shared/motion';
import { motion } from 'framer-motion';

const TierDataOverall = ():JSX.Element => {
    return (
        <motion.article {...fadeInMotion(0, 0)}>
            <p className='text-white'>Hola mundo</p>
        </motion.article>
    )
}

export { TierDataOverall }