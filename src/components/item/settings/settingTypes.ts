import { UnionOfConst } from '@graasp/sdk';

export const SettingVariant = {
  List: 'list',
  Button: 'button',
} as const;
export type SettingVariantType = UnionOfConst<typeof SettingVariant>;
