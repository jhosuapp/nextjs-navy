import styles from './title.module.css';

type Props = {
    text: string;
    className?: string;
}

const Title = ({ text, className }:Props):JSX.Element => {
    return (
        <h3 className={ `${styles.title} ${className}` }>{ text }</h3>
    )
}

export { Title }