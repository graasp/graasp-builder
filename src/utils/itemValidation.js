import {
  ITEM_VALIDATION_REVIEW_STATUSES,
  ITEM_VALIDATION_STATUSES,
} from '../config/constants';

export const processFailureValidations = (records, validationStatusesMap) => {
  // first try to find successful validations, where ivrStatus is 'rejected'
  const successfulRecord = records?.find(
    (record) =>
      validationStatusesMap.get(record.reviewStatusId) ===
      ITEM_VALIDATION_REVIEW_STATUSES.REJECTED,
  );
  if (successfulRecord) return ITEM_VALIDATION_STATUSES.SUCCESS;

  // try to find pending review
  const pendingRecord = records?.find(
    (record) =>
      validationStatusesMap.get(record.reviewStatusId) ===
      ITEM_VALIDATION_REVIEW_STATUSES.PENDING,
  );
  if (pendingRecord) return ITEM_VALIDATION_STATUSES.PENDING;
  return ITEM_VALIDATION_STATUSES.FAILURE; // only failed records
};

export const getValidationStatusFromItemValidations = (
  ivByStatus,
  validationStatusesMap,
) => {
  // first check if there exist any valid successful record
  if (ivByStatus.get(ITEM_VALIDATION_STATUSES.SUCCESS))
    return ITEM_VALIDATION_STATUSES.SUCCESS;
  // then check if there exist any pending item validation or review
  if (ivByStatus.get(ITEM_VALIDATION_STATUSES.PENDING))
    return ITEM_VALIDATION_STATUSES.PENDING;

  const failureValidations = ivByStatus.get(ITEM_VALIDATION_STATUSES.FAILURE);
  // only process when there is failed item validation records
  if (failureValidations)
    return processFailureValidations(failureValidations, validationStatusesMap);

  return false;
};
