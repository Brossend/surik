export type TUiCheckboxEmits = {
    (event: 'focus', value: FocusEvent): void;
    (event: 'blur', value: FocusEvent): void;
    (event: 'change', value: boolean): void;
};

export interface IUiCheckboxProps {
    id?: string;
    name?: string;
    label?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    ariaLabel?: string;
}