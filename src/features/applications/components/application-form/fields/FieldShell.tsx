import { type JSX, type ReactNode } from 'react';
import { ITranslations } from '@/shared/interfaces/globals';
import { FieldName } from '../types';
import styles from '../applicationForm.module.css';

type Props = {
    num: string;
    name: FieldName;
    t: ITranslations;
    children: ReactNode;
};

const FieldShell = ({ num, name, t, children }: Props): JSX.Element => (
    <div className={styles.field}>
        <label className={styles.field__label} htmlFor={name}>
            <span className={styles.field__num}>{num}</span>
            <span>{t(`fields.${name}.label`)}</span>
        </label>
        {children}
    </div>
);

export { FieldShell };
