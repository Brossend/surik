import type {IUiButtonProps} from './ui-button.types';

export const uiButtonDefaultProps: Required<IUiButtonProps> = {
    label: '',
    nativeType: 'button',
    variant: 'primary',
    disabled: false,
    loading: false,
    fullWidth: false,
};