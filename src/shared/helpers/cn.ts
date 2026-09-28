/** Une clases condicionales ignorando valores falsy. */
export const cn = (...classes: (string | false | null | undefined)[]): string =>
    classes.filter(Boolean).join(" ");
