import { type JSX } from 'react';
import { Controller } from 'react-hook-form';
import { ControlProps, errorMsg, Question } from '../types';
import styles from '../applicationForm.module.css';

type Props = ControlProps & {
    q: Extract<Question, { kind: 'multi-choice' }>;
};

const MultiChoiceControl = ({ q, control, errors, t }: Props): JSX.Element => {
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
                render={({ field: { value, onChange, onBlur } }) => {
                    const selected = (value as string[] | undefined) ?? [];
                    const toggle = (option: string) => {
                        const next = selected.includes(option)
                            ? selected.filter((item) => item !== option)
                            : [...selected, option];
                        onChange(next);
                    };
                    return (
                        <div
                            className={styles.options}
                            role="group"
                            aria-label={t(`fields.${q.name}.label`)}
                        >
                            {q.options.map((option) => {
                                const active = selected.includes(option);
                                return (
                                    <label
                                        key={option}
                                        className={`${styles.option} ${active ? styles.option__active : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            name={q.name}
                                            value={option}
                                            checked={active}
                                            onChange={() => toggle(option)}
                                            onBlur={onBlur}
                                            className={styles.option__input}
                                        />
                                        <span>{t(`options.${option}`)}</span>
                                    </label>
                                );
                            })}
                        </div>
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

export { MultiChoiceControl };
