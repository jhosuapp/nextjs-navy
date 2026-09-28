import { type JSX } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Controller } from 'react-hook-form';
import { paths } from '@/shared/constants';
import { ControlProps, errorMsg, Question } from '../types';
import styles from '../applicationForm.module.css';

type Props = ControlProps & {
    q: Extract<Question, { kind: 'consent' }>;
};

/**
 * Aceptación de los términos legales.
 *
 * Los enlaces usan `next/link` con `target="_blank"` y no `CustomLink`:
 * `CustomLink` navega con `router.push` y saldría de la página, perdiendo
 * todas las respuestas del formulario multi-paso.
 */
const ConsentControl = ({ q, control, errors, t }: Props): JSX.Element => {
    const fieldError = errorMsg(errors, q.name);
    const { locale } = useRouter();

    return (
        <fieldset className={styles.field}>
            <legend className={styles.field__label}>
                <span className={styles.field__num}>{q.num}</span>
                <span>{t(`fields.${q.name}.legend`)}</span>
            </legend>

            <Controller
                name={q.name}
                control={control}
                render={({ field: { value, onChange, onBlur } }) => {
                    const checked = value === true;
                    return (
                        <label
                            className={`${styles.option} ${styles.consent} ${checked ? styles.option__active : ''}`}
                        >
                            <input
                                type="checkbox"
                                name={q.name}
                                checked={checked}
                                onChange={(event) => onChange(event.target.checked)}
                                onBlur={onBlur}
                                className={styles.option__input}
                            />
                            <span aria-hidden="true" className={styles.consent__box}>
                                {checked ? '✓' : ''}
                            </span>
                            <span className={styles.consent__text}>
                                {t(`fields.${q.name}.labelBefore`)}{' '}
                                <Link
                                    href={paths.tyc}
                                    locale={locale}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.consent__link}
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    {t(`fields.${q.name}.linkTerms`)}
                                </Link>{' '}
                                {t(`fields.${q.name}.labelMiddle`)}{' '}
                                <Link
                                    href={paths.pdp}
                                    locale={locale}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.consent__link}
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    {t(`fields.${q.name}.linkPrivacy`)}
                                </Link>
                                {t(`fields.${q.name}.labelAfter`)}
                            </span>
                        </label>
                    );
                }}
            />

            {fieldError && (
                <span role="alert" className={'field__error'}>
                    {fieldError}
                </span>
            )}
        </fieldset>
    );
};

export { ConsentControl };
