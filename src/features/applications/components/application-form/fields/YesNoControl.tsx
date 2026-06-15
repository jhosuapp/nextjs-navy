import { type JSX } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Controller } from 'react-hook-form';
import { TextAreaField } from '@/shared/components/textarea-field/TextAreaField';
import { ControlProps, errorMsg, Question } from '../types';
import styles from '../applicationForm.module.css';

type Props = ControlProps & {
    q: Extract<Question, { kind: 'yesno' | 'yesno-detail' }>;
    showDetail: boolean;
};

const YesNoControl = ({ q, control, errors, t, showDetail }: Props): JSX.Element => {
    const fieldError = errorMsg(errors, q.name);
    const detail = q.kind === 'yesno-detail' ? q.detail : undefined;

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
                        {(['si', 'no'] as const).map((option) => {
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

            {detail && (
                <AnimatePresence initial={false}>
                    {showDetail && (
                        <motion.div
                            key="detail"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            style={{ overflow: 'hidden' }}
                        >
                            <Controller
                                name={detail}
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextAreaField
                                        id={detail}
                                        name={detail}
                                        className={styles.detail}
                                        placeholder={t(`fields.${detail}.placeholder`)}
                                        feedback={errorMsg(errors, detail)}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={(value as string | undefined) ?? ''}
                                    />
                                )}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </fieldset>
    );
};

export { YesNoControl };
