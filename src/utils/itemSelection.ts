import { DiscriminatedItem, ItemSettings, ResultOf } from '@graasp/sdk';

import { ITEM_SELECT_MODAL_TITLE_MAX_NAME_LENGTH } from '@/config/constants';

import { applyEllipsisOnLength } from './item';

type TFunction = (key: string, params?: { [key: string]: unknown }) => string;

type TitleProps = {
  items: ResultOf<DiscriminatedItem<ItemSettings>> | undefined;
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
  items && Object.values(items.data ?? {}).length
    ? translateBuilder(translateKey, {
        name: applyEllipsisOnLength(
          Object.values(items.data)[0].name,
          ITEM_SELECT_MODAL_TITLE_MAX_NAME_LENGTH,
        ),
        count,
      })
    : translateBuilder(translateKey);

type ButtonProps = {
  translateBuilder: TFunction;
  translateKey: string;
  name?: string;
};

export const computButtonText = ({
  name,
  translateBuilder,
  translateKey,
}: ButtonProps): string =>
  translateBuilder(translateKey, { name, count: name ? 1 : 0 });
