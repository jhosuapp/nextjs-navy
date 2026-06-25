import { useState, type FormEvent, type JSX } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import styles from './botInput.module.css';
import iconSend from '@/config/assets/png/icon-send.png';

type Props = {
    placeholder: string;
    sendLabel: string;
    disabled?: boolean;
    onSubmit: (value: string) => void;
};

const BotInput = ({ placeholder, sendLabel, disabled = false, onSubmit }: Props): JSX.Element => {
    const [value, setValue] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (disabled || trimmed.length === 0) return;
        onSubmit(trimmed);
        setValue('');
    }

    return (
        <form className={ `${styles.botInput} ${disabled ? 'opacity-60' : ''}` } onSubmit={ handleSubmit }>
            <input
                type="text"
                placeholder={ placeholder }
                disabled={ disabled }
                value={ value }
                autoComplete="off"
                autoFocus
                onChange={ (e) => setValue(e.target.value) }
            />
            <motion.button
                type="submit"
                disabled={ disabled }
                aria-label={ sendLabel }
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
            >
                <Image src={ iconSend } alt="" aria-hidden="true" />
            </motion.button>
        </form>
    )
}

export { BotInput }
