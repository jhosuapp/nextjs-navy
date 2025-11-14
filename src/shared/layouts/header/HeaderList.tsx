import Link from 'next/link';
import styles from './header.module.css';
import { useMemo } from 'react';
import { HeaderListItem } from './HeaderListItem';

type Props = {
    items: { text: string; path: string }[]
}

const HeaderList = ( { items }:Props ):JSX.Element => {
    return (
        <ul className={ styles.headerList }>
            {useMemo(() => items.map(i => <HeaderListItem key={i.path} {...i} />), [items])}
        </ul>
    )
}

export { HeaderList }