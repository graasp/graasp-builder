import {
  ITEM_VALIDATION_REVIEW_STATUSES,
  ITEM_VALIDATION_STATUSES,
  VALIDATION_STATUS_NAMES,
} from '../config/constants';

export const processFailureValidations = (
  validationStatusesMap,
  itemValidationData,
) => {
  switch (
    validationStatusesMap?.get(itemValidationData?.get('reviewStatusId'))
  ) {
    case ITEM_VALIDATION_REVIEW_STATUSES.PENDING:
      return VALIDATION_STATUS_NAMES.PENDING_MANUAL;
    case ITEM_VALIDATION_REVIEW_STATUSES.REJECTED:
      return VALIDATION_STATUS_NAMES.SUCCESS;
    case ITEM_VALIDATION_REVIEW_STATUSES.ACCEPTED:
      return VALIDATION_STATUS_NAMES.FAILURE;
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
    return VALIDATION_STATUS_NAMES.PENDING_AUTOMATIC;

  const failureValidations = ivByStatus.get(ITEM_VALIDATION_STATUSES.FAILURE);
  // only process when there is failed item validation records
  if (failureValidations) {
    return processFailureValidations(validationStatusesMap, itemValidationData);
  }

  // if no pending and no failed entry, validation is successful
  return VALIDATION_STATUS_NAMES.SUCCESS;
};
