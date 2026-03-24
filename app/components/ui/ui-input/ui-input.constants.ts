import type { IUiInputProps } from '~/components/ui/ui-input/ui-input.types';

export const uiInputDefaultProps: Required<IUiInputProps> = {
    type: 'text',
    id: '',
    name: '',
    label: '',
    showLabel: true,
    required: false,
    placeholder: '',
    leftIcon: '',
    disabled: false,
    readonly: false,
    autocomplete: '',
    emailMask: true,
    lowercaseEmail: true,
    error: '',
    hint: '',
};