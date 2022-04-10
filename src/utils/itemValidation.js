import {
  ITEM_VALIDATION_REVIEW_STATUSES,
  ITEM_VALIDATION_STATUSES,
} from '../config/constants';

export const processFailureValidations = (
  validationStatusesMap,
  itemValidationData,
) => {
  switch (validationStatusesMap?.get(itemValidationData?.reviewStatusId)) {
    case ITEM_VALIDATION_REVIEW_STATUSES.PENDING:
      return ITEM_VALIDATION_STATUSES.PENDING;
    case ITEM_VALIDATION_REVIEW_STATUSES.REJECTED:
      return ITEM_VALIDATION_STATUSES.SUCCESS;
    case ITEM_VALIDATION_REVIEW_STATUSES.ACCEPTED:
      return ITEM_VALIDATION_STATUSES.FAILURE;
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
  if (ivByStatus.get(ITEM_VALIDATION_STATUSES.PENDING))
    return ITEM_VALIDATION_STATUSES.PENDING;

  const failureValidations = ivByStatus.get(ITEM_VALIDATION_STATUSES.FAILURE);
  // only process when there is failed item validation records
  if (failureValidations) {
    return processFailureValidations(validationStatusesMap, itemValidationData);
  }

  // if no pending and no failed entry, validation is successful
  return ITEM_VALIDATION_STATUSES.SUCCESS;
};
