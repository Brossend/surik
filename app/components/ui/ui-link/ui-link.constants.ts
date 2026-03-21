import type {IUiLinkProps} from './ui-link.types';

export const uiLinkDefaultProps: Required<IUiLinkProps> = {
    to: '',
    href: '',
    label: '',
    target: '_self',
    disabled: false,
    underline: false,
};