import { SAMPLE_PUBLIC_ITEMS } from './items';

export const VALIDATED_ITEM = {
  ...SAMPLE_PUBLIC_ITEMS.items[0],
  updatedAt: new Date('2019-07-27T07:45:00Z'),
};

export const SAMPLE_STATUSES = [
  {
    id: 'status-id1',
    name: 'success',
  },
  {
    id: 'status-id2',
    name: 'pending',
  },
];

export const ITEM_VALIDATION_AND_REVIEW = {
  itemValidationId: '6cbe87b9-0098-412f-a1ab-93e140ae1659',
  reviewStatusId: '',
  reviewReason: '',
  createdAt: new Date('2023-07-27T07:45:00Z'),
};

export const ITEM_VALIDATION_GROUPS = [
  {
    id: 'id1',
    itemId: 'item-id1',
    itemValidationId: '6cbe87b9-0098-412f-a1ab-93e140ae1659',
    processId: 'process-id1',
    statusId: 'status-id1',
    result: '',
    updatedAt: '',
    createdAt: '',
  },
  {
    id: 'id1',
    itemId: 'item-id1',
    itemValidationId: '6cbe87b9-0098-412f-a1ab-93e140ae1659',
    processId: 'process-id2',
    statusId: 'status-id1',
    result: '',
    updatedAt: '',
    createdAt: '',
  },
];
