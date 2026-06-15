import { type JSX } from 'react';
import { Controller } from 'react-hook-form';
import { TextAreaField } from '@/shared/components/textarea-field/TextAreaField';
import { ControlProps, errorMsg, Question } from '../types';
import { FieldShell } from './FieldShell';

type Props = ControlProps & { q: Extract<Question, { kind: 'textarea' }> };

const TextareaControl = ({ q, control, errors, t }: Props): JSX.Element => (
    <FieldShell num={q.num} name={q.name} t={t}>
        <Controller
            name={q.name}
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
                <TextAreaField
                    id={q.name}
                    name={q.name}
                    placeholder={t(`fields.${q.name}.placeholder`)}
                    feedback={errorMsg(errors, q.name)}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={(value as string | undefined) ?? ''}
                />
            )}
        />
    </FieldShell>
);

export { TextareaControl };
