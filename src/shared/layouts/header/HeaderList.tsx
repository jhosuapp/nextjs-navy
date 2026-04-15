import styles from './header.module.css';
import { HeaderListItem } from './HeaderListItem';

type Props = {
    items: { text: string; path: string; prefetchKey?: string[]; }[]
}

const HeaderList = ( { items }:Props ):JSX.Element => {
    return (
        <ul className={ styles.headerList }>
            {items.map(i => <HeaderListItem key={i.path} {...i} />)}
        </ul>
    )
}

export { HeaderList }