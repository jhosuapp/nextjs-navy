import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchStore } from '@/shared/stores';
import { InputField } from '../input-field/InputField';
import { Button } from '../button/Button';

import icon from '@/config/assets/svg/icon-search.svg';
import styles from './search.module.css';

type Props = {
    placeholder?: string;
}

const Search = ({ placeholder = '' }:Props):JSX.Element => {
    const [prevValue, setPrevValue] = useState<string>('');
    const setValue = useSearchStore( state => state.setValue );

    useEffect(()=>{
        setValue('');
    },[]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValue(prevValue);
    }

    return (
        <form className={ styles.search } onSubmit={ (e)=> handleSubmit(e) }>
            <InputField
                placeholder={placeholder ?? "Search by username"}
                type='text'
                name='search-bans'
                id='search-bans'
                onChange={ (e)=> { setPrevValue(e.target.value) } }
            />
            <motion.div className={ styles.search__btn }>
                <Button 
                    style={'fit'} 
                    iconRight={ icon }
                    type='submit'
                />
            </motion.div>
        </form>
    )
}

export { Search }