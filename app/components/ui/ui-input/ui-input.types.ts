export type TUiInputType = 'text' | 'email' | 'password' | 'nickname';

export type TResolvedInputType =
    | 'text'
    | 'email'
    | 'search'
    | 'tel'
    | 'url'
    | 'none'
    | 'numeric'
    | 'decimal'
    | undefined;

export type TUiInputEmits = {
    (event: 'focus', value: FocusEvent): void;
    (event: 'blur', value: FocusEvent): void;
};

export interface IUiInputProps {
    type?: TUiInputType;
    id?: string;
    name?: string;
    label?: string;
    showLabel?: boolean;
    required?: boolean;
    placeholder?: string;
    leftIcon?: string;
    disabled?: boolean;
    readonly?: boolean;
    autocomplete?: string;
    emailMask?: boolean;
    lowercaseEmail?: boolean;
    error?: string;
    hint?: string;
}