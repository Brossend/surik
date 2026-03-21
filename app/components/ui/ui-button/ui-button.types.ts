export type TUiButtonNativeType = 'button' | 'submit' | 'reset';

export type TUiButtonVariant = 'primary';

export type TUiButtonEmits = {
    (event: 'click', value: MouseEvent): void;
};

export interface IUiButtonProps {
    label?: string;
    nativeType?: TUiButtonNativeType;
    variant?: TUiButtonVariant;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
}