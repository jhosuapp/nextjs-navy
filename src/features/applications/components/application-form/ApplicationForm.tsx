import { type JSX, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Controller, FieldErrors } from 'react-hook-form';
import { ApplicationFormInterface } from '../../validations/application-form.validation';
import { Button } from '@/shared/components/button/Button';
import { ITranslations } from '@/shared/interfaces/globals';
import { useApplicationFormController } from '../../hooks/useApplicationForm.controller';
import { FieldName, Step } from './types';
import { TextControl } from './fields/TextControl';
import { TextareaControl } from './fields/TextareaControl';
import { YesNoControl } from './fields/YesNoControl';
import icon from '@/config/assets/svg/icon-arrow-left.svg';

import styles from './applicationForm.module.css';

type Props = {
    t: ITranslations;
};

const STEPS: Step[] = [
    {
        id: 'personal',
        questions: [
            { kind: 'text', name: 'nombre', num: '1', type: 'text' },
            { kind: 'text', name: 'correo', num: '2', type: 'email' },
            { kind: 'text', name: 'edad', num: '3', type: 'number' },
        ],
    },
    {
        id: 'role',
        questions: [
            { kind: 'textarea', name: 'labor_helper', num: '4' },
            { kind: 'textarea', name: 'funciones_helper', num: '5' },
            { kind: 'textarea', name: 'meta_principal', num: '6' },
        ],
    },
    {
        id: 'concepts',
        questions: [
            { kind: 'yesno-detail', name: 'claro_spam', detail: 'detalle_spam', num: '7' },
            { kind: 'yesno-detail', name: 'claro_flood', detail: 'detalle_flood', num: '8' },
            { kind: 'yesno-detail', name: 'conoce_hacks_ss', detail: 'detalle_hacks_ss', num: '9' },
            { kind: 'textarea', name: 'hacks_pvp', num: '10' },
        ],
    },
    {
        id: 'scenarios',
        questions: [
            { kind: 'textarea', name: 'usuarios_peleando', num: '11' },
            { kind: 'textarea', name: 'testers_peleando', num: '12' },
            { kind: 'textarea', name: 'ticket_tester', num: '13' },
            { kind: 'textarea', name: 'ticket_reporte', num: '14' },
        ],
    },
    {
        id: 'commitment',
        questions: [
            { kind: 'textarea', name: 'opinion_tierlist', num: '15' },
            { kind: 'yesno', name: 'tiempo_disciplina', num: '16' },
            { kind: 'yesno', name: 'capacidad_resolucion', num: '17' },
            { kind: 'yesno', name: 'se_enoja_facil', num: '18' },
        ],
    },
];

const CONDITIONALS: Array<[FieldName, FieldName]> = [
    ['claro_spam', 'detalle_spam'],
    ['claro_flood', 'detalle_flood'],
    ['conoce_hacks_ss', 'detalle_hacks_ss'],
];

const TOTAL = STEPS.length;

// Mapa campo -> índice de paso (incluye los campos de detalle condicionales)
const FIELD_STEP: Partial<Record<FieldName, number>> = {};
STEPS.forEach((s, i) => {
    s.questions.forEach((q) => {
        FIELD_STEP[q.name] = i;
        if (q.kind === 'yesno-detail') FIELD_STEP[q.detail] = i;
    });
});

const stepVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 32 : -32 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -32 : 32 }),
};

const ApplicationForm = ({ t }: Props): JSX.Element => {
    const { control, errors, watch, trigger, handleSubmit, onSubmit, mutation } =
        useApplicationFormController({ t });

    const reduceMotion = useReducedMotion();
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);

    const isLast = step === TOTAL - 1;

    const stepFields = (index: number): FieldName[] => {
        const fields = STEPS[index].questions.map((q) => q.name);
        CONDITIONALS.forEach(([radio, detail]) => {
            if (fields.includes(radio) && watch(radio) === 'si') fields.push(detail);
        });
        return fields;
    };

    const goNext = async (): Promise<void> => {
        const valid = await trigger(stepFields(step));
        if (!valid) return;
        setDirection(1);
        setStep((s) => Math.min(s + 1, TOTAL - 1));
    };

    const goBack = (): void => {
        setDirection(-1);
        setStep((s) => Math.max(s - 1, 0));
    };

    // Al enviar: si hay errores en pasos anteriores, vuelve al primer paso con error
    const onInvalid = (formErrors: FieldErrors<ApplicationFormInterface>): void => {
        const firstErrorStep = (Object.keys(formErrors) as FieldName[])
            .map((name) => FIELD_STEP[name])
            .filter((i): i is number => i !== undefined)
            .sort((a, b) => a - b)[0];

        if (firstErrorStep !== undefined && firstErrorStep !== step) {
            setDirection(firstErrorStep > step ? 1 : -1);
            setStep(firstErrorStep);
        }
    };

    // Evita el submit accidental con Enter en pasos intermedios (no en textareas)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>): void => {
        const target = e.target as HTMLElement;
        if (e.key === 'Enter' && target.tagName !== 'TEXTAREA' && !isLast) {
            e.preventDefault();
            void goNext();
        }
    };

    // Mensaje de agradecimiento tras enviar (reemplaza los campos)
    if (mutation.isSuccess) {
        return (
            <div className={styles.form}>
                <motion.div
                    className={styles.success}
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                    <span className={styles.success__icon} aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                    </span>
                    <h2 className={styles.success__title}>{t('success.title')}</h2>
                    <p className={styles.success__message}>{t('success.message')}</p>
                </motion.div>
            </div>
        );
    }

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            onKeyDown={handleKeyDown}
            noValidate
        >
            {/* Honeypot anti-bots: invisible para usuarios reales */}
            <Controller
                name="website"
                control={control}
                render={({ field }) => (
                    <input
                        {...field}
                        value={(field.value as string | undefined) ?? ''}
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className={styles.honeypot}
                    />
                )}
            />

            {/* Stepper / progreso */}
            <div className={styles.stepper}>
                <div className={styles.stepper__head}>
                    <span className={styles.stepper__count}>
                        {t('nav.step', { current: step + 1, total: TOTAL })}
                    </span>
                    <span className={styles.stepper__title}>
                        {t(`steps.${STEPS[step].id}`)}
                    </span>
                </div>
                <ol className={styles.dots} aria-hidden="true">
                    {STEPS.map((s, i) => (
                        <li
                            key={s.id}
                            className={`${styles.dot} ${i === step ? styles.dot__active : ''} ${i < step ? styles.dot__done : ''}`}
                        />
                    ))}
                </ol>
            </div>

            {/* Paso actual */}
            <div className={styles.stepArea}>
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div
                        key={step}
                        className={styles.step}
                        custom={direction}
                        variants={reduceMotion ? undefined : stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                    >
                        {STEPS[step].questions.map((q) => {
                            if (q.kind === 'text')
                                return (
                                    <TextControl
                                        key={q.name}
                                        q={q}
                                        control={control}
                                        errors={errors}
                                        t={t}
                                    />
                                );
                            if (q.kind === 'textarea')
                                return (
                                    <TextareaControl
                                        key={q.name}
                                        q={q}
                                        control={control}
                                        errors={errors}
                                        t={t}
                                    />
                                );
                            return (
                                <YesNoControl
                                    key={q.name}
                                    q={q}
                                    control={control}
                                    errors={errors}
                                    t={t}
                                    showDetail={
                                        q.kind === 'yesno-detail' &&
                                        watch(q.name) === 'si'
                                    }
                                />
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navegación */}
            <div className={styles.nav}>
                {step > 0 && (
                    <Button
                        type='button'
                        style={'fit'}
                        isSmall
                        iconRight={icon}
                        className='!w-fit !max-w-fit !min-w-fit'
                        onClick={goBack}
                    />
                )}
                {!isLast && (
                    <Button
                        type="button"
                        text={t('nav.next')}
                        style="secondary"
                        isSmall
                        className="!ml-auto"
                        onClick={goNext}
                    />
                )}
                {isLast && (
                    <Button
                        type="submit"
                        text={t('cta')}
                        style="secondary"
                        isSmall
                        className="!ml-auto"
                        isLoad={mutation.isPending}
                    />
                )}
            </div>
        </form>
    );
};

export { ApplicationForm };
