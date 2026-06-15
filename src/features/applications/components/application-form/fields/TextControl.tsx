import { type JSX } from 'react';
import { Controller } from 'react-hook-form';
import { InputField } from '@/shared/components/input-field/InputField';
import { ControlProps, errorMsg, Question } from '../types';
import { FieldShell } from './FieldShell';

type Props = ControlProps & { q: Extract<Question, { kind: 'text' }> };

const TextControl = ({ q, control, errors, t }: Props): JSX.Element => (
    <FieldShell num={q.num} name={q.name} t={t}>
        <Controller
            name={q.name}
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                    id={q.name}
                    name={q.name}
                    type={q.type}
                    inputMode={q.type === 'number' ? 'numeric' : undefined}
                    autoComplete={q.type === 'email' ? 'email' : 'off'}
                    placeholder={t(`fields.${q.name}.placeholder`)}
                    feedback={errorMsg(errors, q.name)}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={(value as string | number | undefined) ?? ''}
                />
            )}
        />
    </FieldShell>
);

export { TextControl };
