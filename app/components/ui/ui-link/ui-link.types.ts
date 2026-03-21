export type TUiLinkTarget = '_self' | '_blank' | '_parent' | '_top';

export type TUiLinkEmits = {
    (event: 'click', value: MouseEvent): void;
};

export interface IUiLinkProps {
    to?: string;
    href?: string;
    label?: string;
    target?: TUiLinkTarget;
    disabled?: boolean;
    underline?: boolean;
}