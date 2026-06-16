import { type JSX } from 'react';
import { Controller } from 'react-hook-form';
import { ControlProps, errorMsg, Question } from '../types';
import styles from '../applicationForm.module.css';

type Props = ControlProps & {
    q: Extract<Question, { kind: 'choice' }>;
};

const ChoiceControl = ({ q, control, errors, t }: Props): JSX.Element => {
    const fieldError = errorMsg(errors, q.name);

    return (
        <fieldset className={styles.field}>
            <legend className={styles.field__label}>
                <span className={styles.field__num}>{q.num}</span>
                <span>{t(`fields.${q.name}.label`)}</span>
            </legend>

            <Controller
                name={q.name}
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                    <div
                        className={styles.options}
                        role="radiogroup"
                        aria-label={t(`fields.${q.name}.label`)}
                    >
                        {q.options.map((option) => {
                            const active = value === option;
                            return (
                                <label
                                    key={option}
                                    className={`${styles.option} ${active ? styles.option__active : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name={q.name}
                                        value={option}
                                        checked={active}
                                        onChange={() => onChange(option)}
                                        onBlur={onBlur}
                                        className={styles.option__input}
                                    />
                                    <span>{t(`options.${option}`)}</span>
                                </label>
                            );
                        })}
                    </div>
                )}
            />

            {fieldError && (
                <span role="alert" className={'field__error'}>
                    {fieldError}
                </span>
            )}
        </fieldset>
    );
};

export { ChoiceControl };
