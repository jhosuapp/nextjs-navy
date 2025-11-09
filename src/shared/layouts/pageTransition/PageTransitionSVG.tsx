import { anim, curve, translate } from './pageTransition.motion';
import { motion } from 'framer-motion';

type Props = {
    height: number;
    width: number;
}

const SVG = ({ height, width }:Props):JSX.Element => {

    const initialPath = `
        M0 300 
        Q${width/2} 0 ${width} 300
        L${width} ${height + 300}
        Q${width/2} ${height + 600} 0 ${height + 300}
        L0 0
    `

    const targetPath = `
        M0 300
        Q${width/2} 0 ${width} 300
        L${width} ${height}
        Q${width/2} ${height} 0 ${height}
        L0 0
    `

    return (
        <motion.svg {...anim(translate)} fill={'#F0F1FA'}>
            <motion.path {...anim(curve(initialPath, targetPath))} />
        </motion.svg>
    )
}

export { SVG };