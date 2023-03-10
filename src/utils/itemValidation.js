import { ItemValidationReviewStatus, ItemValidationStatus } from '@graasp/sdk';

export const processFailureValidations = (
  validationStatusesMap,
  itemValidationData,
) => {
  switch (
    validationStatusesMap?.get(itemValidationData?.get('reviewStatusId'))
  ) {
    case ItemValidationReviewStatus.PENDING:
      return ItemValidationStatus.PendingManual;
    case ItemValidationReviewStatus.REJECTED:
      return ItemValidationStatus.SUCCESS;
    case ItemValidationReviewStatus.ACCEPTED:
      return ItemValidationStatus.FAILURE;
    default:
      return false;
  }
};

export const getValidationStatusFromItemValidations = (
  ivByStatus,
  validationStatusesMap,
  itemValidationData,
) => {
  // first check if there exist any pending entry
  if (ivByStatus.get(ItemValidationStatus.Pending))
    return ItemValidationStatus.PENDING_AUTOMATIC;

  const failureValidations = ivByStatus.get(ItemValidationStatus.Failure);
  // only process when there is failed item validation records
  if (failureValidations) {
    return processFailureValidations(validationStatusesMap, itemValidationData);
  }

  // if no pending and no failed entry, validation is successful
  return ItemValidationStatus.SUCCESS;
};
