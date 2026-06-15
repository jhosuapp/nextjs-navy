import { Control, FieldErrors } from 'react-hook-form';
import { ITranslations } from '@/shared/interfaces/globals';
import { ApplicationFormInterface } from '../../validations/application-form.validation';

export type FieldName = keyof ApplicationFormInterface;

export type Question =
    | { kind: 'text'; name: FieldName; num: string; type: string }
    | { kind: 'textarea'; name: FieldName; num: string }
    | { kind: 'yesno'; name: FieldName; num: string }
    | { kind: 'yesno-detail'; name: FieldName; detail: FieldName; num: string };

export type Step = { id: string; questions: Question[] };

export type ControlProps = {
    control: Control<ApplicationFormInterface>;
    errors: FieldErrors<ApplicationFormInterface>;
    t: ITranslations;
};

export const errorMsg = (
    errors: FieldErrors<ApplicationFormInterface>,
    name: FieldName
): string | undefined => errors[name]?.message as string | undefined;
