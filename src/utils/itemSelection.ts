import { DiscriminatedItem, ResultOf } from '@graasp/sdk';

import truncate from 'lodash.truncate';

import { ITEM_SELECT_MODAL_TITLE_MAX_NAME_LENGTH } from '@/config/constants';

type TFunction = (key: string, params?: { [key: string]: unknown }) => string;

type TitleProps = {
  items: ResultOf<DiscriminatedItem>;
  count: number;
  translateBuilder: TFunction;
  translateKey: string;
};

export const computeTitle = ({
  items,
  count,
  translateBuilder,
  translateKey,
}: TitleProps): string =>
  Object.values(items.data ?? {}).length
    ? translateBuilder(translateKey, {
        name: truncate(Object.values(items.data)[0].name, {
          length: ITEM_SELECT_MODAL_TITLE_MAX_NAME_LENGTH,
        }),
        count,
      })
    : translateBuilder(translateKey);

type ButtonProps = {
  translateBuilder: TFunction;
  translateKey: string;
  name?: string;
};

export const computeButtonText = ({
  name,
  translateBuilder,
  translateKey,
}: ButtonProps): string =>
  translateBuilder(translateKey, { name, count: name ? 1 : 0 });
