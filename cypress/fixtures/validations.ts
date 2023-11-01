import {
  DiscriminatedItem,
  ItemValidation,
  ItemValidationGroup,
  ItemValidationProcess,
  ItemValidationStatus,
} from '@graasp/sdk';

import { ApiConfig } from '../support/types';
import { SAMPLE_PUBLIC_ITEMS } from './items';

export const VALIDATED_ITEM: DiscriminatedItem = {
  ...SAMPLE_PUBLIC_ITEMS.items[0],
  updatedAt: '2019-07-27T07:45:00Z',
};

export const ITEM_VALIDATION_AND_REVIEW = {
  itemValidationId: '6cbe87b9-0098-412f-a1ab-93e140ae1659',
  reviewStatusId: '',
  reviewReason: '',
  createdAt: '2023-07-27T07:45:00Z',
};

export const iVG: ItemValidationGroup = {
  id: '65c57d69-0e59-4569-a422-f330c31c995c',
  item: VALIDATED_ITEM,
  createdAt: '2021-08-11T12:56:36.834Z',
  itemValidations: [
    {
      id: 'id1',
      item: VALIDATED_ITEM,
      // itemValidationGroup: iVG,
      process: ItemValidationProcess.BadWordsDetection,
      status: ItemValidationStatus.Success,
      result: '',
      updatedAt: '2021-04-13 14:56:34.749946',
      createdAt: '2021-04-13 14:56:34.749946',
    },
    {
      id: 'id2',
      item: VALIDATED_ITEM,
      // itemValidationGroup: iVG,
      process: ItemValidationProcess.ImageChecking,
      status: ItemValidationStatus.Success,
      result: '',
      updatedAt: '2021-04-13 14:56:34.749946',
      createdAt: '2021-04-13 14:56:34.749946',
    },
    // todo: fix this type issue
  ] as unknown as ItemValidation[],
};

export const VALIDATED_ITEM_CONTEXT: ApiConfig = {
  items: [VALIDATED_ITEM],
  itemValidationGroups: [iVG],
};
