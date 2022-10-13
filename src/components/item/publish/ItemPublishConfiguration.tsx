import { RecordOf } from 'immutable';

import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Looks3Icon from '@mui/icons-material/Looks3';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import UpdateIcon from '@mui/icons-material/Update';
import { Box, Button, Divider, Typography } from '@mui/material';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { DATA_KEYS, MUTATION_KEYS } from '@graasp/query-client';
import { Item } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import {
  ADMIN_CONTACT,
  VALIDATION_STATUS_NAMES,
} from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks, queryClient, useMutation } from '../../../config/queryClient';
import {
  ITEM_PUBLISH_SECTION_TITLE_ID,
  ITEM_VALIDATION_BUTTON_ID,
} from '../../../config/selectors';
import { getValidationStatusFromItemValidations } from '../../../utils/itemValidation';
import CategorySelection from './CategorySelection';
import CoEditorSettings from './CoEditorSettings';
import CustomizedTagsEdit from './CustomizedTagsEdit';
import ItemPublishButton from './ItemPublishButton';

const { POST_ITEM_VALIDATION } = MUTATION_KEYS;
const { buildItemValidationAndReviewKey } = DATA_KEYS;
const {
  useItemValidationAndReview,
  useItemValidationGroups,
  useItemValidationStatuses,
  useItemValidationReviewStatuses,
} = hooks;

type Props = {
  item: RecordOf<Item>;
};

const ItemPublishConfiguration: FC<Props> = ({ item }) => {
  const { t } = useBuilderTranslation();
  // current item
  const { itemId } = useParams();

  // item validation
  const { mutate: validateItem } = useMutation(POST_ITEM_VALIDATION);

  // get map of item validation and review statuses
  const { data: ivStatuses } = useItemValidationStatuses();
  const { data: ivrStatuses } = useItemValidationReviewStatuses();
  const validationStatusesMap = new Map(
    ivStatuses?.concat(ivrStatuses)?.map((entry) => [entry?.id, entry?.name]),
  );

  // get item validation data
  const { data: itemValidationData, isLoading } =
    useItemValidationAndReview(itemId);
  // check if validation is still valid
  const iVId =
    new Date(itemValidationData?.createdAt) >= new Date(item?.updatedAt)
      ? itemValidationData?.itemValidationId
      : null;
  // get item validation groups
  const { data: itemValidationGroups } = useItemValidationGroups(iVId);

  // group iv records by item validation status
  const ivByStatus = itemValidationGroups?.groupBy(
    ({ statusId }) => validationStatusesMap[statusId],
  );

  const [itemValidationStatus, setItemValidationStatus] = useState(
    VALIDATION_STATUS_NAMES.NOT_VALIDATED,
  );

  useEffect(() => {
    // process when we fetch the item validation and review records
    if (ivByStatus) {
      setItemValidationStatus(
        getValidationStatusFromItemValidations(
          ivByStatus,
          validationStatusesMap,
          itemValidationData,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ivByStatus]);

  if (isLoading) {
    return <Loader />;
  }

  const handleValidate = () => {
    // prevent re-send request if the item is already successfully validated
    if (!(itemValidationStatus === VALIDATION_STATUS_NAMES.SUCCESS)) {
      validateItem({ itemId });
    }
    setItemValidationStatus(VALIDATION_STATUS_NAMES.PENDING_AUTOMATIC);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries(buildItemValidationAndReviewKey(itemId));
  };

  // display icon indicating current status of given item
  const displayItemValidationIcon = () => {
    switch (itemValidationStatus) {
      case VALIDATION_STATUS_NAMES.SUCCESS:
        return <CheckCircleIcon color="primary" />;
      case VALIDATION_STATUS_NAMES.PENDING_AUTOMATIC:
        return <UpdateIcon color="primary" />;
      case VALIDATION_STATUS_NAMES.PENDING_MANUAL:
        return <UpdateIcon color="primary" />;
      case VALIDATION_STATUS_NAMES.FAILURE:
        return <CancelIcon color="primary" />;
      default:
    }
    return null;
  };

  const displayItemValidationMessage = () => {
    switch (itemValidationStatus) {
      case VALIDATION_STATUS_NAMES.PENDING_AUTOMATIC:
        return (
          <Typography variant="body1">
            {t(
              'Your item is pending automatic validation. Once the validation succeeds, you will be able to publish your item.',
            )}
          </Typography>
        );
      case VALIDATION_STATUS_NAMES.PENDING_MANUAL:
        return (
          <Typography variant="body1">
            {t(
              'Your item failed the automatic validation. A member of our team will manually check your collection, please wait for the result.',
            )}
          </Typography>
        );
      case VALIDATION_STATUS_NAMES.FAILURE:
        return (
          <Typography variant="body1">
            {t('itemValidationFailureMessage', { contact: ADMIN_CONTACT })}
          </Typography>
        );
      default:
    }
    return null;
  };

  return (
    <>
      <Typography variant="h6" mt={2} id={ITEM_PUBLISH_SECTION_TITLE_ID}>
        {t(BUILDER.LIBRARY_SETTINGS_TITLE)}
      </Typography>
      <Typography variant="body1">
        {t(BUILDER.LIBRARY_SETTINGS_INFORMATION)}
      </Typography>
      <Typography variant="h6" sx={{ mt: 1 }}>
        <LooksOneIcon color="primary" mr={2} />
        {t(BUILDER.LIBRARY_SETTINGS_VALIDATION_TITLE)}
      </Typography>
      <Typography variant="body1">
        {t(
          'You need to validate your item before publish it. Please allow some time for the validation to finish.',
        )}
      </Typography>
      <Button
        id={ITEM_VALIDATION_BUTTON_ID}
        variant="outlined"
        onClick={handleValidate}
        color="primary"
        endIcon={displayItemValidationIcon()}
      >
        {t('Validate')}
      </Button>
      <Button variant="outlined" onClick={handleRefresh} color="primary">
        {t('Refresh')}
      </Button>
      {displayItemValidationMessage()}
      <Typography variant="h6" mt={2}>
        <LooksTwoIcon color="primary" mr={2} />
        {t('Publication')}
      </Typography>
      <Typography variant="body1">
        {t(
          'Once your item is validated, you can set your item to published by clicking the button.',
        )}
      </Typography>
      <ItemPublishButton
        item={item}
        isValidated={itemValidationStatus === VALIDATION_STATUS_NAMES.SUCCESS}
      />
      <Typography variant="h6" mt={2}>
        <Looks3Icon color="primary" sx={{ mr: 2 }} />
        {t('Configuration')}
      </Typography>
      <Typography variant="body1">
        {t(
          'Set the options for your resource to make it easily accessible by the public.',
        )}
      </Typography>
      <Box mx={3}>
        <CoEditorSettings item={item} />
        <CategorySelection item={item} />
        <CustomizedTagsEdit item={item} />
      </Box>
    </>
  );
};

export default ItemPublishConfiguration;
