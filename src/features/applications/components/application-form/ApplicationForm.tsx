import { type JSX, useMemo, useState } from 'react';
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
import { ChoiceControl } from './fields/ChoiceControl';
import { MultiChoiceControl } from './fields/MultiChoiceControl';
import icon from '@/config/assets/svg/icon-arrow-left.svg';

import styles from './applicationForm.module.css';

type Props = {
    t: ITranslations;
};

const PERSONAL_STEP: Step = {
    id: 'personal',
    questions: [
        { kind: 'choice', name: 'tipo', num: '1', options: ['helper', 'tester'] },
        { kind: 'text', name: 'nombre', num: '2', type: 'text' },
        { kind: 'text', name: 'discord', num: '3', type: 'text' },
        { kind: 'text', name: 'edad', num: '4', type: 'number' },
    ],
};

const HELPER_STEPS: Step[] = [
    {
        id: 'role',
        questions: [
            { kind: 'textarea', name: 'labor_helper', num: '5' },
            { kind: 'textarea', name: 'funciones_helper', num: '6' },
            { kind: 'textarea', name: 'meta_principal', num: '7' },
        ],
    },
    {
        id: 'concepts',
        questions: [
            { kind: 'yesno-detail', name: 'claro_spam', detail: 'detalle_spam', num: '8' },
            { kind: 'yesno-detail', name: 'claro_flood', detail: 'detalle_flood', num: '9' },
            { kind: 'yesno-detail', name: 'conoce_hacks_ss', detail: 'detalle_hacks_ss', num: '10' },
            { kind: 'textarea', name: 'hacks_pvp', num: '11' },
        ],
    },
    {
        id: 'scenarios',
        questions: [
            { kind: 'textarea', name: 'usuarios_peleando', num: '12' },
            { kind: 'textarea', name: 'testers_peleando', num: '13' },
            { kind: 'textarea', name: 'ticket_tester', num: '14' },
            { kind: 'textarea', name: 'ticket_reporte', num: '15' },
        ],
    },
    {
        id: 'commitment',
        questions: [
            { kind: 'textarea', name: 'opinion_tierlist', num: '16' },
            { kind: 'yesno', name: 'tiempo_disciplina', num: '17' },
            { kind: 'yesno', name: 'capacidad_resolucion', num: '18' },
            { kind: 'yesno', name: 'se_enoja_facil', num: '19' },
        ],
    },
];

const TESTER_STEPS: Step[] = [
    {
        id: 'testerProfile',
        questions: [
            { kind: 'text', name: 'region', num: '5', type: 'text' },
            { kind: 'multi-choice', name: 'modos', num: '6', options: ['netherite', 'crystal', 'sword'] },
            { kind: 'textarea', name: 'tier_modo', num: '7' },
            { kind: 'yesno-detail', name: 'experiencia_tester', detail: 'detalle_experiencia', num: '8' },
        ],
    },
    {
        id: 'testerBackground',
        questions: [
            { kind: 'yesno-detail', name: 'baneado', detail: 'detalle_baneado', num: '9' },
            { kind: 'yesno', name: 'uso_cheats', num: '10' },
            { kind: 'yesno-detail', name: 'clanes_pvp', detail: 'detalle_clanes', num: '11' },
            { kind: 'yesno', name: 'toxico', num: '12' },
        ],
    },
    {
        id: 'testerMotivation',
        questions: [
            { kind: 'textarea', name: 'opinion_navy', num: '13' },
            { kind: 'textarea', name: 'por_que_tester', num: '14' },
            { kind: 'textarea', name: 'tiempo_testeos', num: '15' },
            { kind: 'textarea', name: 'servidores', num: '16' },
            { kind: 'textarea', name: 'sospecha_hacks', num: '17' },
        ],
    },
];

const CONDITIONALS: Array<[FieldName, FieldName]> = [
    ['claro_spam', 'detalle_spam'],
    ['claro_flood', 'detalle_flood'],
    ['conoce_hacks_ss', 'detalle_hacks_ss'],
    ['experiencia_tester', 'detalle_experiencia'],
    ['baneado', 'detalle_baneado'],
    ['clanes_pvp', 'detalle_clanes'],
];

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

    const tipo = watch('tipo');

    const STEPS = useMemo<Step[]>(
        () =>
            tipo === 'tester'
                ? [PERSONAL_STEP, ...TESTER_STEPS]
                : [PERSONAL_STEP, ...HELPER_STEPS],
        [tipo]
    );

    const TOTAL = STEPS.length;

    // Mapa campo -> índice de paso (incluye los detalle condicionales)
    const FIELD_STEP = useMemo<Partial<Record<FieldName, number>>>(() => {
        const map: Partial<Record<FieldName, number>> = {};
        STEPS.forEach((s, i) => {
            s.questions.forEach((q) => {
                map[q.name] = i;
                if (q.kind === 'yesno-detail') map[q.detail] = i;
            });
        });
        return map;
    }, [STEPS]);

    const safeStep = Math.min(step, TOTAL - 1);
    const isLast = safeStep === TOTAL - 1;

    const stepFields = (index: number): FieldName[] => {
        const fields = STEPS[index].questions.map((q) => q.name);
        CONDITIONALS.forEach(([radio, detail]) => {
            if (fields.includes(radio) && watch(radio) === 'si') fields.push(detail);
        });
        return fields;
    };

    const goNext = async (): Promise<void> => {
        const valid = await trigger(stepFields(safeStep));
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

        if (firstErrorStep !== undefined && firstErrorStep !== safeStep) {
            setDirection(firstErrorStep > safeStep ? 1 : -1);
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
                        {t('nav.step', { current: safeStep + 1, total: TOTAL })}
                    </span>
                    <span className={styles.stepper__title}>
                        {t(`steps.${STEPS[safeStep].id}`)}
                    </span>
                </div>
                <ol className={styles.dots} aria-hidden="true">
                    {STEPS.map((s, i) => (
                        <li
                            key={s.id}
                            className={`${styles.dot} ${i === safeStep ? styles.dot__active : ''} ${i < safeStep ? styles.dot__done : ''}`}
                        />
                    ))}
                </ol>
            </div>

            {/* Paso actual */}
            <div className={styles.stepArea}>
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div
                        key={safeStep}
                        className={styles.step}
                        custom={direction}
                        variants={reduceMotion ? undefined : stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                    >
                        {STEPS[safeStep].questions.map((q) => {
                            if (q.kind === 'choice')
                                return (
                                    <ChoiceControl
                                        key={q.name}
                                        q={q}
                                        control={control}
                                        errors={errors}
                                        t={t}
                                    />
                                );
                            if (q.kind === 'multi-choice')
                                return (
                                    <MultiChoiceControl
                                        key={q.name}
                                        q={q}
                                        control={control}
                                        errors={errors}
                                        t={t}
                                    />
                                );
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
